# 8. Explicación de la solución end-to-end

## Objetivo

Este documento explica cómo funciona la solución de principio a fin: flujo, datos, reglas, IA y uso dentro de la empresa.

## Flujo completo

```text
1. Usuario entra en la web
2. Lee la propuesta de valor
3. Abre el copiloto comercial
4. Selecciona una necesidad o escribe texto libre
5. El sistema clasifica la consulta
6. El copiloto hace preguntas guiadas
7. Se muestran avisos de privacidad y límites técnicos
8. El usuario aporta datos mínimos
9. Se genera una solicitud comercial
10. La solicitud se guarda en demo
11. El panel interno la muestra
12. Las analíticas agregan la información
13. El equipo comercial/técnico revisaría la ficha
```

## Datos que viajan por el sistema

### Entrada del usuario

- Texto libre.
- Opción seleccionada.
- Respuestas a preguntas.
- Datos de contacto.
- Observaciones.

### Datos generados por el sistema

- Familia comercial.
- Prioridad.
- Estado.
- Revisión técnica.
- Resumen comercial.
- Borrador de respuesta.
- Datos pendientes.
- Señales detectadas.

## Uso del LLM

El LLM puede intervenir en cuatro momentos:

### 1. Consulta libre

Analiza el mensaje del usuario para detectar intención, familia y riesgo.

### 2. Durante el flujo

Puede ayudar a reajustar prioridad, datos pendientes o siguiente pregunta.

### 3. Al generar resumen

Convierte la información recogida en una ficha comercial clara.

### 4. En el panel interno

Puede preparar un borrador de respuesta para que el equipo comercial lo revise.

## Reglas locales

El sistema no depende solo de IA. Las reglas locales cubren:

- Palabras clave por familia.
- Detección de riesgo técnico.
- Flujos obligatorios.
- Validación básica de email.
- Fallback si no hay IA.
- Generación de resumen local.

## Ejemplo de flujo

### Entrada

```text
Necesito proteger el borde de un forjado durante una obra en Toledo.
```

### Clasificación

```text
Familia: protección provisional
Intención: solicitar orientación/presupuesto
Prioridad: media
Revisión técnica: posible, según soporte y fijación
```

### Preguntas

- ¿Qué tipo de obra es?
- ¿Cuál es la ubicación aproximada?
- ¿El soporte es forjado, cubierta, muro u otro?
- ¿Se puede perforar?
- ¿Qué longitud aproximada hay que proteger?
- ¿Qué urgencia tiene?
- ¿Nombre, empresa, correo y teléfono?

### Resultado

```text
Solicitud comercial generada
Familia: protección provisional de borde
Estado: nueva
Prioridad: media
Siguiente acción: revisión comercial y posible validación técnica
```

## Arquitectura técnica

```text
src/App.tsx
  ├─ PublicDemoPage
  ├─ AdminDemoPage
  ├─ AnalyticsPage
  └─ PracticasPage

ChatWidget
  ├─ Flujos guiados
  ├─ Reglas locales
  ├─ Servicios IA
  └─ Generación de lead

server/
  ├─ ai/routes.js
  ├─ ai/systemPrompt.js
  ├─ ai/validators.js
  ├─ db/routes.js
  └─ twilio/routes.js
```

## Persistencia

La demo usa:

- `localStorage` para solicitudes locales.
- Datos mock para simular histórico.
- Backend opcional para Supabase.

## Por qué se entiende el flujo en empresa

El flujo se parece a un proceso comercial real:

1. Entrada de oportunidad.
2. Cualificación.
3. Priorización.
4. Derivación técnica.
5. Seguimiento.
6. Análisis agregado.

## Frase de defensa

“La solución cubre el ciclo completo: desde el primer mensaje del cliente hasta una ficha comercial revisable en el panel interno.”
