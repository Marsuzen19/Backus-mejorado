# BackusVentasPwa

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.27.

# Backus Ventas PWA - Sistema de Pedidos Offline/Online

Aplicación Web Progresiva (PWA) desarrollada en **Angular 19** y **Bootstrap**, diseñada para optimizar el registro de pedidos de los vendedores de Backus con soporte completo de persistencia local mediante **IndexedDB** y sincronización inteligente según el estado de conectividad.


##  Pasos para Ejecutar el Proyecto

Sigue estos pasos en tu terminal para clonar, configurar y poner en marcha el proyecto localmente:

1. **Clonar o abrir el repositorio** en tu entorno local.
2. **Instalar las dependencias** del proyecto:
   ```bash
   npm install

Mejoras Implementadas
Catálogo Reactivo Avanzado: Búsqueda en tiempo real por nombre (insensible a mayúsculas/minúsculas) y filtros combinables por categoría sobre un catálogo de 16 productos de Backus.

Validaciones Estrictas en Carrito: Restricción de cantidades para aceptar únicamente números enteros positivos mayores que cero (bloqueando letras, ceros, negativos y decimales).

Persistencia Local Robusta (IndexedDB): Almacenamiento estructurado de pedidos locales con fecha, líneas detalladas, totales formateados a dos decimales, origen (ONLINE/OFFLINE) y estado (PENDIENTE/SINCRONIZADO).

Sistema de Notificaciones Modernas (Toasts): Alertas flotantes animadas y contextuales para acciones de éxito, advertencias, errores y avisos de conectividad.

Detección Automática de Red: Uso de eventos nativos del navegador (window.online y window.offline) para alternar el estado de conectividad y sincronizar automáticamente los pedidos pendientes al recuperar internet.

Historial Local con Vista de Detalle: Consulta del listado completo de pedidos guardados en el dispositivo con un modal interactivo para revisar el desglose por línea de productos.

Limitaciones Conocidas
Entorno de Simulación Frontend: Al no contar con un servidor backend o API REST real conectada, la sincronización simula la actualización de estados de PENDIENTE a SINCRONIZADO de forma local en IndexedDB.

Persistencia Exclusiva del Navegador: Los datos dependen del almacenamiento IndexedDB del navegador actual; si el usuario borra los datos de navegación o el caché del sitio, el historial local se reiniciará.

Alcance Offline Limitado al Catálogo Local: Las imágenes o recursos externos que requieran conexión a internet externa no podrán cargarse si el dispositivo pierde por completo el acceso a la red antes de almacenar los recursos en el caché del navegador.


