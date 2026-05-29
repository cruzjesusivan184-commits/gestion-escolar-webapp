import { Component, Inject, OnInit } from '@angular/core';
import { AdministradoresService } from '../../services/administradores-service';
import { AlumnosService } from '../../services/alumnos-service';
import { MaestrosService } from '../../services/maestros-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../services/tools/notification-service';

/**
 * EliminarUserModal
 * ----------------------------------------------------------
 * Modal de confirmación para eliminar un usuario del sistema.
 * Recibe por inyección el id y el rol del usuario a eliminar,
 * y delega la llamada al servicio correspondiente según el rol.
 *
 * ¿Cómo funciona MatDialog?
 *   El componente padre (AdminScreen, MaestrosScreen, AlumnosScreen) abre
 *   este modal con this.dialog.open(EliminarUserModal, { data: { id, rol } }).
 *   MAT_DIALOG_DATA inyecta esos datos en el modal.
 *   dialogRef.close({ isDelete: true/false }) cierra el modal y devuelve
 *   un resultado al componente padre via dialogRef.afterClosed().subscribe().
 *
 * El modal sirve como confirmación para evitar eliminaciones accidentales.
 * Si el profesor pregunta "¿cómo comunican datos entre componentes padre e hijo
 * con un modal?" → "Usamos MatDialog con MAT_DIALOG_DATA para pasar datos al
 * modal y MatDialogRef para recibir el resultado al cerrarlo."
 */
@Component({
  selector: 'app-eliminar-user-modal',
  imports: [],
  templateUrl: './eliminar-user-modal.html',
  styleUrl: './eliminar-user-modal.scss',
})
export class EliminarUserModal implements OnInit {
  public rol: string = "";

  constructor(
    // Servicios de cada tipo de usuario para llamar al endpoint de eliminación correcto
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    // NotificationService para mostrar feedback de éxito o error al usuario
    private notificationService: NotificationService,
    // MatDialogRef permite cerrar el modal y pasar un resultado al padre
    private dialogRef: MatDialogRef<EliminarUserModal>,
    // @Inject(MAT_DIALOG_DATA) inyecta los datos que el padre pasó al abrir el modal
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /** ngOnInit: extrae el rol del usuario desde los datos inyectados por el padre. */
  ngOnInit(): void {
    this.rol = this.data.rol;
  }

  /** cerrar_modal: cierra el modal devolviendo isDelete: false (el usuario canceló). */
  public cerrar_modal() {
    this.dialogRef.close({ isDelete: false });
  }

  /**
   * eliminarUser
   * Determina el servicio a usar según el rol y ejecuta la eliminación.
   * Si tiene éxito, cierra el modal con isDelete: true para que el padre
   * recargue la lista; si falla, muestra un toast de error.
   */
  public eliminarUser() {
    if (this.rol === 'administrador') {
      this.administradoresService.desactivarAdmin(this.data.id).subscribe({
        next: (_response: any) => {
          console.log('Administrador eliminado');
          this.notificationService.success('Administrador eliminado exitosamente');
          this.dialogRef.close({ isDelete: true });
        },
        error: (_error: any) => {
          console.error('Error al eliminar administrador');
          this.notificationService.error('Error al eliminar administrador');
        }
      });

    } else if (this.rol === 'maestro') {
      this.maestrosService.eliminarMaestro(this.data.id).subscribe({
        next: (_response: any) => {
          console.log('Maestro eliminado');
          this.notificationService.success('Maestro eliminado exitosamente');
          this.dialogRef.close({ isDelete: true });
        },
        error: (_error: any) => {
          console.error('Error al eliminar maestro');
          this.notificationService.error('Error al eliminar maestro');
        }
      });

    } else if (this.rol === 'alumno') {
      this.alumnosService.eliminarAlumno(this.data.id).subscribe({
        next: (_response: any) => {
          console.log('Alumno eliminado');
          this.notificationService.success('Alumno eliminado exitosamente');
          this.dialogRef.close({ isDelete: true });
        },
        error: (_error: any) => {
          console.error('Error al eliminar alumno');
          this.notificationService.error('Error al eliminar alumno');
        }
      });
    }
  }
}