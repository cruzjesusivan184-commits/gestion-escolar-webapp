import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServices } from '../services/auth-services';

/**
 * AuthGuard
 * ----------------------------------------------------------
 * Guard (guardián de rutas) que protege las rutas del dashboard.
 * Implementa la interfaz CanActivate: Angular llama a canActivate()
 * automáticamente ANTES de activar cualquier ruta marcada con canActivate: [AuthGuard].
 *
 * Flujo:
 *   1. El usuario intenta navegar a /home, /alumnos, etc.
 *   2. Angular invoca canActivate().
 *   3. Si hay token válido → retorna true y la navegación continúa.
 *   4. Si no hay token → redirige a /login y retorna false (bloquea la ruta).
 *
 * El token se almacena en una cookie segura (ver AuthServices.getSessionToken).
 * Si el profesor pregunta: "¿Cómo protegen rutas en Angular?" →
 *   "Usamos un CanActivate guard que verifica el token JWT antes de activar la ruta."
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    // Router permite navegar programáticamente hacia /login cuando no hay sesión
    private authService: AuthServices,
    private router: Router
  ) {}

  // Retorna true si hay token de sesión activo; de lo contrario redirige a /login y retorna false
  canActivate(): boolean {
    const token = this.authService.getSessionToken();
    if (token && token !== '') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
