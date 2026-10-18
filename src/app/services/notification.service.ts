import { Injectable, signal } from '@angular/core';
import { Notificacion, TipoNotificacion } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificacionesSignal = signal<Notificacion[]>([]);
  readonly notificaciones = this.notificacionesSignal.asReadonly();

  mostrar(mensaje: string, tipo: TipoNotificacion = 'info', duracionMs: number = 3500) {
    const id = Date.now();
    const nuevaNotificacion: Notificacion = { id, mensaje, tipo };

    this.notificacionesSignal.update(lista => [...lista, nuevaNotificacion]);

    setTimeout(() => {
      this.remover(id);
    }, duracionMs);
  }

  remover(id: number) {
    this.notificacionesSignal.update(lista => lista.filter(n => n.id !== id));
  }
}