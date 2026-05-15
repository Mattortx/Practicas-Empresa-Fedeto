# Diagnostico y refactorizacion propuesta

## Estado actual del proyecto

### Stack detectado

- Aplicacion frontend local con Vite.
- React 18 con TypeScript.
- Vitest para pruebas unitarias.
- Lucide React para iconografia.
- Sin backend, sin base de datos y sin autenticacion.
- Persistencia inexistente en la version actual.

### Framework y punto de entrada

- Framework principal: React sobre Vite.
- Entrada HTML: `index.html`.
- Entrada React: `src/main.tsx`.
- Componente raiz: `src/App.tsx`.

### Estructura actual

```text
src/
  components/
    ChatWidget.tsx
  data/
    knowledgeBase.json
  domain/
    assistantEngine.ts
    assistantEngine.test.ts
    lead.ts
    types.ts
  App.tsx
  main.tsx
  styles.css
  vite-env.d.ts
```

### Dependencias y scripts

Dependencias de produccion:

- `react`
- `react-dom`
- `lucide-react`

Dependencias de desarrollo:

- `vite`
- `typescript`
- `vitest`
- `@vitejs/plugin-react`
- tipos de React

Scripts:

- `npm.cmd run dev`: servidor local.
- `npm.cmd run build`: typecheck y build de produccion.
- `npm.cmd run preview`: vista previa del build.
- `npm.cmd run test`: pruebas unitarias.
- `npm.cmd run typecheck`: validacion TypeScript.

### Componentes y estilos existentes

- `App.tsx` renderiza una pagina demo en dos columnas: panel informativo y chat.
- `ChatWidget.tsx` concentra interfaz conversacional, gestion de mensajes, recogida de lead, copia de resumen y enlace `mailto`.
- `styles.css` contiene todo el sistema visual global y del chat.
- `knowledgeBase.json` centraliza datos de empresa, categorias, FAQs, mensajes de seguridad y fuentes.
- `assistantEngine.ts` contiene reglas de clasificacion por palabras clave, respuestas controladas y guardrails.
- `lead.ts` define campos de captura, validacion simple y generador de resumen.

## Partes reutilizables

- El stack Vite + React + TypeScript es adecuado para la demo.
- La decision de no usar backend real todavia encaja con el alcance.
- `knowledgeBase.json` puede servir como base para datos controlados, aunque conviene migrarlo a modulos TypeScript mas tipados.
- El motor de reglas actual es un buen punto de partida, pero debe evolucionar a flujos guiados por familia.
- Las funciones de validacion de lead y resumen son reutilizables, pero necesitan mas campos comerciales.
- La paleta sobria actual se puede conservar como base: fondo claro, gris tecnico, rojo y verde/azul industrial.
- Los tests actuales pueden ampliarse para scoring, riesgo tecnico y flujos.

## Partes a refactorizar

- Separar `ChatWidget.tsx` en piezas pequenas: ventana, mensaje, selector de necesidad, formulario guiado y resumen.
- Convertir `assistantEngine.ts` en una logica de copiloto comercial con estados de flujo, no solo respuesta por keyword.
- Ampliar los tipos: `ProductFamily`, `ConversationStep`, `LeadData`, `LeadSummary`, `LeadPriority`, `TechnicalRiskFlag`, `LeadStatus`.
- Sustituir una captura generica de lead por flujos especificos: provisional, definitiva, bases/casquillos, auxiliares/consumibles, medida, desconocido y normativa.
- Anadir historial local de solicitudes con `localStorage`.
- Crear una ruta interna simulada `/admin-demo` dentro de la misma aplicacion.
- Dividir `styles.css` por secciones o, como minimo, renombrar clases segun la nueva arquitectura.
- Rehacer `App.tsx` para enrutar entre vista publica y panel interno sin introducir un router pesado.

## Riesgos tecnicos

- El componente de chat actual puede crecer demasiado si se anaden flujos sin separarlo.
- La ruta `/admin-demo` debe funcionar con Vite sin servidor backend; conviene usar routing simple basado en `window.location.pathname`.
- `localStorage` es suficiente para demo, pero no debe presentarse como almacenamiento productivo.
- Los textos tecnicos deben mantenerse prudentes para no inventar normativa, certificaciones, resistencias o instrucciones de montaje.
- El resumen comercial debe ser estructurado, pero no debe parecer una prescripcion tecnica.
- El diseno publico y el panel interno comparten estilos, pero tienen necesidades UX distintas.
- La aplicacion debe seguir compilando con TypeScript estricto tras la refactorizacion.

## Refactorizacion propuesta

Arquitectura objetivo adaptada al repo actual:

```text
src/
  components/
    commercial-copilot/
      ChatWidget.tsx
      ChatWindow.tsx
      ChatMessage.tsx
      NeedSelector.tsx
      LeadSummary.tsx
    admin-demo/
      AdminLeadDashboard.tsx
      LeadTable.tsx
      LeadDetailCard.tsx
      LeadStatusBadge.tsx
    layout/
      Header.tsx
      PublicShell.tsx
    ui/
      Badge.tsx
      Button.tsx
      Notice.tsx
  data/
    productFamilies.ts
    conversationFlows.ts
    faq.ts
    mockLeads.ts
  pages/
    PublicDemoPage.tsx
    AdminDemoPage.tsx
  types/
    commercialCopilot.ts
  utils/
    leadScoring.ts
    leadSummary.ts
    technicalRisk.ts
    localLeadStore.ts
  App.tsx
  main.tsx
  styles.css
```

No hace falta introducir React Router en el MVP. `App.tsx` puede seleccionar pagina segun `window.location.pathname`:

- `/`: vista publica.
- `/admin-demo`: panel interno simulado.

## Plan por iteraciones

### Iteracion 1: diagnostico y propuesta

Objetivo: documentar el estado real y cerrar la direccion de refactorizacion.

Resultado: este documento.

### Iteracion 2: pagina publica profesional

Objetivo: convertir la vista actual en una landing sobria con header, hero, tarjetas de familias, bloque de valor, aviso tecnico y chat integrado.

Archivos previstos:

- `src/App.tsx`
- `src/pages/PublicDemoPage.tsx`
- `src/components/layout/Header.tsx`
- `src/styles.css`
- `src/data/productFamilies.ts`

### Iteracion 3: separar el chatbot en componentes

Objetivo: dividir el widget actual en componentes mantenibles sin cambiar todavia toda la logica.

Archivos previstos:

- `src/components/commercial-copilot/ChatWidget.tsx`
- `src/components/commercial-copilot/ChatWindow.tsx`
- `src/components/commercial-copilot/ChatMessage.tsx`
- `src/components/commercial-copilot/NeedSelector.tsx`
- `src/components/commercial-copilot/LeadSummary.tsx`

### Iteracion 4: logica de copiloto comercial

Objetivo: introducir tipos y motor de flujo para cualificar oportunidades comerciales.

Archivos previstos:

- `src/types/commercialCopilot.ts`
- `src/data/conversationFlows.ts`
- `src/domain/assistantEngine.ts` o nuevo `src/utils/copilotEngine.ts`

### Iteracion 5: flujos por familia de producto

Objetivo: implementar preguntas especificas para provisional, definitiva, bases/casquillos, auxiliares/consumibles, medida, desconocido y normativa.

Archivos previstos:

- `src/data/conversationFlows.ts`
- `src/data/productFamilies.ts`
- tests del motor de flujo

### Iteracion 6: recogida de datos y privacidad

Objetivo: mostrar aviso antes de datos personales y capturar solo informacion comercial minima.

Archivos previstos:

- `src/components/commercial-copilot/ChatWidget.tsx`
- `src/utils/leadSummary.ts`
- `src/types/commercialCopilot.ts`

### Iteracion 7: resumen comercial

Objetivo: generar resumen estructurado con nombre, empresa, correo, telefono, necesidad, familia, obra, ubicacion, urgencia, prioridad, siguiente accion y advertencias.

Archivos previstos:

- `src/utils/leadSummary.ts`
- `src/components/commercial-copilot/LeadSummary.tsx`

### Iteracion 8: panel interno `/admin-demo`

Objetivo: mostrar solicitudes generadas desde `localStorage` y datos mock iniciales.

Archivos previstos:

- `src/pages/AdminDemoPage.tsx`
- `src/components/admin-demo/*`
- `src/utils/localLeadStore.ts`
- `src/data/mockLeads.ts`
- `src/App.tsx`

### Iteracion 9: scoring y riesgo tecnico

Objetivo: calcular prioridad baja/media/alta y marcar consultas sensibles.

Archivos previstos:

- `src/utils/leadScoring.ts`
- `src/utils/technicalRisk.ts`
- tests unitarios

### Iteracion 10: pulido visual y verificacion

Objetivo: responsive, limpieza de estilos, pruebas, build y README final de defensa.

Archivos previstos:

- `src/styles.css`
- `README.md`
- tests existentes y nuevos

## Archivos que se tocaran despues de esta iteracion

Nuevos:

- `src/pages/PublicDemoPage.tsx`
- `src/pages/AdminDemoPage.tsx`
- `src/types/commercialCopilot.ts`
- `src/data/productFamilies.ts`
- `src/data/conversationFlows.ts`
- `src/data/faq.ts`
- `src/data/mockLeads.ts`
- `src/utils/leadScoring.ts`
- `src/utils/leadSummary.ts`
- `src/utils/technicalRisk.ts`
- `src/utils/localLeadStore.ts`
- componentes bajo `src/components/commercial-copilot/`
- componentes bajo `src/components/admin-demo/`
- componentes bajo `src/components/layout/` y `src/components/ui/`

Existentes:

- `src/App.tsx`
- `src/styles.css`
- `README.md`
- `src/domain/assistantEngine.ts`
- `src/domain/lead.ts`
- `src/domain/types.ts`
- `src/domain/assistantEngine.test.ts`

## Criterios de aceptacion de la refactorizacion

- La aplicacion carga en `/`.
- La vista publica parece una demo profesional para empresa industrial.
- El chat se entiende como copiloto comercial, no como chatbot generico.
- Los flujos cualifican necesidades por familia.
- El resumen comercial se genera y se guarda localmente para demo.
- `/admin-demo` muestra solicitudes y detalle.
- Las consultas sensibles quedan marcadas para revision tecnica.
- No se inventan precios, certificaciones, ensayos, resistencias, calculos ni instrucciones de montaje.
- `npm.cmd run typecheck`, `npm.cmd run test` y `npm.cmd run build` pasan.
