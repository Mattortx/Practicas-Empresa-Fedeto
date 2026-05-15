# MVP Asistente Inteligente - Protecciones Toledo

Demo de practicas para FEDETO orientada a validar un asistente inteligente integrable en la web de Protecciones Toledo S.L.

El MVP prioriza una prueba funcional, estable y explicable: orienta consultas profesionales sobre proteccion en altura, identifica categorias de producto, recoge una solicitud comercial minima y evita inventar informacion tecnica, normativa, precios o certificaciones.

## Stack

- Vite
- React
- TypeScript
- Base de conocimiento local en JSON
- Motor conversacional por reglas
- Sin backend y sin persistencia de datos personales

## Funcionalidades

- Chat web integrado como widget demostrable.
- Mensaje de bienvenida adaptado a Protecciones Toledo.
- Orientacion por categorias: proteccion provisional, proteccion definitiva, bases/casquillos, auxiliares y consumibles.
- FAQs basicas sobre empresa, contacto, presupuesto y limites del asistente.
- Flujo de solicitud de presupuesto con datos minimos.
- Resumen final para copiar o enviar por correo.
- Guardrails para normativa, certificaciones, precios, plazos y calculos tecnicos.
- Contenidos editables en `src/data/knowledgeBase.json`.

## Instalacion

En Windows PowerShell, usa `npm.cmd` si `npm` esta bloqueado por la politica de ejecucion:

```bash
npm.cmd install
npm.cmd run dev
```

Comprobaciones:

```bash
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

## Estructura

```text
src/
  components/
    ChatWidget.tsx
  data/
    knowledgeBase.json
  domain/
    assistantEngine.ts
    lead.ts
    types.ts
  App.tsx
  main.tsx
  styles.css
```

## Datos y cumplimiento

La demo no almacena datos personales en base de datos ni los envia automaticamente. El resumen de consulta se genera en el navegador para que el usuario pueda copiarlo o abrir un correo dirigido a `info@proteccionestoledo.com`.

La informacion real procede de la web publica de Protecciones Toledo:

- https://proteccionestoledo.com/
- https://proteccionestoledo.com/contacto/
- https://proteccionestoledo.com/politica-de-privacidad/
- https://proteccionestoledo.com/category/sistemas-definitivos-de-proteccion-de-borde/

Cualquier contenido marcado como demo debe validarse con la empresa antes de un uso real.

## Defensa del proyecto

### Problema que resuelve

Muchos clientes profesionales llegan con una necesidad de seguridad en altura, pero no siempre saben si deben consultar proteccion provisional, definitiva, fijaciones, auxiliares o consumibles. El asistente reduce esa friccion inicial y estructura la consulta para el equipo comercial.

### Por que tiene sentido para Protecciones Toledo

La empresa trabaja con productos tecnicos para obra, mantenimiento industrial, cubiertas, infraestructuras y edificaciones con riesgo de caida. Un asistente no sustituye al equipo tecnico, pero puede filtrar consultas, orientar por categoria y mejorar la calidad del primer contacto.

### Limitaciones

- No calcula soluciones tecnicas.
- No valida normativa aplicable a una obra.
- No confirma precios, stock, plazos ni certificaciones.
- No sustituye fichas tecnicas oficiales ni al equipo comercial/tecnico.

### Mejoras futuras razonables

- Integracion real en WordPress como widget.
- Envio del resumen a correo o CRM.
- Panel de administracion para editar contenidos.
- Recuperacion documental sobre fichas tecnicas verificadas.
- Integracion opcional con IA externa usando guardrails.
