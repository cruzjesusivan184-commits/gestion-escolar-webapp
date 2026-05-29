import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { AuthServices } from './auth-services';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * AlumnosService
 * ----------------------------------------------------------
 * Servicio de datos para la gestión de alumnos.
 * Centraliza todas las peticiones HTTP al backend relacionadas con alumnos,
 * además de la validación frontend del formulario.
 *
 * Endpoints consumidos:
 *   POST   /alumnos/         — registrarAlumno()
 *   GET    /lista-alumnos/   — obtenerListaAlumnos()
 *   GET    /alumnos/?id=X    — obtenerAlumnoPorId()
 *   PUT    /alumnos/         — actualizarAlumno()
 *   DELETE /alumnos/?id=X    — eliminarAlumno()
 *
 * Todas las peticiones autenticadas envían el token JWT en el header
 * mediante getAuthHeaders(), que construye el header Authorization.
 */
@Injectable({
  providedIn: 'root',
})
export class AlumnosService {

  constructor(
    // HttpClient para las peticiones HTTP al backend Django
    private http: HttpClient,
    // ValidatorService y ErrorsService para validar formularios en el frontend
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    // AuthServices para obtener el token JWT de la sesión activa
    private authService: AuthServices
  ) { }

  /** Genera los HttpHeaders con el token de sesión si existe */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  /**
   * esquemaAlumno
   * Retorna un objeto con la estructura vacía de un alumno.
   * Se usa en RegistroAlumnos para inicializar el formulario de registro nuevo.
   */
  public esquemaAlumno(){
    return {
      'rol':'',
      'matricula': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'fecha_nacimiento': '',
      'curp': '',
      'rfc': '',
      'edad': '',
      'telefono': '',
      'ocupacion': '',
      'direccion': '',
      'sexo': ''
    }
  }

  /**
   * validarAlumno
   * Valida los campos del formulario de alumno antes de enviarlo al backend.
   * Recibe el objeto de datos y una bandera que indica si es edición (true) o registro nuevo (false).
   * En modo edición, los campos de contraseña no son obligatorios.
   * Se llama en registrar() y actualizar() del componente RegistroAlumnos.
   * Retorna un objeto con los mensajes de error por campo; si está vacío, no hay errores.
   */
  public validarAlumno(data: any, editar: boolean){
    const error: any = {};

    if(!this.validatorService.required(data["matricula"])){
      error["matricula"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.maxLen(data["email"], 40)){
      error["email"] = this.errorService.max;
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if(!editar){
      if(!this.validatorService.required(data["password"])){
        error["password"] = this.errorService.required;
      }

      if(!this.validatorService.required(data["confirmar_password"])){
        error["confirmar_password"] = this.errorService.required;
      }
    }

    if(!this.validatorService.required(data["fecha_nacimiento"])){
      error["fecha_nacimiento"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["curp"])){
      error["curp"] = this.errorService.required;
    }else if(!this.validatorService.minLen(data["curp"], 18)){
      error["curp"] = this.errorService.min;
    }else if(!this.validatorService.maxLen(data["curp"], 18)){
      error["curp"] = this.errorService.max;
    }

    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.minLen(data["rfc"], 12)){
      error["rfc"] = this.errorService.min;
    }else if(!this.validatorService.maxLen(data["rfc"], 13)){
      error["rfc"] = this.errorService.max;
    }

    if(!this.validatorService.required(data["edad"])){
      error["edad"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["edad"])){
      error["edad"] = "El formato es solo números";
    }else if(data["edad"]<18){
      error["edad"] = "La edad debe ser mayor o igual a 18";
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["ocupacion"])){
      error["ocupacion"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["direccion"])){
      error["direccion"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["sexo"])){
      error["sexo"] = this.errorService.required;
    }

    //Return arreglo
    return error;
  }

  // Creamos la petición POST para registrar un alumno nuevo, esta función se llamará en el método registrar() del componente registro-alumnos.ts
  public registrarAlumno(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/alumnos/`, data, { headers: this.getAuthHeaders() });
  }

  //Función para obtener la lista de alumnos registrados
  public obtenerListaAlumnos(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/lista-alumnos/`, { headers: this.getAuthHeaders() });
  }

  //Función para obtener los datos de un alumno por su id
  public obtenerAlumnoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/alumnos/?id=${id}`, { headers: this.getAuthHeaders() });
  }

  //Función para actualizar los datos de un alumno
  public actualizarAlumno(data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_api}/alumnos/`, data, { headers: this.getAuthHeaders() });
  }

  //Función para eliminar un alumno por su id
  public eliminarAlumno(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_api}/alumnos/?id=${id}`, { headers: this.getAuthHeaders() });
  }
}
