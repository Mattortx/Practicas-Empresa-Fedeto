export async function callStructuredOpenAI({
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
    return null;
  }
}
