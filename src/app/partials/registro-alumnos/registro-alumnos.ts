import { Component, Input, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router, ActivatedRoute } from '@angular/router';
import { AlumnosService } from '../../services/alumnos-service';
import { NotificationService } from '../../services/tools/notification-service';
import { Location } from '@angular/common';

/**
 * RegistroAlumnos
 * ----------------------------------------------------------
 * Formulario de registro y edición de alumnos.
 * Recibe los datos del usuario por @Input cuando está en modo edición.
 * En modo registro inicializa el esquema vacío desde AlumnosService.
 *
 * Endpoint(s) consumido(s): POST /alumnos/, PUT /alumnos/
 */
@Component({
  selector: 'app-registro-alumnos',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos implements OnInit{

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno:any= {};
  public errors:any={};
  public editar:boolean = false;
  public idUser: number = 0;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private location : Location,
    private activatedRoute: ActivatedRoute,
    private alumnosService: AlumnosService
  ) {
  }

 ngOnInit(): void {
    if(this.activatedRoute.snapshot.params['id'] !== undefined){
      this.editar = true;
      // Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      // Asignamos los datos del usuario que vienen desde la vista principal con el decorador
      this.alumno = this.datos_user;
    }else{
      // Si no va a editar, entonces inicializamos el JSON para registro nuevo
      this.alumno = this.alumnosService.esquemaAlumno();
      this.alumno.rol = this.rol;
    }
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    //Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if(Object.keys(this.errors).length > 0){
      return;
    }
    // Lógica para registrar un nuevo alumno
    if(this.alumno.password === this.alumno.confirmar_password){
      this.alumnosService.registrarAlumno(this.alumno).subscribe(
        (response) => {
          // Redirigir o mostrar mensaje de éxito
          this.notificationService.success("Alumno registrado exitosamente");
          this.router.navigate(['/alumnos']);
        },
        (error) => {
          // Manejar errores de la API
          this.notificationService.error("Error al registrar alumno");
        }
      );
    }else{
      this.notificationService.error("Las contraseñas no coinciden");
      this.alumno.password="";
      this.alumno.confirmar_password="";
    }
  }

 public actualizar(){
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if(Object.keys(this.errors).length > 0){
      return;
    }
    this.alumno.id = this.idUser;
    this.alumnosService.actualizarAlumno(this.alumno).subscribe({
      next: (response) => {
        this.notificationService.success("Alumno actualizado exitosamente");
        this.router.navigate(['/alumnos']);
      },
      error: (error) => {
        console.error("Error al actualizar el alumno: ", error);
        this.notificationService.error("Error al actualizar el alumno.");
      }
    });
  }

  //Funciones para alternar la visibilidad del campo de contraseña
  showPassword()
  {
    if(this.inputType_1 === 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 === 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
  }

  // Restringe la entrada de teclado solo a letras (mayúsculas, minúsculas) y espacio
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

}
