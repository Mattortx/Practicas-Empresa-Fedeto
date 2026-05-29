# Copiloto Comercial - Protecciones Toledo

Proyecto de prácticas para FEDETO orientado a Protecciones Toledo S.L.

La aplicación es una demo web profesional que convierte un chatbot en un copiloto comercial para cualificar consultas sobre protección en altura, orientar hacia familias de producto, recoger datos mínimos y generar solicitudes comerciales revisables por la empresa.

El objetivo no es sustituir al equipo técnico, sino mejorar el primer contacto comercial y demostrar una solución digital viable, prudente y defendible.

## Documentación principal

Para empresa, tutor y evaluación del proyecto:

- [Memoria del proyecto para empresa y tutor](docs/memoria-proyecto-empresa-tutor.md)
- [Memoria del proyecto para empresa y tutor - PDF](docs/memoria-proyecto-empresa-tutor.pdf)
- [Seguridad y privacidad del proyecto](docs/seguridad-privacidad.md)
- [Seguridad y privacidad del proyecto - PDF](docs/seguridad-privacidad.pdf)
- [Derechos de autor y propiedad intelectual](docs/propiedad-intelectual-derechos-autor.md)
- [Documentación para evaluación según rúbrica](docs/rubrica-evaluacion/README.md)
- [Documentación completa de la rúbrica - PDF](docs/rubrica-evaluacion/documentacion-rubrica-completa.pdf)
- [Dossier completo del proyecto - PDF](docs/documentacion-completa-proyecto.pdf)
- [Informe completo del copiloto](docs/informe-copiloto-protecciones-toledo.md)
- [Guía de preproducción Railway + Twilio + Groq](docs/preproduccion-railway-twilio-groq.md)
- [Despliegue con Supabase + InsForge](docs/despliegue-supabase-insforge.md)

## Qué hace el proyecto

La demo incluye:

- Vista pública con presentación del copiloto comercial.
- Chatbot integrado en la web.
- Flujos guiados por familia de producto.
- Clasificación de necesidad comercial.
- Detección de consultas técnicas sensibles.
- Aviso de privacidad antes de pedir datos personales.
- Generación de resumen comercial.
- Panel interno simulado en `/admin-demo`.
- Analíticas en `/admin-demo/analytics`.
- Página de memoria visual en `/practicas`.
- Página de integración y preproducción en `/integracion`.
- Datos de demostración controlados.
- IA opcional con Groq u OpenAI.
- Fallback local si la IA no está configurada.

## Familias comerciales contempladas

- Protección provisional de borde.
- Protección definitiva de borde.
- Bases y casquillos.
- Auxiliares para la construcción.
- Consumibles.
- Soluciones a medida.
- Documentación, normativa o consulta técnica sensible.

## Rutas principales

```text
/                       Vista pública
/admin-demo             Panel comercial simulado
/admin-demo/analytics   Analíticas de solicitudes
/practicas              Memoria visual del proyecto
/integracion            Guía visual de integración y preproducción
```

## Stack técnico

- Vite.
- React 18.
- TypeScript.
- Vitest.
- Lucide React.
- Backend Node opcional.
- Datos controlados en TypeScript.
- Persistencia local de demo con `localStorage`.
- IA opcional mediante endpoints backend.
- Preparación para Groq, OpenAI, Railway, Twilio y Supabase.
- Exportación de solicitudes en CSV/JSON para revisión comercial.
- Retención local de datos de demo durante 45 días.

## Ejecución local

En Windows PowerShell se recomienda usar `npm.cmd`:

```bash
npm.cmd install
npm.cmd run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173/
```

Para levantar frontend y backend juntos:

```bash
npm.cmd run dev:full
```

Para levantar solo el backend:

```bash
npm.cmd run dev:api
```

## Variables de entorno

Copia `.env.example` a `.env.local` y configura solo las claves necesarias.

Ejemplo con Groq:

```bash
AI_PROVIDER=groq
GROQ_API_KEY=tu_clave
GROQ_MODEL=llama-3.3-70b-versatile
AI_ENABLED=true
AI_TIMEOUT_MS=10000
PORT=8787
```

Ejemplo con OpenAI:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=tu_clave
OPENAI_MODEL=gpt-5-mini
AI_ENABLED=true
AI_TIMEOUT_MS=10000
PORT=8787
```

La demo funciona aunque no haya IA configurada.

## Comprobaciones

```bash
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Para servir la versión de producción junto al backend:

```bash
npm.cmd run start
```

## Arquitectura resumida

```text
server/
  ai/                  Endpoints, prompt, validadores y fallbacks IA
  db/                  Rutas y migración para Supabase
  twilio/              Webhook opcional
  index.js             Servidor Node

src/
  components/          Chat, panel, layout y UI
  data/                Flujos, FAQs, familias, mock leads y base de conocimiento
  pages/               Vistas públicas e internas
  services/            Clientes API e IA
  types/               Tipos TypeScript
  utils/               Scoring, resumen, almacenamiento y riesgo técnico
  App.tsx              Enrutado simple
  styles.css           Estilos globales
```

## IA opcional

La IA se usa como apoyo, no como sustitución de los flujos comerciales.

Puede ayudar a:

- Interpretar consultas libres.
- Clasificar familias de producto.
- Detectar riesgo técnico.
- Sugerir preguntas de seguimiento.
- Generar resúmenes comerciales.
- Preparar borradores para el equipo comercial.

No puede:

- Confirmar normativa.
- Hacer cálculos estructurales.
- Dar instrucciones de montaje definitivas.
- Certificar resistencia.
- Inventar precios, plazos o fichas técnicas.
- Sustituir al equipo técnico de Protecciones Toledo.

## Seguridad y privacidad

La demo muestra aviso de privacidad antes de recoger datos personales. Los datos se usan únicamente para preparar una solicitud comercial de demostración.

En modo local, las solicitudes se conservan en el navegador mediante `localStorage` o se muestran como datos simulados. No se debe introducir información sensible.

La explicación detallada está en:

[Seguridad y privacidad del proyecto](docs/seguridad-privacidad.md)

## Derechos de autor y propiedad intelectual

El proyecto es una prueba de concepto desarrollada para prácticas de FEDETO y orientada a una empresa real. El código, la documentación y los materiales creados para la demo quedan protegidos por derechos de autor salvo que se defina una licencia específica.

El nombre, la identidad empresarial, las referencias comerciales y cualquier signo distintivo de Protecciones Toledo pertenecen a sus titulares legítimos. Su uso en este repositorio tiene finalidad demostrativa, académica y de contextualización del proyecto.

Los datos de clientes, solicitudes y estadísticas incluidos en la demo son simulados o generados localmente. No representan presupuestos, clientes ni operaciones reales.

Las dependencias de terceros conservan sus propias licencias. Antes de una implantación real se recomienda revisar licencias, permisos de uso, titularidad del código, uso de marca, documentación técnica y condiciones de explotación.

Documento ampliado:

[Derechos de autor y propiedad intelectual](docs/propiedad-intelectual-derechos-autor.md)

## Aspectos simulados

- El panel interno no tiene autenticación real.
- Los datos iniciales son mock leads.
- No hay envío real de correo.
- No hay CRM real.
- No hay validación técnica real de soluciones.
- No hay cálculo estructural.
- No se confirma normativa.

## Mejoras futuras ya preparadas

Se han implementado varias mejoras que estaban planteadas como evolución natural del MVP:

- Exportación comercial de solicitudes desde el panel interno en CSV y JSON.
- Panel de privacidad de demo con recuento de datos locales y retención automática.
- Ruta `/integracion` con propuesta de integración web/WordPress, backend, IA y checklist productivo.
- Separación clara entre datos mock y solicitudes generadas en local.
- Preparación visual y documental para explicar despliegue en Railway, uso de IA y futuras conexiones comerciales.

## Valor del MVP

Para Protecciones Toledo:

- Reduce consultas incompletas.
- Ordena la información comercial.
- Prioriza oportunidades.
- Deriva casos técnicos con prudencia.
- Permite visualizar un posible flujo interno.

Para prácticas:

- Demuestra frontend, backend, IA, UX/UI, datos, seguridad, documentación y despliegue.
- Mantiene un alcance realista.
- Se puede defender ante tutor, empresa o evaluador.

## Mejoras futuras

- Integración real en WordPress.
- Envío seguro por correo.
- Conexión con CRM.
- Autenticación del panel interno.
- Base documental validada.
- RAG con fichas técnicas oficiales.
- Analítica comercial real.
- Gestión formal de consentimiento y retención de datos productivos.
