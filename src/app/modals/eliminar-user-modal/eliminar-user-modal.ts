import { Component, Inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdministradoresService } from '../../services/administradores-service';
import { MaestrosService } from '../../services/maestros-service';
import { AlumnosService } from '../../services/alumnos-service';
import { NotificationService } from '../../services/tools/notification-service';

/**
 * EliminarUserModal
 * ----------------------------------------------------------
 * Modal de confirmación para eliminar o desactivar un usuario del sistema.
 * Recibe el id y el tipo de usuario (administrador, maestro o alumno) por MAT_DIALOG_DATA.
 * Llama al endpoint de eliminación correspondiente según el tipo antes de cerrar el modal.
 *
 * Endpoint(s) consumido(s): PATCH /admins/ (admin), DELETE /maestros/, DELETE /alumnos/
 */
@Component({
  selector: 'app-eliminar-user-modal',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './eliminar-user-modal.html',
  styleUrl: './eliminar-user-modal.scss',
})
export class EliminarUserModal {

  constructor(
    public dialogRef: MatDialogRef<EliminarUserModal>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, tipo: string },
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    private notificationService: NotificationService
  ) { }

  // Cancelar el modal
  public cancelar(): void {
    this.dialogRef.close(false);
  }

  // Confirmar la eliminación del usuario según su tipo
  public confirmar(): void {
    if (this.data.tipo === 'administrador') {
      // Administrador: se desactiva con PATCH
      this.administradoresService.eliminarAdmin(this.data.id).subscribe({
        next: () => {
          this.notificationService.success('Administrador desactivado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.notificationService.error('Error al desactivar el administrador');
          this.dialogRef.close(false);
        }
      });
    } else if (this.data.tipo === 'maestro') {
      // Maestro: se elimina con DELETE
      this.maestrosService.eliminarMaestro(this.data.id).subscribe({
        next: () => {
          this.notificationService.success('Maestro eliminado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.notificationService.error('Error al eliminar el maestro');
          this.dialogRef.close(false);
        }
      });
    } else if (this.data.tipo === 'alumno') {
      // Alumno: se elimina con DELETE
      this.alumnosService.eliminarAlumno(this.data.id).subscribe({
        next: () => {
          this.notificationService.success('Alumno eliminado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.notificationService.error('Error al eliminar el alumno');
          this.dialogRef.close(false);
        }
      });
    }
  }
}
