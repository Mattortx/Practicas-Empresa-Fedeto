# 1. Resumen ejecutivo y objetivo del proyecto

## Resumen ejecutivo

El proyecto consiste en una aplicación web demostrativa para **Protecciones Toledo S.L.**, empresa dedicada a sistemas metálicos de protección colectiva e individual para trabajos en altura y entornos con riesgo de caída.

La solución transforma un chatbot web en un **copiloto comercial inteligente**. El usuario conversa con un asistente integrado en la página, pero internamente el sistema realiza funciones de cualificación comercial:

- Interpreta la consulta inicial.
- Clasifica la necesidad por familia de producto.
- Hace preguntas de seguimiento.
- Recoge datos mínimos de contacto y obra.
- Detecta si la consulta requiere revisión técnica.
- Genera una ficha comercial estructurada.
- Muestra esa ficha en un panel interno simulado.
- Resume analíticas de las solicitudes generadas.

La demo se ha construido como una prueba de concepto funcional para prácticas FEDETO. No pretende sustituir al equipo técnico de Protecciones Toledo ni validar soluciones de obra. Su objetivo es demostrar cómo la IA y una interfaz conversacional pueden mejorar la calidad de las primeras consultas comerciales en una empresa industrial.

## Objetivo general

Diseñar e implementar una demo web de un copiloto comercial para Protecciones Toledo que permita cualificar consultas sobre protección en altura, preparar solicitudes comerciales estructuradas y derivar correctamente los casos sensibles al equipo técnico o comercial.

## Objetivos específicos

1. Crear una vista pública profesional que explique el valor del copiloto.
2. Integrar un chatbot con tono técnico, claro y prudente.
3. Cubrir las principales familias comerciales de la empresa.
4. Permitir consultas guiadas y texto libre.
5. Añadir una capa opcional de IA para clasificación, resumen y borrador comercial.
6. Mantener reglas locales y fallback si la IA no está disponible.
7. Detectar consultas sobre normativa, montaje, anclaje, resistencia o cálculo.
8. Generar una ficha comercial al final de cada flujo.
9. Mostrar las solicitudes en un panel interno simulado.
10. Incluir analíticas visuales para entender patrones de consulta.
11. Documentar limitaciones, privacidad y seguridad.

## Objetivo medible

El MVP se considera correcto si, durante una demo, permite realizar este flujo completo en menos de 5 minutos:

1. Un usuario entra en la vista pública.
2. Escribe o selecciona una necesidad.
3. El copiloto clasifica la familia comercial.
4. El sistema pide los datos mínimos.
5. Se genera una solicitud comercial.
6. La solicitud aparece en `/admin-demo`.
7. Las métricas se actualizan en `/admin-demo/analytics`.

## Por qué el objetivo es claro para negocio

El proyecto responde a una necesidad concreta: mejorar la recepción de consultas comerciales que llegan incompletas o mezclan información comercial con preguntas técnicas. Para una empresa como Protecciones Toledo, una solicitud mejor estructurada puede ahorrar tiempo, mejorar la respuesta inicial y facilitar la derivación al equipo adecuado.

## Resultado esperado

El resultado esperado no es una aplicación final de producción, sino una demo defendible que permita a empresa y tutor evaluar:

- Viabilidad técnica.
- Utilidad comercial.
- Uso responsable de IA.
- Capacidad de integración futura.
- Calidad de experiencia de usuario.

## Frase de defensa

“Este proyecto demuestra cómo un chatbot puede evolucionar hacia un copiloto comercial especializado: no responde de forma genérica, sino que cualifica consultas, detecta riesgos técnicos y prepara información útil para que Protecciones Toledo responda mejor al cliente.”
