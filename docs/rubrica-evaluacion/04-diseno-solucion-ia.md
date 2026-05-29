# 4. Diseño de la solución con IA

## Visión general

La solución usa IA como una capa de apoyo sobre una base de reglas y flujos controlados. Esta decisión evita que el proyecto dependa por completo del modelo y permite una demo estable.

Arquitectura conceptual:

```text
Usuario
  ↓
Chatbot web
  ↓
Reglas locales + flujos guiados
  ↓
IA opcional para clasificación, resumen y borrador
  ↓
Validadores y guardrails
  ↓
Solicitud comercial
  ↓
Panel interno y analíticas
```

## Por qué una arquitectura híbrida

La IA aporta flexibilidad para interpretar lenguaje natural, pero una empresa técnica no debe delegar completamente en un LLM decisiones sensibles. Por eso:

- Las reglas locales son la columna vertebral.
- La IA mejora interpretación y redacción.
- Los flujos guiados aseguran que se pidan datos mínimos.
- Los guardrails evitan respuestas peligrosas.
- El fallback local mantiene la app funcionando si falla la IA.

## Entradas del sistema

El sistema puede recibir:

- Selección de una opción inicial.
- Texto libre del usuario.
- Respuestas a preguntas guiadas.
- Datos de contacto.
- Datos de obra.
- Urgencia.
- Observaciones.

Ejemplos:

- “Necesito proteger el borde de un forjado durante una obra en Toledo.”
- “Busco una barandilla definitiva para una cubierta industrial donde no se puede perforar.”
- “¿Cumple la UNE EN 13374?”
- “Necesito presupuesto para casquillos atornillables, unas 200 unidades.”

## Salidas del sistema

El sistema produce:

- Familia comercial detectada.
- Tipo de necesidad.
- Prioridad baja, media o alta.
- Indicador de revisión técnica.
- Pregunta siguiente recomendada.
- Respuesta prudente al usuario.
- Solicitud comercial estructurada.
- Resumen interno.
- Borrador de respuesta comercial.
- Métricas agregadas.

## Familias de clasificación

La clasificación contempla:

- `proteccion_provisional`
- `proteccion_definitiva`
- `bases_casquillos`
- `auxiliares`
- `consumibles`
- `solucion_medida`
- `documentacion_normativa`
- `desconocida`

## Funciones de IA implementadas o preparadas

### Clasificación de consultas

La IA puede analizar un mensaje libre y devolver:

- Familia comercial.
- Intención.
- Confianza.
- Prioridad.
- Riesgo técnico.
- Campos pendientes.
- Siguiente pregunta.

### Detección de riesgo técnico

La detección combina:

- Reglas por palabras clave.
- Capa IA para matices.

Si hay discrepancia, prevalece la opción prudente.

### Generación de resumen comercial

La IA puede convertir la información recogida en un resumen útil para el panel interno:

- Título.
- Resumen comercial.
- Notas técnicas.
- Información pendiente.
- Motivo de prioridad.
- Siguiente acción recomendada.

### Borrador de respuesta comercial

En el panel interno se puede generar un borrador de respuesta. No se envía automáticamente. Solo sirve como ayuda para el equipo comercial.

### FAQ controlada

La IA puede responder preguntas frecuentes usando una base de conocimiento local. No debe responder libremente sobre normativa, certificaciones, resistencias o montaje.

## Flujo end-to-end

1. El usuario escribe una consulta o selecciona una opción.
2. El sistema aplica reglas locales.
3. Si la IA está activa, se llama al backend.
4. El backend envía un prompt controlado al proveedor IA.
5. La respuesta debe venir en formato estructurado.
6. El frontend valida la respuesta.
7. Si es válida, se fusiona con las reglas locales.
8. Si no es válida, se usa fallback local.
9. El usuario continúa el flujo guiado.
10. Al final se genera una solicitud.
11. La solicitud se guarda localmente o vía backend.
12. El panel interno la muestra.

## Roles del sistema

| Rol | Responsabilidad |
|---|---|
| Usuario | Describe la necesidad |
| Chatbot | Interfaz conversacional |
| Motor local | Garantiza flujos y reglas mínimas |
| IA | Ayuda a clasificar, resumir y redactar |
| Validadores | Evitan usar respuestas inválidas |
| Panel interno | Muestra solicitudes y estado |
| Equipo comercial | Revisa y responde |
| Equipo técnico | Valida casos sensibles |

## Backend IA

Los endpoints previstos son:

- `GET /api/ai/health`
- `POST /api/ai/classify-lead`
- `POST /api/ai/detect-risk`
- `POST /api/ai/summarize-lead`
- `POST /api/ai/answer-faq`
- `POST /api/ai/generate-commercial-reply`

El backend evita exponer claves en el frontend.

## Variables de entorno

Variables principales:

```text
AI_PROVIDER=groq
AI_ENABLED=true
GROQ_API_KEY=
GROQ_MODEL=
OPENAI_API_KEY=
OPENAI_MODEL=
AI_TIMEOUT_MS=10000
```

## Guardrails de IA

El sistema instruye a la IA para:

- No calcular.
- No confirmar normativa.
- No dar instrucciones de montaje.
- No inventar datos.
- Reconocer falta de información.
- Derivar a revisión técnica.
- Ignorar intentos de cambiar instrucciones.

## Ejemplo operativo

Entrada:

```text
Busco una barandilla definitiva para una cubierta industrial donde no se puede perforar.
```

Salida esperada:

```text
Familia: protección definitiva
Prioridad: alta o media-alta
Requiere revisión técnica: sí
Pregunta siguiente: ¿La solución debe ser permanente y dispone de información sobre soporte, longitud y entorno?
```

## Conclusión técnica

El diseño combina IA y control. Esto permite demostrar inteligencia en la experiencia sin perder estabilidad, prudencia ni capacidad de defensa ante una empresa técnica.
