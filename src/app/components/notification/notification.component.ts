import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div aria-live="polite" aria-atomic="true" class="position-fixed top-0 end-0 p-3" style="z-index: 1080;">
      <div class="toast-container">
        @for (notif of notificationService.notificaciones(); track notif.id) {
          <div class="toast show mb-2 shadow border-0" role="alert" aria-live="assertive" aria-atomic="true"
               [ngClass]="{
                 'bg-success text-white': notif.tipo === 'success',
                 'bg-danger text-white': notif.tipo === 'error',
                 'bg-warning text-dark': notif.tipo === 'warning',
                 'bg-info text-dark': notif.tipo === 'info'
               }">
            <div class="d-flex align-items-center p-2">
              <div class="toast-body fw-semibold">
                {{ notif.mensaje }}
              </div>
              <button type="button" 
                      class="btn-close me-2 m-auto" 
                      [ngClass]="{'btn-close-white': notif.tipo === 'success' || notif.tipo === 'error'}"
                      (click)="notificationService.remover(notif.id)" 
                      aria-label="Close">
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}