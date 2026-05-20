export async function callStructuredLlm({
  provider = "openai",
  apiKey,
  model,
  instructions,
  schemaName,
  schema,
  input,
  maxOutputTokens = 800,
  timeoutMs = 10000
}) {
  if (provider === "groq") {
    return callStructuredGroq({
      apiKey,
      model,
      instructions,
      schemaName,
      schema,
      input,
      maxOutputTokens,
      timeoutMs
    });
  }

  return callStructuredOpenAI({
    apiKey,
    model,
    instructions,
    schemaName,
    schema,
    input,
    maxOutputTokens,
    timeoutMs
  });
}

async function callStructuredGroq({
  apiKey,
  model,
  instructions,
  schemaName,
  schema,
  input,
  maxOutputTokens,
  timeoutMs
}) {
  const prompt = [
    instructions,
    "Devuelve exclusivamente JSON valido. No incluyas markdown ni texto fuera del JSON.",
    `El JSON debe cumplir este schema llamado ${schemaName}: ${JSON.stringify(schema)}`
  ].join("\n\n");

  const result = await postGroqChatCompletion({
    apiKey,
    model,
    prompt,
    input,
    maxOutputTokens,
    timeoutMs,
    responseFormat: {
      type: "json_schema",
      json_schema: {
        name: schemaName,
        schema,
        strict: true
      }
    }
  });

  if (result.ok || result.status !== 400) {
    return result;
  }

  // Some Groq models may not support json_schema. JSON mode still keeps the
  // app usable, and local validators decide whether the output is accepted.
  return postGroqChatCompletion({
    apiKey,
    model,
    prompt,
    input,
    maxOutputTokens,
    timeoutMs,
    responseFormat: { type: "json_object" }
  });
}

async function postGroqChatCompletion({
  apiKey,
  model,
  prompt,
  input,
  maxOutputTokens,
  timeoutMs,
  responseFormat
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: JSON.stringify(input) }
        ],
        response_format: responseFormat,
        temperature: 0.1,
        max_completion_tokens: maxOutputTokens
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const detail = await response.text();
      return {
        ok: false,
        error: "groq_error",
        status: response.status,
        detail: detail.slice(0, 700)
      };
    }

    const raw = await response.json();
    const outputText = raw.choices?.[0]?.message?.content ?? "";
    const parsed = safeJsonParse(outputText);

    if (!parsed) {
      return { ok: false, error: "invalid_ai_json", detail: outputText.slice(0, 700) };
    }

    return { ok: true, data: parsed };
  } catch (error) {
    return {
      ok: false,
      error: error?.name === "AbortError" ? "ai_timeout" : "ai_network_error",
      detail: error instanceof Error ? error.message : "Error de red"
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function callStructuredOpenAI({
  apiKey,
  model,
  instructions,
  schemaName,
  schema,
  input,
  maxOutputTokens = 800,
  timeoutMs = 10000
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
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
            content: [{ type: "input_text", text: JSON.stringify(input) }]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: schemaName,
            schema,
            strict: true
          }
        },
        max_output_tokens: maxOutputTokens
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const detail = await response.text();
      return {
        ok: false,
        error: "openai_error",
        status: response.status,
        detail: detail.slice(0, 700)
      };
    }

    const raw = await response.json();
    const outputText = raw.output_text ?? extractOutputText(raw);
    const parsed = safeJsonParse(outputText);

    if (!parsed) {
      return { ok: false, error: "invalid_ai_json", detail: outputText.slice(0, 700) };
    }

    return { ok: true, data: parsed };
  } catch (error) {
    return {
      ok: false,
      error: error?.name === "AbortError" ? "ai_timeout" : "ai_network_error",
      detail: error instanceof Error ? error.message : "Error de red"
    };
  } finally {
    clearTimeout(timeout);
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

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    const start = value.indexOf("{");
    const end = value.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      return null;
    }

    try {
      return JSON.parse(value.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}
