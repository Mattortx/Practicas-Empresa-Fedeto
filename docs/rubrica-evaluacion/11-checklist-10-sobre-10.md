# 11. Checklist para evaluación 10/10

## Presentación documental

### 1. Resumen ejecutivo y objetivo

- [x] Explica qué es el proyecto.
- [x] Identifica empresa real.
- [x] Define objetivo general.
- [x] Define objetivos específicos.
- [x] Conecta con valor de negocio.
- [x] Es medible y entendible.

Documento: `01-resumen-ejecutivo-objetivo.md`

### 2. Contexto de empresa/proceso y problema

- [x] Describe Protecciones Toledo.
- [x] Explica familias comerciales.
- [x] Identifica proceso actual.
- [x] Define pain point.
- [x] Explica consecuencias.
- [x] Presenta proceso mejorado.

Documento: `02-contexto-empresa-proceso-problema.md`

### 3. Alcance, entregables y KPIs

- [x] Define qué incluye el MVP.
- [x] Define qué no incluye.
- [x] Lista entregables.
- [x] Define rutas y archivos.
- [x] Propone KPIs.
- [x] Define criterios de éxito.

Documento: `03-alcance-entregables-kpis.md`

### 4. Diseño de solución con IA

- [x] Describe arquitectura híbrida.
- [x] Explica inputs.
- [x] Explica outputs.
- [x] Explica flujo end-to-end.
- [x] Explica rol del LLM.
- [x] Explica validadores y fallback.

Documento: `04-diseno-solucion-ia.md`

### 5. Riesgos, ética, privacidad e implantación

- [x] Identifica riesgos.
- [x] Propone mitigaciones.
- [x] Trata privacidad.
- [x] Trata ética.
- [x] Explica límites técnicos.
- [x] Propone plan mínimo de implantación.

Documento: `05-riesgos-etica-privacidad-implantacion.md`

## Presentación oral

### 1. Estructura y claridad del discurso

- [x] Tiene introducción.
- [x] Tiene desarrollo.
- [x] Tiene cierre.
- [x] Tiene tiempos.
- [x] Tiene frase central.

Documento: `06-guion-presentacion-oral.md`

### 2. Problema, impacto y valor

- [x] Explica problema de negocio.
- [x] Explica impacto.
- [x] Identifica beneficiarios.
- [x] Usa ejemplos.
- [x] Propone KPIs.

Documento: `07-valor-negocio-impacto.md`

### 3. Explicación de solución

- [x] Explica flujo.
- [x] Explica datos.
- [x] Explica uso del LLM.
- [x] Explica reglas.
- [x] Explica panel y analíticas.

Documento: `08-explicacion-solucion-end-to-end.md`

### 4. Soportes y gestión del tiempo

- [x] Define rutas de demo.
- [x] Define comandos de evidencia.
- [x] Propone demo de 4 minutos.
- [x] Incluye casos de prueba.
- [x] Incluye plan B.

Documento: `09-soportes-demo-evidencias-tiempo.md`

### 5. Preguntas y defensa

- [x] Prepara preguntas de negocio.
- [x] Prepara preguntas técnicas.
- [x] Prepara preguntas de IA.
- [x] Prepara preguntas de privacidad.
- [x] Reconoce límites y mitigaciones.

Documento: `10-preguntas-defensa.md`

## Checklist técnico antes de presentar

Ejecutar:

```bash
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Comprobar:

- [ ] La app carga en `/`.
- [ ] El copiloto abre y responde.
- [ ] Se puede generar una solicitud.
- [ ] La solicitud aparece en `/admin-demo`.
- [ ] Las analíticas cargan en `/admin-demo/analytics`.
- [ ] La memoria visual carga en `/practicas`.
- [ ] La IA puede estar desactivada sin romper la demo.
- [ ] No se muestran claves.
- [ ] Los avisos de privacidad aparecen.
- [ ] Las respuestas técnicas son prudentes.

## Checklist oral antes de presentar

- [ ] Tener una consulta de prueba preparada.
- [ ] Tener abierto el panel interno.
- [ ] Tener abiertas las analíticas.
- [ ] Tener claro el mensaje central.
- [ ] No prometer producción.
- [ ] Repetir que la IA no sustituye revisión técnica.
- [ ] Reservar tiempo para preguntas.

## Mensaje final

Si se cubren estos puntos, el proyecto responde a todos los criterios de la rúbrica con documentación clara, técnica, aplicable y orientada a negocio.
