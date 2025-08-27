// Guía de troubleshooting para problemas del calendario en producción

## Problema: Los botones de semana y lista no funcionan en producción

### Posibles causas y soluciones:

1. **Problema de hidratación SSR/CSR**

   - Next.js puede tener problemas de hidratación entre servidor y cliente
   - Solución: Asegurar que el componente sea completamente del lado del cliente

2. **Dependencias de FullCalendar**

   - Verificar que todas las dependencias estén instaladas en producción
   - Revisar que las versiones sean compatibles

3. **Problemas de caché en producción**

   - El caché puede estar sirviendo una versión anterior
   - Solución: Clear cache y rebuild

4. **Diferencias de configuración entre dev y prod**
   - Variables de entorno
   - Configuración de Next.js

### Tests a realizar:

1. Verificar que los console.log aparezcan en las dev tools de producción
2. Verificar que las traducciones se carguen correctamente
3. Verificar que el calendarRef.current tenga valor después del mount
4. Verificar que no hay errores de JavaScript en la consola

### Solución implementada:

- Agregado estado de `isCalendarReady`
- Agregado useCallback para `handleViewChange`
- Agregado useEffect con timer para asegurar que el calendario esté listo
- Agregado manejo de errores con try/catch
- Agregado logs de debug para troubleshooting

Si el problema persiste, considerar:

- Verificar la versión de Next.js y React
- Revisar el build de producción
- Verificar las variables de entorno
- Revisar la configuración del servidor de producción
