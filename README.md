# Special Edition Boxes Dashboard

Dashboard web estático V1.0 para analizar las ventas de Special Edition Boxes.

## Abrir localmente

```powershell
python -m http.server 8000
```

Luego visitar `http://localhost:8000`.

La instantánea local contiene los movimientos reales disponibles en el Google Sheet maestro entre enero y agosto de 2026. Los datos históricos permanecen intactos en `sales.js`; la denominación vigente se resuelve por código en `normalizer.js` usando `catalog.js`.

## Sección Clientes

La sección Clientes reutiliza los filtros globales y permite ordenar la cartera, abrir un Cliente 360°, revisar evolución mensual, mix de productos e historial de movimientos. Las notas de crédito se conservan y descuentan de las unidades netas.

Las métricas se definen así:

- **Clientes únicos:** clientes cuyo saldo neto es positivo en el período filtrado.
- **Más de un movimiento:** clientes con al menos dos movimientos de cantidad positiva. Un movimiento no se interpreta como pedido.
- **Compra en más de un mes:** clientes con saldo positivo en dos o más meses distintos.
- **Promedio por cliente:** unidades netas totales divididas por clientes únicos.
- **Recurrente:** compra neta positiva en tres o más meses.
- **Ocasional:** compra neta positiva en exactamente dos meses.
- **Compra única:** compra neta positiva en exactamente un mes.

Esta clasificación es descriptiva y prudente para la historia disponible de ocho meses; no estima potencial ni frecuencia comercial futura.
