import { Component, HostListener, OnInit } from '@angular/core';
import { AuthServices } from '../../services/auth-services';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';

/**
 * Sidebar
 * ----------------------------------------------------------
 * Barra lateral de navegación del dashboard (versión con MatSidenav).
 * Este componente es una alternativa al NavbarUser; usa mat-sidenav de
 * Angular Material en lugar de CSS puro para el comportamiento deslizable.
 *
 * mat-sidenav modes:
 *   - 'side': el sidebar empuja el contenido (desktop)
 *   - 'over': el sidebar se superpone al contenido (móvil)
 * En móvil (<900px) cambia a mode='over' y [opened]=mobileOpen para
 * controlar cuándo está visible.
 *
 * El guard @HostListener('window:resize') actualiza isMobileView en tiempo
 * real cuando el usuario redimensiona la ventana.
 *
 * Los métodos de rol (isAdmin, canSeeAdminItems...) delegan en AuthServices
 * para mantener una única fuente de verdad del control de acceso.
 */
@Component({
  selector: 'app-sidebar',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit{
  public mobileOpen = false;
  public isMobileView = false;

  constructor(
    private router: Router,
    private authService: AuthServices
  ) {
  }

  ngOnInit(): void {
    this.isMobileView = window.innerWidth < 900;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth < 900;
    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  // Alterna el estado abierto/cerrado del sidebar en vista móvil
  toggleSidebar() {
    this.mobileOpen = !this.mobileOpen;
  }

  // Cierra el sidebar en vista móvil
  closeSidebar() {
    this.mobileOpen = false;
  }

  // Llama al endpoint de logout y limpia los datos de sesión del usuario
  logout() {
    this.authService.logout().subscribe(
      (response) => {
        this.authService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      },
      (error) => {
        // Fallback: clear local data and navigate anyway
        this.authService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      }
    );
  }

  // Helper methods — delegados a FacadeService (fuente única de verdad)
  isAdmin(): boolean { return this.authService.isAdmin(); }
  isTeacher(): boolean { return this.authService.isTeacher(); }
  isStudent(): boolean { return this.authService.isStudent(); }
  canSeeAdminItems(): boolean { return this.authService.canSeeAdminItems(); }
  canSeeTeacherItems(): boolean { return this.authService.canSeeTeacherItems(); }
  canSeeStudentItems(): boolean { return this.authService.canSeeStudentItems(); }
  canSeeHomeItem(): boolean { return this.authService.canSeeHomeItem(); }
  canSeeRegisterItem(): boolean { return this.authService.canSeeRegisterItem(); }

}
