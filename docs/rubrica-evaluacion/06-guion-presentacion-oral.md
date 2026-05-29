# 6. Guion de presentación oral

## Objetivo del guion

Este documento prepara una presentación clara, ordenada y convincente. Está pensado para una exposición de entre 7 y 10 minutos.

La estructura sigue el patrón:

1. Introducción.
2. Problema.
3. Solución.
4. Demo.
5. Valor.
6. Límites.
7. Cierre.

## Mensaje inicial

“El proyecto que presento es un copiloto comercial para Protecciones Toledo, una empresa dedicada a sistemas metálicos de protección en altura. La idea no es crear un chatbot genérico, sino una herramienta que ayude a cualificar consultas comerciales, detectar riesgos técnicos y preparar una ficha útil para el equipo interno.”

## Estructura por tiempos

| Tiempo | Bloque | Objetivo |
|---|---|---|
| 0:00 - 0:45 | Presentación | Explicar qué es el proyecto |
| 0:45 - 2:00 | Problema | Contexto de empresa y pain point |
| 2:00 - 3:30 | Solución | Chatbot + copiloto comercial |
| 3:30 - 6:30 | Demo | Flujo público, panel y analíticas |
| 6:30 - 7:30 | IA y seguridad | Explicar uso prudente de IA |
| 7:30 - 8:30 | Valor y KPIs | Beneficio para empresa |
| 8:30 - 9:30 | Límites y mejoras | Reconocer alcance |
| 9:30 - 10:00 | Cierre | Resumen final |

## Guion completo

### 1. Introducción

Buenos días. Este proyecto se ha desarrollado como práctica FEDETO y está orientado a una empresa real: Protecciones Toledo S.L.

Protecciones Toledo trabaja con sistemas de protección en altura: protección provisional y definitiva de borde, bases, casquillos, auxiliares, consumibles y soluciones a medida para obra.

La propuesta consiste en una aplicación web demostrativa que integra un chatbot, pero con una lógica interna de copiloto comercial.

### 2. Problema

En una empresa técnica, muchas consultas iniciales llegan incompletas. Un cliente puede escribir “necesito una barandilla para una cubierta”, pero no indicar si la solución es provisional o definitiva, si se puede perforar, qué longitud hay que proteger, dónde está la obra o si necesita documentación técnica.

Eso obliga al equipo comercial a pedir aclaraciones antes de poder responder. Además, algunas consultas son sensibles porque preguntan por normativa, montaje, resistencia o cálculo. Esas consultas no deberían ser resueltas automáticamente por un chatbot.

### 3. Solución

La solución es un copiloto comercial integrado en la web.

El usuario ve una conversación sencilla, pero internamente el sistema:

- Clasifica la necesidad.
- Formula preguntas útiles.
- Detecta riesgo técnico.
- Recoge datos mínimos.
- Genera una ficha comercial.
- Muestra la solicitud en un panel interno.
- Permite analizar tendencias mediante gráficos.

La IA se usa como apoyo, no como sustituto de las reglas ni del criterio técnico.

### 4. Demo

Primero muestro la vista pública. Aquí se explica el valor del copiloto, las familias comerciales y el flujo de trabajo.

Después pruebo el chatbot con una consulta, por ejemplo:

“Necesito proteger el borde de un forjado durante una obra en Toledo.”

El sistema clasifica la consulta como protección provisional, hace preguntas de seguimiento y genera una solicitud.

Luego paso al panel interno en `/admin-demo`, donde se ve el listado de solicitudes, filtros, prioridad, estado y detalle.

Finalmente abro `/admin-demo/analytics`, donde se visualizan métricas por familia, prioridad, estado y evolución temporal.

### 5. IA y seguridad

La IA puede interpretar texto libre, clasificar consultas, sugerir preguntas, resumir solicitudes y preparar borradores.

Pero tiene límites claros:

- No calcula estructuras.
- No confirma normativa.
- No da instrucciones de montaje.
- No inventa precios ni plazos.
- No sustituye al equipo técnico.

Si el usuario pregunta por normativa, certificación, resistencia, montaje o anclaje, la consulta se marca para revisión técnica.

### 6. Valor para negocio

El valor para Protecciones Toledo está en mejorar la calidad de la primera consulta.

La empresa podría recibir solicitudes más ordenadas, filtrar oportunidades por familia, priorizar casos urgentes y derivar correctamente las consultas técnicas.

Esto puede reducir tiempo de aclaración y mejorar la respuesta comercial.

### 7. Límites

El proyecto es una demo. No tiene autenticación real en el panel, no envía correos reales, no se conecta todavía a un CRM y no valida documentación técnica oficial.

Estos límites son intencionados porque el objetivo es un MVP defendible, no una aplicación productiva cerrada.

### 8. Cierre

En resumen, el proyecto demuestra cómo aplicar IA de forma útil y prudente en una empresa industrial. El chatbot es la interfaz visible, pero el valor está en el copiloto comercial: clasificar, preguntar, resumir y derivar.

## Frase final recomendada

“El objetivo no es que la IA decida por la empresa, sino que ayude a que cada consulta llegue mejor preparada al equipo comercial y técnico.”

## Consejos de exposición

- No empezar por tecnología; empezar por problema de negocio.
- Enseñar la demo pronto.
- Repetir que la IA no sustituye revisión técnica.
- Usar un caso concreto.
- No saturar con detalles de código.
- Tener preparado el panel antes de empezar.
- Cerrar con valor y próximos pasos.
