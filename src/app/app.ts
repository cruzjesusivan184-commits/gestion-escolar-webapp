import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * App
 * ----------------------------------------------------------
 * Componente raíz de la aplicación Angular (el "shell" de toda la app).
 * No contiene lógica propia; únicamente provee el <router-outlet> donde
 * el Router de Angular inyecta el layout activo (AuthLayout o DashboardLayout).
 *
 * Importante: `signal()` es la nueva API de reactividad de Angular 17+.
 * A diferencia de una variable normal, un signal notifica automáticamente
 * a la vista cuando su valor cambia, sin necesidad de Zone.js.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gestion-escolar-webapp');
}
