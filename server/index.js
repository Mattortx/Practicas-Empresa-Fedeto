import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { handleAiRoute } from "./ai/routes.js";
import { handleDbRoute } from "./db/routes.js";
import { handleTwilioRoute } from "./twilio/routes.js";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
loadEnvFile(join(rootDir, ".env"));
loadEnvFile(join(rootDir, ".env.local"));

const port = Number(process.env.PORT ?? 8787);
const provider = normalizeProvider(process.env.AI_PROVIDER ?? (process.env.GROQ_API_KEY ? "groq" : "openai"));
const model = resolveModel(provider, process.env.OPENAI_MODEL || process.env.GROQ_MODEL);
const summaryModel = process.env.OPENAI_SUMMARY_MODEL || process.env.GROQ_SUMMARY_MODEL || model;
const classifierModel = process.env.OPENAI_CLASSIFIER_MODEL || process.env.GROQ_CLASSIFIER_MODEL || model;
const apiKey = provider === "groq" ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
const aiEnabled = process.env.AI_ENABLED !== "false";
const timeoutMs = Number(process.env.AI_TIMEOUT_MS ?? 10000);
const distDir = join(rootDir, "dist");
const aiConfig = { apiKey, aiEnabled, provider, model, summaryModel, classifierModel, timeoutMs, port };
const twilioConfig = {
  webhookToken: process.env.TWILIO_WEBHOOK_TOKEN ?? "",
  publicAppUrl: process.env.PUBLIC_APP_URL ?? ""
};

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
        aiEnabled,
        aiConfigured: Boolean(apiKey),
        mode: aiEnabled && apiKey ? "ai" : "local",
        provider,
        model,
        summaryModel,
        classifierModel
      });
      return;
    }

    if (await handleAiRoute(request, response, aiConfig, sendJson)) {
      return;
    }

    if (await handleDbRoute(request, response, sendJson)) {
      return;
    }

    if (await handleTwilioRoute(request, response, twilioConfig, aiConfig)) {
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

function normalizeProvider(value) {
  return value === "groq" ? "groq" : "openai";
}

function resolveModel(activeProvider, configuredModel) {
  if (configuredModel) {
    return configuredModel;
  }

  return activeProvider === "groq" ? "llama-3.3-70b-versatile" : "gpt-5-mini";
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
  const spaRoutes = new Set(["/", "/admin-demo", "/practicas", "/practicas/tecnica"]);
  const filePath = spaRoutes.has(requestPath)
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

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

function applyCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
