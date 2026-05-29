import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AuthServices } from '../../services/auth-services';
import { Router } from '@angular/router';
import { AdministradoresService } from '../../services/administradores-service';
import { NotificationService } from '../../services/tools/notification-service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModal } from '../../modals/eliminar-user-modal/eliminar-user-modal';

/**
 * AdminScreen
 * ----------------------------------------------------------
 * Pantalla de gestión de administradores del sistema.
 * Ruta: /administrador (protegida por AuthGuard)
 * Endpoints consumidos: GET /lista-admins/, PATCH /admin/ (desactivar)
 *
 * A diferencia de AlumnosScreen y MaestrosScreen, esta pantalla usa una
 * tabla HTML estándar (<table class="table table-striped">) con Bootstrap,
 * no MatTableDataSource. Esto implica que no tiene paginación ni filtrado
 * integrado de Angular Material.
 *
 * La "eliminación" es lógica (soft delete): el backend pone is_active=False
 * en el usuario, sin borrar el registro de la base de datos.
 *
 * Protección adicional en delete():
 *   Un administrador no puede desactivar su propia cuenta. Se compara
 *   el id del admin a eliminar con getUserId() para prevenir esto.
 */
@Component({
  selector: 'app-admin-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './admin-screen.html',
  styleUrl: './admin-screen.scss',
})
export class AdminScreen implements OnInit{
  // Variables y métodos del componente
  public name_user: string = "";
  public lista_admins: any[] = [];

  constructor(
    private authService: AuthServices,
    private notificationService: NotificationService,
    private administradoresService: AdministradoresService,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.obtenerAdministradores();
  }

  // Método para cargar la lista de administradores al iniciar el componente
  public obtenerAdministradores(): void {
    this.administradoresService.obtenerAdmins().subscribe({
      next: (response) => {
        this.lista_admins = response;
        console.log('JSON de la API:', response);
      },
      error: () => {
        this.notificationService.error('Error al cargar la lista de administradores. Intente de nuevo más tarde.');
      }
    });
  }

  //Metodo para editar un administrador, se redirige a la pantalla de edición con el id del administrador seleccionado
  public goEditar(id: number): void {
    this.router.navigate(['/registro-usuarios', 'administrador', id]);
  }

  //Metodo para eliminar un administrador, se muestra una confirmación antes de eliminar
  public delete(id: number): void {
    const idUserSession = Number(this.authService.getUserId());

    if (idUserSession === id) {
      this.notificationService.error('No puedes eliminar tu propia cuenta de administrador.');
      return;
    }

    const dialogRef = this.dialog.open(EliminarUserModal, {
      data: { id: id, rol: 'administrador' },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        this.obtenerAdministradores();
      }else{
        this.notificationService.error("Administrador no se ha podido eliminar.");
      }
    });

  }

}
