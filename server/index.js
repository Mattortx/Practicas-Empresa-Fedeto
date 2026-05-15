import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
loadEnvFile(join(rootDir, ".env"));
loadEnvFile(join(rootDir, ".env.local"));

const port = Number(process.env.PORT ?? 8787);
const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const apiKey = process.env.OPENAI_API_KEY;
const distDir = join(rootDir, "dist");

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "intent",
    "productFamilyId",
    "suggestedFlowId",
    "requiresTechnicalReview",
    "confidence",
    "answer",
    "nextAction",
    "technicalWarnings"
  ],
  properties: {
    intent: {
      type: "string",
      enum: [
        "provisional",
        "definitiva",
        "bases-casquillos",
        "auxiliares",
        "consumibles",
        "medida",
        "presupuesto",
        "desconocido",
        "documentacion",
        "contacto",
        "faq"
      ]
    },
    productFamilyId: {
      type: "string",
      enum: [
        "provisional",
        "definitiva",
        "bases-casquillos",
        "auxiliares",
        "consumibles",
        "medida",
        "none"
      ]
    },
    suggestedFlowId: {
      type: "string",
      enum: [
        "provisional",
        "definitiva",
        "bases-casquillos",
        "auxiliares",
        "consumibles",
        "medida",
        "presupuesto",
        "desconocido",
        "documentacion",
        "none"
      ]
    },
    requiresTechnicalReview: { type: "boolean" },
    confidence: { type: "number" },
    answer: { type: "string" },
    nextAction: { type: "string" },
    technicalWarnings: {
      type: "array",
      maxItems: 3,
      items: { type: "string" }
    }
  }
};

const instructions = [
  "Eres el copiloto comercial de Protecciones Toledo S.L.",
  "Tu objetivo es orientar consultas comerciales sobre proteccion en altura y preparar la siguiente pregunta o flujo.",
  "Familias permitidas: provisional, definitiva, bases-casquillos, auxiliares, consumibles, medida.",
  "No inventes precios, stock, plazos, normativa, certificaciones, ensayos, resistencias, calculos ni instrucciones de montaje.",
  "Si el usuario pregunta por normativa, certificacion, instalacion, resistencia, calculo, anclaje, montaje, cumplimiento, ficha tecnica, ensayo o seguridad estructural, marca requiresTechnicalReview=true y suggestedFlowId=documentacion.",
  "Si la consulta puede resolverse mejor con los flujos guiados, devuelve suggestedFlowId con el flujo mas probable.",
  "Responde en tono profesional, prudente, tecnico y comercial, sin ser agresivo.",
  "Devuelve solo JSON que cumpla el esquema."
].join("\n");

const server = createServer(async (request, response) => {
  applyCors(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  try {
    if (request.url === "/health") {
      sendJson(response, 200, {
        ok: true,
        aiConfigured: Boolean(apiKey),
        model
      });
      return;
    }

    if (request.url === "/api/copilot" && request.method === "POST") {
      await handleCopilot(request, response);
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    sendJson(response, 500, {
      available: false,
      error: "server_error",
      message: error instanceof Error ? error.message : "Error inesperado"
    });
  }
});

server.listen(port, () => {
  console.log(`Copilot API listening on http://localhost:${port}`);
});

async function handleCopilot(request, response) {
  const body = await readJsonBody(request);
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    sendJson(response, 400, {
      available: false,
      error: "missing_message",
      message: "Falta el mensaje del usuario."
    });
    return;
  }

  if (!apiKey) {
    sendJson(response, 200, {
      available: false,
      mode: "rules",
      reason: "missing_api_key",
      answer: "IA no configurada. El copiloto continua con reglas y flujos controlados."
    });
    return;
  }

  const aiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      instructions,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                message,
                context: body.context ?? {},
                allowedFlows: [
                  "provisional",
                  "definitiva",
                  "bases-casquillos",
                  "auxiliares",
                  "consumibles",
                  "medida",
                  "presupuesto",
                  "desconocido",
                  "documentacion"
                ]
              })
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "commercial_copilot_decision",
          schema: responseSchema,
          strict: true
        }
      },
      max_output_tokens: 700
    })
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    sendJson(response, 502, {
      available: false,
      error: "openai_error",
      message: "No se pudo obtener respuesta de IA.",
      detail: errorText.slice(0, 600)
    });
    return;
  }

  const raw = await aiResponse.json();
  const outputText = raw.output_text ?? extractOutputText(raw);
  const parsed = safeJsonParse(outputText);

  if (!parsed) {
    sendJson(response, 502, {
      available: false,
      error: "invalid_ai_json",
      message: "La IA no devolvio JSON valido."
    });
    return;
  }

  sendJson(response, 200, {
    available: true,
    mode: "ai",
    model,
    ...parsed
  });
}

function serveStatic(request, response) {
  if (!existsSync(distDir)) {
    sendJson(response, 404, {
      available: false,
      error: "not_found",
      message: "API activa. Ejecuta npm.cmd run dev para la web o npm.cmd run build para servir dist."
    });
    return;
  }

  const requestPath = new URL(request.url ?? "/", `http://localhost:${port}`).pathname;
  const relativePath = requestPath.replace(/^\/+/, "");
  const filePath = requestPath === "/" || requestPath === "/admin-demo"
    ? join(distDir, "index.html")
    : join(distDir, relativePath);

  if (!filePath.startsWith(distDir) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const contentType = getContentType(filePath);
  response.writeHead(200, { "Content-Type": contentType });
  response.end(readFileSync(filePath));
}

function readJsonBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let rawBody = "";

    request.on("data", (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 64_000) {
        request.destroy();
        rejectBody(new Error("Request too large"));
      }
    });

    request.on("end", () => {
      resolveBody(safeJsonParse(rawBody) ?? {});
    });

    request.on("error", rejectBody);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

function applyCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractOutputText(raw) {
  const output = Array.isArray(raw.output) ? raw.output : [];
  return output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .map((content) => content.text ?? "")
    .join("")
    .trim();
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getContentType(filePath) {
  const extension = extname(filePath);

  if (extension === ".html") {
    return "text/html; charset=utf-8";
  }

  if (extension === ".js") {
    return "text/javascript; charset=utf-8";
  }

  if (extension === ".css") {
    return "text/css; charset=utf-8";
  }

  if (extension === ".json") {
    return "application/json; charset=utf-8";
  }

  return "application/octet-stream";
}
