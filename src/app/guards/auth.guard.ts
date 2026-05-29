import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServices } from '../services/auth-services';

/**
 * AuthGuard
 * ----------------------------------------------------------
 * Guard que protege las rutas del dashboard.
 * Verifica que exista un token de sesión válido en sessionStorage.
 * Si no hay token, redirige al usuario a /login.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
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
