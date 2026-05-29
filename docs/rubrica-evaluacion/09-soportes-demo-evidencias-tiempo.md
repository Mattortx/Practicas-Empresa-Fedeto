# 9. Soportes, demo, evidencias y gestión del tiempo

## Objetivo

Preparar una presentación limpia, con soportes útiles, demo controlada y evidencias suficientes para no depender de improvisación.

## Soportes recomendados

### 1. Repositorio GitHub

Mostrar:

- README.
- Carpeta `docs/`.
- Documentación de rúbrica.
- Código organizado.

### 2. Aplicación en local o preproducción

Rutas:

- `/`
- `/admin-demo`
- `/admin-demo/analytics`
- `/practicas`

### 3. Documentos clave

- Memoria del proyecto.
- Seguridad y privacidad.
- Checklist de rúbrica.
- Guion oral.

### 4. Evidencias técnicas

Comandos:

```bash
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Evidencia esperada:

- TypeScript sin errores.
- Tests pasando.
- Build generado correctamente.

## Demo recomendada en 4 minutos

### Minuto 1. Vista pública

Mostrar:

- Hero.
- Familias.
- Proceso comercial.
- Copiloto integrado.

Mensaje:

“Esta es la experiencia que vería un cliente profesional.”

### Minuto 2. Chatbot

Probar:

```text
Necesito proteger el borde de un forjado durante una obra en Toledo.
```

Mostrar:

- Clasificación.
- Preguntas guiadas.
- Aviso de privacidad.
- Resumen final.

### Minuto 3. Panel interno

Abrir:

```text
/admin-demo
```

Mostrar:

- Listado de solicitudes.
- Filtros.
- Detalle.
- Prioridad.
- Revisión técnica.
- Resumen.

### Minuto 4. Analíticas

Abrir:

```text
/admin-demo/analytics
```

Mostrar:

- Barras por familia.
- Prioridad.
- Evolución temporal.
- Estado de seguimiento.

## Casos de prueba para demo

### Caso 1. Protección provisional

```text
Necesito proteger el borde de un forjado durante una obra en Toledo.
```

Esperado:

- Familia: protección provisional.
- Preguntas sobre soporte, longitud y perforación.

### Caso 2. Protección definitiva sensible

```text
Busco una barandilla definitiva para una cubierta industrial donde no se puede perforar.
```

Esperado:

- Familia: protección definitiva.
- Revisión técnica marcada.

### Caso 3. Normativa

```text
¿Cumple la UNE EN 13374?
```

Esperado:

- No confirma cumplimiento.
- Deriva a revisión técnica.

### Caso 4. Presupuesto

```text
Necesito presupuesto para casquillos atornillables, unas 200 unidades.
```

Esperado:

- Familia: bases/casquillos.
- Pide contacto y uso previsto.

## Gestión del tiempo

Recomendación:

- No dedicar más de 2 minutos a explicar la empresa.
- No dedicar más de 2 minutos a arquitectura.
- Priorizar demo visual.
- Reservar 1 minuto para límites y riesgos.
- Dejar preguntas para el final.

## Plan B si falla la IA

Decir:

“La demo está preparada para funcionar sin IA externa. Si el proveedor no responde o no hay clave, el sistema activa reglas locales y mantiene el flujo.”

Después:

- Desactivar IA desde el botón.
- Mostrar que el flujo sigue funcionando.

## Plan B si falla internet

Mostrar:

- Demo local.
- Capturas si existen.
- README y documentación.
- Código de flujos.

## Evidencias que conviene mencionar

- Build correcto.
- Tests correctos.
- Documentación de seguridad.
- Variables de entorno.
- Fallback local.
- No exposición de claves.
- Rutas funcionales.

## Cierre de demo

“Lo importante no es solo que el chatbot responda, sino que deja una oportunidad comercial estructurada y revisable.”
