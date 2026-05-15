# Copiloto Comercial - Protecciones Toledo

Demo de practicas para FEDETO orientada a Protecciones Toledo S.L. La aplicacion reformula el chatbot inicial como una unica web demostrativa con dos niveles:

- Vista publica con chatbot integrado.
- Logica funcional de copiloto comercial para cualificar consultas.
- Panel interno simulado en `/admin-demo` para visualizar solicitudes generadas.

El objetivo no es sustituir al equipo tecnico, sino preparar mejores primeras consultas comerciales sobre sistemas de proteccion en altura.

## Stack

- Vite
- React 18
- TypeScript
- Vitest
- Lucide React
- Datos controlados en modulos TypeScript
- Persistencia local de demo con `localStorage`
- Sin backend, sin CRM real y sin IA externa obligatoria

## Funcionalidades

- Landing publica profesional con enfoque industrial.
- Tarjetas de familias de producto:
  - Proteccion provisional de borde.
  - Proteccion definitiva de borde.
  - Bases y casquillos.
  - Auxiliares para la construccion.
  - Consumibles.
  - Soluciones a medida.
- Chatbot visible integrado como copiloto comercial.
- Menu inicial de necesidades.
- Flujos guiados por familia comercial.
- Aviso de privacidad antes de recoger datos personales.
- Detector de consultas tecnicas sensibles.
- Lead scoring basico: prioridad baja, media o alta.
- Generador de resumen comercial estructurado.
- Simulacion de derivacion al equipo comercial.
- Historial local de solicitudes para la demo.
- Vista interna simulada `/admin-demo` con filtros, contadores, detalle y cambio de estado.

## Ejecucion

En Windows PowerShell, usa `npm.cmd` si `npm` esta bloqueado por la politica de ejecucion:

```bash
npm.cmd install
npm.cmd run dev
```

Rutas:

- `http://localhost:5173/`
- `http://localhost:5173/admin-demo`

Comprobaciones:

```bash
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

## Estructura principal

```text
src/
  components/
    admin-demo/
    commercial-copilot/
    layout/
    ui/
  data/
    conversationFlows.ts
    faq.ts
    mockLeads.ts
    productFamilies.ts
  pages/
    AdminDemoPage.tsx
    PublicDemoPage.tsx
  types/
    commercialCopilot.ts
  utils/
    leadScoring.ts
    leadSummary.ts
    localLeadStore.ts
    technicalRisk.ts
  App.tsx
  main.tsx
  styles.css
```

## Privacidad y limitaciones

Los datos introducidos se utilizan unicamente para preparar una solicitud comercial en esta demo. No se debe introducir informacion sensible. En esta prueba de concepto, las solicitudes se conservan solo de forma local en el navegador o como datos simulados.

El copiloto no:

- Calcula soluciones estructurales.
- Confirma normativa aplicable.
- Certifica cumplimiento.
- Valida instrucciones de montaje.
- Confirma precios, stock o plazos.
- Sustituye fichas tecnicas oficiales ni revision de personal competente.

## Como probar el flujo completo

1. Abre `http://localhost:5173/`.
2. Pulsa una necesidad en el copiloto, por ejemplo `Proteccion provisional de borde`.
3. Responde las preguntas guiadas con datos de demo.
4. Cuando se soliciten datos personales, revisa el aviso de privacidad.
5. Completa nombre, empresa, correo, telefono y observaciones.
6. Comprueba que se genera un resumen comercial.
7. Pulsa `Ver en panel interno` o abre `http://localhost:5173/admin-demo`.
8. En el panel, revisa la solicitud, usa los filtros y cambia el estado de seguimiento.

## Aspectos simulados

- El panel interno no tiene autenticacion real.
- Las solicitudes se guardan en `localStorage`, no en una base de datos.
- Los datos iniciales del panel son mock leads de demostracion.
- No hay envio real de correo ni integracion con CRM.
- La revision tecnica se marca como necesidad de revision, no como validacion tecnica.

## Defensa del proyecto

### Problema que resuelve

Clientes profesionales pueden llegar con necesidades incompletas o poco clasificadas: proteccion provisional, definitiva, fijaciones, consumibles o soluciones singulares. El copiloto reduce esa friccion y estructura la consulta.

### Por que chatbot + copiloto comercial

El chatbot es la interfaz visible y sencilla para el usuario. La logica de copiloto comercial clasifica la necesidad, pregunta datos utiles, detecta riesgos tecnicos y genera una ficha que la empresa podria revisar internamente.

### Valor para Protecciones Toledo

- Mejora la calidad del primer contacto.
- Reduce consultas incompletas.
- Ayuda a priorizar oportunidades.
- Deriva cuestiones sensibles al equipo tecnico.
- Mantiene un tono prudente y profesional.

### Funcionalidades del MVP

- Vista publica demostrativa.
- Copiloto conversacional con flujos.
- Resumen comercial estructurado.
- Scoring basico.
- Deteccion de consulta tecnica sensible.
- Panel interno simulado.

### Mejoras futuras razonables

- Integracion real en WordPress.
- Envio a correo o CRM.
- Panel real con autenticacion.
- Edicion de contenidos por personal comercial.
- Recuperacion documental sobre fichas verificadas.
- IA externa opcional con guardrails y fuentes controladas.

## Integracion en produccion

Para integrarlo en la web real habria que empaquetar el copiloto como widget, conectar un backend para envio seguro, definir consentimiento y politica de tratamiento, validar contenidos con Protecciones Toledo y revisar cualquier respuesta tecnica con documentacion oficial.
