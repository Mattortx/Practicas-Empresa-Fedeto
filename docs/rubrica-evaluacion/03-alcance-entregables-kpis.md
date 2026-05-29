# 3. Alcance, entregables y criterios de éxito/KPIs

## Alcance del MVP

El proyecto se limita a una demo funcional y defendible. No pretende ser una implantación completa en producción.

Incluye:

- Página pública de presentación.
- Chatbot integrado.
- Flujos guiados de cualificación.
- Capa opcional de IA.
- Generación de solicitudes comerciales.
- Panel interno simulado.
- Analíticas de demostración.
- Documentación técnica, funcional y de seguridad.

No incluye:

- CRM real.
- Envío real de correos.
- Autenticación productiva.
- Cálculos estructurales.
- Confirmación normativa.
- Validación técnica automática.
- Sustitución del equipo técnico.

## Entregables

| Entregable | Descripción | Ruta o archivo |
|---|---|---|
| Vista pública | Página principal con valor, contexto y copiloto | `/` |
| Chatbot/copiloto | Interfaz conversacional con flujos e IA opcional | `src/components/commercial-copilot/` |
| Panel interno | Listado y detalle de solicitudes | `/admin-demo` |
| Analíticas | Gráficos, contadores y tendencias | `/admin-demo/analytics` |
| Memoria visual | Explicación del proyecto dentro de la app | `/practicas` |
| Datos mock | 100 casos simulados | `src/data/mockLeads.ts` |
| Base de conocimiento | Contenido controlado para respuestas | `src/data/knowledgeBase.ts` |
| Backend IA | Endpoints para clasificación, resumen y FAQ | `server/ai/` |
| Documentación empresa/tutor | Memoria formal | `docs/memoria-proyecto-empresa-tutor.md` |
| Seguridad y privacidad | Riesgos y medidas | `docs/seguridad-privacidad.md` |

## Criterios de éxito funcional

La demo se considera satisfactoria si:

1. Carga correctamente en local.
2. El usuario puede iniciar una conversación.
3. El copiloto clasifica una consulta.
4. El sistema detecta consultas técnicas sensibles.
5. El flujo recoge datos mínimos.
6. Se genera una solicitud comercial.
7. La solicitud aparece en el panel interno.
8. El panel permite filtrar y revisar detalle.
9. Las analíticas muestran datos agregados.
10. La aplicación funciona sin IA mediante reglas locales.
11. La aplicación puede usar IA si se configura Groq u OpenAI.
12. No se inventan datos técnicos, normativos o comerciales.

## KPIs propuestos para evaluar la utilidad

Estos KPIs son de evaluación de demo. En producción deberían medirse con datos reales.

| KPI | Qué mide | Objetivo de demo |
|---|---|---|
| Tasa de consultas clasificadas | Porcentaje de consultas asignadas a una familia | > 80% en casos de prueba |
| Solicitudes completas | Consultas con nombre, empresa, correo, necesidad y ubicación | > 70% |
| Detección de riesgo técnico | Consultas sensibles marcadas para revisión | 100% en casos normativos/cálculo |
| Tiempo hasta ficha comercial | Tiempo desde inicio hasta resumen | < 5 minutos en demo |
| Fallback correcto | Funcionamiento sin IA | 100% de disponibilidad local |
| Claridad del panel | Solicitud visible y entendible | Revisión en menos de 30 segundos |
| Calidad de respuesta | Tono profesional y prudente | Sin promesas técnicas indebidas |

## Criterios de éxito para la empresa

Para Protecciones Toledo, el MVP tendría éxito si demuestra que:

- Los clientes pueden aportar información más completa.
- El equipo comercial recibe solicitudes mejor clasificadas.
- Las consultas técnicas quedan identificadas.
- El panel interno facilita revisar oportunidades.
- La empresa puede imaginar una integración futura en su web.

## Criterios de éxito para el tutor

Para evaluación académica, el proyecto cumple si evidencia:

- Problema real.
- Solución técnica implementada.
- Uso de IA con sentido de negocio.
- Arquitectura comprensible.
- Seguridad y privacidad razonadas.
- Demo presentable.
- Documentación completa.

## Límites de alcance controlados

El alcance se ha mantenido deliberadamente acotado. Esto es importante porque un MVP de prácticas debe demostrar valor sin crear una falsa sensación de producto final.

Las funciones avanzadas se plantean como evolución:

- Autenticación.
- CRM.
- RAG documental.
- Analítica real.
- Integración WordPress.
- Envío de email.

## Conclusión del alcance

El proyecto tiene un alcance claro: demostrar un flujo completo de cualificación comercial con IA opcional, datos controlados y panel interno. No intenta resolver decisiones técnicas que corresponden a personal competente.
