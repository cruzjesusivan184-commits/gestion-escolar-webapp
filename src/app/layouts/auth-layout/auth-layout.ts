import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AuthLayout
 * ----------------------------------------------------------
 * Layout contenedor para las rutas públicas (sin autenticación).
 * Envuelve las pantallas: LoginScreen, RegistroUsuariosScreen.
 *
 * No tiene navbar ni sidebar, solo un <router-outlet> que renderiza
 * el componente de la ruta hija activa. Está registrado en app.routes.ts
 * bajo el path vacío (''), sin canActivate, por lo que es accesible
 * sin token de sesión.
 *
 * ¿Por qué tener un Layout separado?
 *   Permite que las rutas públicas y las protegidas compartan estructura
 *   visual distinta (login no tiene sidebar, el dashboard sí) sin
 *   duplicar código en cada pantalla.
 */
@Component({
  selector: 'app-auth-layout',
  imports: [
    RouterOutlet
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {

}
