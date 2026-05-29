# 5. Riesgos, ética, privacidad y plan mínimo de implantación

## Riesgos principales

| Riesgo | Impacto | Mitigación |
|---|---|---|
| La IA inventa información técnica | Alto | Guardrails, respuestas prudentes y revisión técnica |
| Confirmar normativa sin documentación | Alto | Prohibición explícita y derivación al equipo técnico |
| Pedir demasiados datos personales | Medio | Minimización de datos |
| Almacenar datos sensibles en demo | Alto | Aviso de privacidad y no solicitar información sensible |
| Exponer claves API | Alto | Claves solo en backend y `.env` ignorado |
| Confundir datos mock con reales | Medio | Marcar datos como simulados |
| Panel interno sin autenticación | Medio/alto en producción | Aceptable solo en demo; autenticación futura |
| Dependencia de proveedor IA | Medio | Fallback local |
| Prompt injection | Medio | Reglas locales, prompt de sistema y respuesta prudente |
| Uso del sistema como asesor técnico | Alto | Mensajes de límite y revisión técnica |

## Ética aplicada

El proyecto evita presentar la IA como autoridad técnica. La IA se utiliza para ayudar a ordenar información, no para tomar decisiones de seguridad.

Principios aplicados:

- Transparencia: se indica que es una demo.
- Prudencia: no se prometen soluciones definitivas.
- Supervisión humana: el equipo técnico valida casos sensibles.
- Minimización: solo se piden datos útiles.
- Control: las respuestas críticas no dependen exclusivamente de IA.
- Trazabilidad: se generan fichas y eventos de demo.

## Privacidad

Datos tratados en la demo:

- Nombre.
- Empresa.
- Correo.
- Teléfono.
- Ubicación aproximada.
- Tipo de obra.
- Necesidad.
- Observaciones.

No se deben introducir:

- Datos bancarios.
- DNI/NIE.
- Contraseñas.
- Información médica.
- Documentación confidencial.
- Datos personales de terceros innecesarios.

## Aviso al usuario

El sistema muestra un aviso antes de recoger datos personales:

```text
Los datos introducidos se utilizarán únicamente para preparar una solicitud comercial en esta demo. No introduzca información sensible. La solución definitiva deberá ser revisada por el equipo técnico de la empresa.
```

## Seguridad de claves

Medidas:

- `.env` y `.env.local` ignorados por Git.
- `.env.example` sin claves reales.
- Claves de Groq/OpenAI solo en backend.
- Frontend consume endpoints propios.
- No se hardcodean credenciales.

## Seguridad del panel

En la demo:

- El panel no tiene autenticación.
- Se marca como vista simulada.
- Usa datos mock y almacenamiento local.

En producción sería necesario:

- Login.
- Roles.
- Permisos.
- Auditoría de accesos.
- Cifrado y políticas de retención.

## Plan mínimo de implantación

### Fase 1. Validación interna

- Revisar textos con Protecciones Toledo.
- Confirmar familias comerciales.
- Confirmar qué datos son necesarios.
- Revisar avisos legales.
- Probar casos reales con personal comercial.

### Fase 2. Preproducción

- Desplegar en entorno controlado.
- Configurar Groq u OpenAI en backend.
- Configurar base de datos si procede.
- Probar generación de solicitudes.
- Revisar logs y fallos.
- Validar respuesta ante consultas técnicas.

### Fase 3. Piloto limitado

- Integrar como enlace o widget no crítico.
- Usarlo solo para consultas de baja criticidad.
- Recoger feedback del equipo comercial.
- Medir KPIs.
- Ajustar flujos.

### Fase 4. Producción

- Autenticación.
- CRM o correo real.
- Política de privacidad definitiva.
- RAG con documentación validada.
- Monitorización.
- Procedimiento de borrado de datos.
- Revisión legal y técnica.

## Próximos pasos recomendados

1. Validar documentación con la empresa.
2. Definir responsable interno del panel.
3. Revisar RGPD/LOPDGDD.
4. Decidir si se usará IA externa.
5. Preparar base documental oficial.
6. Definir integración con formulario web.
7. Añadir autenticación si el panel se usa fuera de demo.

## Conclusión

El proyecto identifica riesgos clave y propone mitigaciones realistas. La demo es segura para presentación y preproducción controlada siempre que no se introduzca información sensible y se mantenga claro que la IA no sustituye revisión técnica.
