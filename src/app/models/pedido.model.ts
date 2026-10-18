export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen?: string;
}

export interface LineaPedido {
  productoId: number;
  producto: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export type EstadoPedido = 'PENDIENTE' | 'SINCRONIZADO' | 'ERROR';

export interface Pedido {
  id?: number;
  fecha: string;
  lineas: LineaPedido[];
  total: number;
  estado: EstadoPedido;
  origen: 'ONLINE' | 'OFFLINE';
}

export type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: TipoNotificacion;
}