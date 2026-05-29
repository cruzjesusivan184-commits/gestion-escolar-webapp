import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * NotificationService
 * ----------------------------------------------------------
 * Servicio de notificaciones visuales usando MatSnackBar de Angular Material.
 * Centraliza la aparición de toasts (mensajes emergentes) en la esquina
 * superior derecha de la pantalla, con 3 variantes de estilo:
 *   - success(): mensaje verde de operación exitosa (registro, actualización)
 *   - error(): mensaje rojo de error (fallo al conectar, validación)
 *   - info(): mensaje informativo neutro
 *
 * Los estilos CSS de las clases notif-success, notif-error, notif-info
 * se definen globalmente en styles.scss (no en el componente) porque
 * MatSnackBar se renderiza fuera del árbol de componentes normal.
 *
 * Se inyecta en cualquier componente que necesite feedback al usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly defaultDuration = 4000;

  constructor(private snackBar: MatSnackBar) {}

  /** Muestra un toast de éxito (fondo verde) con la duración por defecto. */
  success(message: string): void {
    this.show(message, 'notif-success');
  }

  /** Muestra un toast de error (fondo rojo) con la duración por defecto. */
  error(message: string): void {
    this.show(message, 'notif-error');
  }

  /** Muestra un toast informativo neutro con la duración por defecto. */
  info(message: string): void {
    this.show(message, 'notif-info');
  }

  /** Método interno que construye y abre el SnackBar con la configuración común. */
  private show(message: string, panelClass: string): void {
    const config: MatSnackBarConfig = {
      duration: this.defaultDuration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass],
    };
    this.snackBar.open(message, '✕', config);
  }
}
