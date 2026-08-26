# Sincronización de datos

El dashboard consume `assets/data/dashboard-data.json`. Si el archivo no está disponible o no supera la validación en el navegador, conserva el snapshot local incluido en el bundle.

## Fuente autorizada

El sincronizador lee exclusivamente estas solapas:

- `VENTAS`
- `listado de boxes Special Edition`
- `Dashboard_Config`

Las pestañas mensuales históricas no se consultan.

## Secrets requeridos

- `GOOGLE_SERVICE_ACCOUNT_JSON`: contenido completo del JSON de una cuenta de servicio, almacenado exclusivamente como GitHub Secret.
- `GOOGLE_SPREADSHEET_ID`: ID del spreadsheet, almacenado como GitHub Secret para evitar publicarlo innecesariamente en el workflow.

No guardar el JSON de credenciales, la clave privada ni archivos `.env` en el repositorio.

## Preparación posterior en Google Cloud

1. Entrar en Google Cloud Console con la cuenta que administrará la integración.
2. Crear un proyecto dedicado al dashboard.
3. Habilitar únicamente **Google Sheets API**.
4. No habilitar billing. Si Google solicita tarjeta o facturación, detener la configuración.
5. Crear una cuenta de servicio sin roles adicionales de proyecto.
6. Crear una clave JSON para esa cuenta de servicio y descargarla una sola vez.
7. Abrir el Google Sheet privado y compartirlo con el correo de la cuenta de servicio como **Lector**.
8. Copiar el contenido completo del JSON en el secret `GOOGLE_SERVICE_ACCOUNT_JSON`.
9. Crear `GOOGLE_SPREADSHEET_ID` con el ID de la planilla.
10. Ejecutar manualmente el workflow `Sincronizar dashboard` y revisar el resultado antes de habilitar cualquier publicación.

La Sheets API dispone de cuotas gratuitas adecuadas para esta carga pequeña y no requiere un backend. La configuración prevista no usa servicios pagos ni necesita tarjeta.

## Uso local

Generar y validar el dataset inicial sin Google:

```powershell
npm run sync:fixture
npm test
npm run build
```

Probar el error controlado por credenciales ausentes:

```powershell
npm run sync
```

Ese error termina la sincronización sin reemplazar el último JSON válido.

## Frecuencia

El workflow queda preparado para:

- ejecución manual;
- una ejecución diaria a las 10:15 UTC, equivalente aproximadamente a las 07:15 de Paraguay.

GitHub puede demorar los workflows programados. Para una actualización mensual, una ejecución diaria evita consumo innecesario.
