# Memoria del proyecto para Protecciones Toledo y tutor de prácticas

## 1. Resumen ejecutivo

Este proyecto consiste en una aplicación web demostrativa para Protecciones Toledo S.L. orientada a cualificar consultas comerciales relacionadas con sistemas de protección en altura. La solución se plantea como un MVP de prácticas para FEDETO: suficientemente funcional para poder enseñarse, pero prudente en alcance técnico y sin convertirse en una aplicación sobredimensionada.

La idea principal es combinar un chatbot visible para el usuario con una lógica interna de copiloto comercial. El cliente conversa con un asistente integrado en la web, pero el sistema no se limita a contestar preguntas genéricas: clasifica la necesidad, orienta hacia una familia de producto, detecta consultas técnicas sensibles, recoge datos mínimos y genera una ficha comercial para que el equipo interno pueda responder mejor.

El proyecto no pretende sustituir al equipo técnico de Protecciones Toledo. Su objetivo es mejorar el primer contacto comercial, reducir consultas incompletas y demostrar cómo una capa digital puede ayudar a ordenar oportunidades comerciales en una empresa industrial.

## 2. Contexto de la empresa

Protecciones Toledo S.L. trabaja en soluciones metálicas de protección colectiva e individual para trabajos en altura y entornos con riesgo de caída. La demo se ha construido alrededor de familias comerciales coherentes con ese contexto:

- Sistemas provisionales de protección de borde.
- Sistemas definitivos de protección de borde.
- Bases, casquillos y elementos de fijación.
- Auxiliares para la construcción.
- Consumibles y recambios.
- Soluciones a medida para obras singulares.

El tipo de cliente esperado no es un usuario doméstico, sino un profesional del sector de la construcción, mantenimiento industrial, obra civil, cubiertas, naves, instalaciones técnicas, silos, puentes o edificios con zonas elevadas.

Por eso el asistente se ha diseñado con un tono técnico, profesional y prudente. No promete soluciones cerradas, no calcula estructuras, no confirma normativa y deriva los casos sensibles al equipo técnico.

## 3. Problema que resuelve

En una empresa técnica, muchas consultas iniciales llegan con información incompleta. Por ejemplo:

- No se indica si la protección debe ser provisional o definitiva.
- No se conoce el soporte donde se instalaría.
- Falta la longitud aproximada.
- No se aclara si se puede perforar o fijar al soporte.
- No se aporta ubicación, urgencia o tipo de obra.
- Se preguntan cuestiones normativas sin documentación técnica suficiente.
- Se mezclan necesidades comerciales con dudas técnicas delicadas.

Esto obliga al equipo comercial a pedir aclaraciones antes de poder responder y puede retrasar oportunidades. El copiloto comercial intenta ordenar esa primera toma de datos.

## 4. Objetivos del MVP

Los objetivos principales del MVP son:

1. Presentar una demo web profesional y defendible ante empresa y tutor.
2. Integrar un chatbot orientado al dominio de Protecciones Toledo.
3. Clasificar consultas por familia comercial.
4. Guiar al usuario mediante preguntas útiles.
5. Recoger solo datos mínimos para preparar una solicitud.
6. Detectar consultas técnicas sensibles.
7. Generar un resumen comercial estructurado.
8. Mostrar la solicitud en un panel interno simulado.
9. Añadir analíticas de demo para leer tendencias comerciales.
10. Mantener límites claros sobre IA, normativa, privacidad y seguridad.

## 5. Enfoque de producto

El proyecto se ha planteado como una única aplicación con varias vistas:

- Vista pública: presenta la propuesta de valor y contiene el copiloto comercial.
- Chatbot/copiloto: interfaz conversacional para cualificar la consulta.
- Panel interno: vista simulada para que la empresa vea solicitudes generadas.
- Analíticas: gráficos y métricas sobre solicitudes de demo.
- Proyecto de prácticas: memoria visual dentro de la propia aplicación.

Esta estructura permite explicar el proyecto desde dos perspectivas:

- Para la empresa: herramienta que mejora la recepción de consultas.
- Para el tutor: proyecto full-stack con frontend, backend opcional, IA, datos simulados, UX/UI, seguridad y documentación.

## 6. Arquitectura funcional

La aplicación se organiza en capas sencillas:

1. Frontend con React, Vite y TypeScript.
2. Componentes visuales para la página pública, chat, panel y analíticas.
3. Datos controlados en módulos TypeScript.
4. Motor conversacional basado en reglas y flujos guiados.
5. Persistencia local de demo mediante `localStorage`.
6. Backend Node opcional para endpoints de IA, leads, healthchecks y Twilio.
7. Integración opcional con Groq u OpenAI mediante variables de entorno.
8. Preparación para Supabase en escenarios de preproducción.

La arquitectura evita depender obligatoriamente de una IA externa. Si no hay clave configurada, el sistema sigue funcionando con reglas locales.

## 7. Vistas de la aplicación

### Vista pública

La página principal explica el concepto de copiloto comercial y muestra:

- Hero section con mensaje de valor.
- Escenarios de prueba.
- Contexto de empresa.
- Proceso comercial.
- Chatbot integrado.
- Vista previa del panel interno.
- Vista previa de analíticas.
- Enlaces a panel, analíticas, proyecto de prácticas y web real.

### Chatbot/copiloto comercial

El chatbot permite:

- Elegir una necesidad inicial.
- Escribir consultas libres.
- Activar o desactivar IA asistida.
- Seguir flujos guiados.
- Recibir mensajes prudentes ante consultas técnicas.
- Generar una solicitud comercial.
- Enviar la solicitud al panel interno de demo.

### Panel interno

La ruta `/admin-demo` muestra cómo recibiría la empresa las solicitudes:

- Listado de clientes con scroll.
- Filtros con contadores.
- Métricas superiores.
- Detalle de solicitud.
- Estado comercial.
- Prioridad.
- Revisión técnica.
- Resumen generado por el copiloto.
- Borrador de respuesta comercial.

### Analíticas

La ruta `/admin-demo/analytics` resume datos de demo mediante:

- Gráfico de barras por familia.
- Gráfico circular por prioridad.
- Evolución temporal.
- Estado de seguimiento.
- Tabla resumen por familia.
- Indicadores de carga técnica, prioridad y oportunidades abiertas.

### Proyecto de prácticas

La ruta `/practicas` funciona como memoria visual:

- Problema de partida.
- Hipótesis del MVP.
- Alcance del proyecto.
- Arquitectura.
- Metodología.
- Evidencias funcionales.
- Familias comerciales.
- Seguridad y límites.

## 8. Flujos comerciales contemplados

El copiloto contempla los siguientes casos:

1. Protección provisional de borde.
2. Protección definitiva de borde.
3. Bases y casquillos.
4. Auxiliares para construcción.
5. Consumibles.
6. Solución a medida.
7. Solicitud de presupuesto.
8. Usuario que no sabe exactamente qué necesita.
9. Documentación, normativa o consulta técnica sensible.

Cada flujo intenta pedir información útil sin parecer un formulario rígido. Al final se genera una ficha con datos comerciales.

## 9. Datos recogidos

La demo puede recoger:

- Nombre.
- Empresa.
- Correo.
- Teléfono.
- Tipo de necesidad.
- Familia de producto.
- Tipo de obra.
- Ubicación aproximada.
- Urgencia.
- Observaciones.

Estos datos se usan para preparar una solicitud comercial de demostración. No se piden datos sensibles ni se realizan tratamientos avanzados.

## 10. Uso de IA

La IA es opcional y complementaria. No reemplaza los flujos controlados.

Cuando está activa, puede ayudar a:

- Interpretar mensajes libres.
- Clasificar la familia de producto.
- Detectar riesgo técnico.
- Sugerir la siguiente pregunta.
- Generar resúmenes comerciales.
- Preparar borradores de respuesta.
- Responder FAQs usando base de conocimiento controlada.

Si falla la IA, no hay clave o se desactiva desde la interfaz, la aplicación vuelve a modo local.

## 11. Guardrails técnicos

El copiloto tiene restricciones deliberadas:

- No calcula estructuras.
- No confirma normativa.
- No certifica cumplimiento.
- No da instrucciones de montaje.
- No confirma resistencias.
- No inventa precios ni plazos.
- No sustituye fichas técnicas.
- No reemplaza al equipo técnico.

Cuando aparecen temas como normativa, certificación, cálculo, montaje, anclaje, resistencia, ficha técnica o seguridad estructural, la solicitud se marca como revisión técnica necesaria.

## 12. Valor para Protecciones Toledo

El proyecto aporta valor potencial en:

- Mejorar la calidad del primer contacto.
- Reducir correos o formularios incompletos.
- Clasificar oportunidades por familia.
- Priorizar consultas urgentes o técnicas.
- Facilitar el trabajo del equipo comercial.
- Derivar con prudencia al equipo técnico.
- Obtener una visión agregada de tipos de consultas.
- Preparar una futura integración con CRM, correo o WordPress.

## 13. Valor académico

Para prácticas, el proyecto permite demostrar:

- Análisis de dominio real.
- Diseño de producto digital.
- Frontend con React y TypeScript.
- Arquitectura modular.
- Flujos conversacionales.
- UX/UI profesional.
- Persistencia local.
- Panel interno.
- Analíticas.
- Integración opcional de IA.
- Seguridad y privacidad.
- Documentación técnica y funcional.

## 14. Limitaciones actuales

La demo conserva límites claros:

- No es una herramienta de producción.
- El panel interno no tiene autenticación real.
- El envío de correos o CRM no está activo.
- Los datos iniciales del panel son simulados.
- La IA no tiene acceso a documentación técnica oficial completa.
- No hay validación técnica real de soluciones.
- No hay cálculo estructural.
- No hay confirmación normativa.

Estas limitaciones son intencionadas para mantener el MVP realista y defendible.

## 15. Cómo ejecutar la demo

Instalar dependencias:

```bash
npm.cmd install
```

Ejecutar frontend:

```bash
npm.cmd run dev
```

Ejecutar frontend y backend juntos:

```bash
npm.cmd run dev:full
```

Rutas principales:

- `/`
- `/admin-demo`
- `/admin-demo/analytics`
- `/practicas`

Comprobaciones:

```bash
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

## 16. Mejoras futuras recomendadas

Las mejoras naturales serían:

- Integración real en WordPress.
- Envío seguro de solicitudes por correo.
- Conexión con CRM.
- Autenticación del panel interno.
- Base documental validada.
- RAG con fichas técnicas verificadas.
- Analítica comercial real.
- Gestión de consentimientos.
- Historial de conversaciones controlado.
- Panel de edición de contenidos para personal de la empresa.

## 17. Conclusión

El proyecto demuestra una idea viable: convertir un chatbot web en una herramienta de cualificación comercial para una empresa industrial. La demo no intenta resolver decisiones técnicas complejas, sino preparar mejor las consultas y facilitar el trabajo posterior del equipo comercial y técnico.

Su valor está en el equilibrio entre funcionalidad, prudencia, experiencia visual y arquitectura defendible.
