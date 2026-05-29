import { Component } from '@angular/core';
import { NavbarUser } from '../../partials/navbar-user/navbar-user';
import { RouterOutlet } from '@angular/router';

/**
 * DashboardLayout
 * ----------------------------------------------------------
 * Layout contenedor para todas las rutas protegidas del dashboard.
 * Envuelve: HomeScreen, AdminScreen, AlumnosScreen, MaestrosScreen, GraficosScreen.
 *
 * Estructura visual:
 *   - <app-navbar-user>: barra lateral + barra superior fija (sidebar + topbar)
 *   - <router-outlet>: donde Angular inserta la pantalla de la ruta activa
 *
 * Este layout solo se activa si AuthGuard retorna true, es decir,
 * cuando hay un token JWT válido en las cookies de sesión.
 * Se registra en app.routes.ts con canActivate: [AuthGuard].
 */
@Component({
  selector: 'app-dashboard-layout',
  imports: [
    NavbarUser,
    RouterOutlet
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {

}
