# 10. Preguntas y defensa

## Objetivo

Preparar respuestas sólidas para preguntas del tutor, empresa o evaluador. El criterio de evaluación valora reconocer límites, responder con seguridad y proponer mitigaciones.

## Preguntas sobre objetivo

### ¿Cuál es el objetivo real del proyecto?

El objetivo es demostrar una herramienta de cualificación comercial para Protecciones Toledo. El chatbot es la interfaz visible, pero el valor está en clasificar consultas, recoger datos mínimos, detectar riesgo técnico y generar una ficha comercial.

### ¿Por qué no es solo un chatbot?

Porque no se limita a contestar. Tiene lógica de copiloto: clasifica, guía, resume, puntúa prioridad, marca revisión técnica y alimenta un panel interno.

## Preguntas sobre negocio

### ¿Qué gana Protecciones Toledo?

Gana consultas mejor estructuradas, menos intercambio inicial para pedir datos básicos, priorización de oportunidades y derivación prudente al equipo técnico.

### ¿Qué proceso mejora?

Mejora la entrada de consultas comerciales desde la web: desde que el cliente tiene una necesidad hasta que el equipo interno recibe una ficha revisable.

### ¿Cómo se mediría el impacto?

Con KPIs como porcentaje de solicitudes completas, tasa de clasificación correcta, tiempo hasta ficha comercial, consultas técnicas detectadas y número de oportunidades por familia.

## Preguntas sobre IA

### ¿Qué aporta la IA?

La IA ayuda a interpretar texto libre, clasificar necesidades, sugerir preguntas, redactar resúmenes y preparar borradores comerciales.

### ¿Qué pasa si falla la IA?

La aplicación sigue funcionando con reglas locales y flujos guiados. La IA es complementaria, no obligatoria.

### ¿Por qué usar Groq u OpenAI en backend?

Para no exponer claves en el frontend y poder controlar validación, timeout, prompts y fallbacks desde servidor.

### ¿La IA puede inventar datos?

Ese riesgo existe en cualquier LLM. Por eso el sistema incluye guardrails, validación de salidas, base de conocimiento controlada y mensajes que impiden confirmar precios, normativa, cálculos o montaje.

## Preguntas técnicas

### ¿Qué stack usa?

React, Vite, TypeScript, Vitest, Node, datos TypeScript, backend opcional, servicios IA y preparación para Supabase/Twilio.

### ¿Dónde está la lógica del copiloto?

En los componentes del chat, los flujos conversacionales, las utilidades de scoring/riesgo y los servicios IA.

### ¿Dónde se guardan las solicitudes?

En modo demo se guardan en `localStorage` y se combinan con datos mock. También existe preparación para backend y Supabase.

### ¿Qué rutas tiene?

- `/`
- `/admin-demo`
- `/admin-demo/analytics`
- `/practicas`

## Preguntas sobre privacidad

### ¿Qué datos personales recoge?

Nombre, empresa, correo, teléfono y datos básicos de la obra o consulta. No se deben introducir datos sensibles.

### ¿Dónde se almacenan?

En la demo local, principalmente en el navegador mediante `localStorage`. En preproducción puede configurarse backend y Supabase.

### ¿Cumple RGPD?

Como demo, aplica principios de minimización, aviso de privacidad y no exposición de claves. Para producción haría falta revisión legal completa, política de privacidad específica, consentimiento y gestión de derechos.

## Preguntas sobre límites

### ¿Puede recomendar una solución técnica definitiva?

No. Puede orientar comercialmente, pero la solución definitiva debe revisarse por personal competente.

### ¿Puede confirmar normativa?

No. Las consultas normativas se marcan para revisión técnica y deben apoyarse en documentación oficial.

### ¿Puede hacer cálculos?

No. El sistema no realiza cálculos estructurales.

### ¿Puede dar instrucciones de montaje?

No. Puede recoger la consulta para que el equipo técnico responda.

## Preguntas sobre producción

### ¿Qué faltaría para producción?

- Autenticación.
- Integración con CRM o correo.
- Política de privacidad formal.
- Base documental validada.
- RAG controlado.
- Monitorización.
- Gestión de usuarios y permisos.
- Retención y borrado de datos.

### ¿Cómo se integraría en la web real?

Como widget embebible o componente dentro de WordPress, conectado a un backend seguro para enviar solicitudes al canal comercial.

## Preguntas críticas

### ¿Por qué no usar directamente ChatGPT en la web?

Porque una empresa técnica necesita control, trazabilidad, límites y seguridad. Este proyecto usa IA de forma acotada, con reglas, validadores, fallback y derivación técnica.

### ¿Qué pasa si un usuario intenta manipular la IA?

El sistema tiene defensas básicas contra prompt injection y responde de forma prudente. No revela claves ni ignora sus reglas de seguridad.

### ¿Cómo se evita que el usuario crea que la respuesta es definitiva?

Con avisos explícitos, mensajes prudentes y marcando revisión técnica cuando aparece normativa, cálculo, montaje o anclaje.

## Respuesta final para preguntas difíciles

“La demo no intenta automatizar decisiones técnicas. Automatiza la preparación de la consulta. Esa diferencia es clave para aplicar IA de forma segura en una empresa industrial.”
