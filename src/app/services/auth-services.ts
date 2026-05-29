import { Injectable } from '@angular/core';
//import { ErrorsService } from './tools/errors.service';
//import { ValidatorService } from './tools/validator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';

/**
 * AuthServices
 * ----------------------------------------------------------
 * Servicio central de autenticación y sesión del sistema.
 * Responsabilidades:
 *   1. Validar credenciales en el frontend antes de llamar al backend.
 *   2. Enviar la petición POST /login/ al backend Django y recibir el token JWT.
 *   3. Persistir el token y datos del usuario en cookies seguras.
 *   4. Exponer helpers de rol (isAdmin, isTeacher, isStudent) que usan los
 *      componentes para mostrar/ocultar elementos de la UI.
 *
 * ¿Qué es un Observable y por qué se usa .subscribe()?
 *   HttpClient.post() retorna un Observable, que es como una "promesa mejorada":
 *   no ejecuta la petición HTTP hasta que alguien hace .subscribe().
 *   En el .subscribe() se pasan dos callbacks: next (éxito) y error (fallo).
 *
 * ¿Qué es JWT (JSON Web Token)?
 *   Es un token firmado que el backend genera al hacer login. El frontend lo
 *   guarda en una cookie y lo envía en cada petición en el header:
 *     Authorization: Bearer <token>
 *   El backend verifica la firma y otorga acceso si es válido, sin necesitar
 *   guardar sesiones en la base de datos.
 *
 * Endpoints consumidos: POST /login/, GET /logout/, GET /me/
 */

// Nombres de las cookies donde se persisten los datos de sesión del usuario
const session_cookie_name = 'gestion-escolar-token';
const user_email_cookie_name = 'gestion-escolar-email';
const user_id_cookie_name = 'gestion-escolar-user_id';
const user_complete_name_cookie_name = 'gestion-escolar-user_complete_name';
const group_name_cookie_name = 'gestion-escolar-group_name';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {

  constructor(
    // HttpClient: servicio de Angular para hacer peticiones HTTP al backend
    private http: HttpClient,
    // Router: permite navegar programáticamente (ej. ir a /login tras cerrar sesión)
    private router: Router,
    // CookieService (ngx-cookie-service): abstrae lectura/escritura de cookies del navegador
    private cookieService: CookieService,
    // ValidatorService y ErrorsService: validan y formatean errores ANTES de llamar al backend
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
  ) {}

  /**
   * validarLogin
   * Valida los campos del formulario de login en el frontend ANTES de llamar al backend.
   * Retorna un objeto con mensajes de error por campo; si está vacío, no hay errores.
   * Se llama en login-screen.ts antes de hacer el POST /login/.
   */
  public validarLogin(username: string, password: string){
    const data:any = {
      "username": username,
      "password": password
    };
    const error: any = {};

    console.log("Validando el login: ", data);


    if(!this.validatorService.required(data["username"])){
      error["username"] = this.errorService.required;
    }else if(!this.validatorService.maxLen(data["username"], 40)){
      error["username"] = this.errorService.max;
    }else if (!this.validatorService.email(data['username'])) {
      error['username'] = this.errorService.email;
    }

    if(!this.validatorService.required(data["password"])){
      error["password"] = this.errorService.required;
    }

    return error;

  }

  /**
   * login
   * Envía las credenciales al endpoint POST /login/ del backend.
   * Retorna un Observable<any>: el componente debe hacer .subscribe() para
   * ejecutar la petición y recibir la respuesta (token + datos del usuario).
   * Los headers indican al servidor que enviamos JSON.
   */
  public login(username: string, password: string): Observable<any> {
    const data = {
      "username": username,
      "password": password
    };

    const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.post<any>(`${environment.url_api}/login/`, data, headers);
  }

  /**
   * logout
   * Llama al endpoint GET /logout/ para invalidar el token en el backend.
   * Envía el token en el header Authorization: Bearer <token> para que el
   * backend sepa qué sesión eliminar.
   * Después de hacer .subscribe(), el componente debe llamar destroyUser()
   * para limpiar las cookies locales y redirigir a /login.
   */
  public logout(): Observable<any> {
    const token = this.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/logout/`, { headers });
  }

  /**
   * retrieveSignedUser
   * Llama al endpoint GET /me/ para obtener los datos del usuario autenticado.
   * Útil para refrescar los datos del perfil sin necesidad de reloguear.
   * Requiere el token JWT en el header.
   */
  retrieveSignedUser(){
    const token = this.getSessionToken();
    const headers = new HttpHeaders({'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/me/`, { headers });
  }

  getCookieValue(key:string){
    return this.cookieService.get(key);
  }

  saveCookieValue(key:string, value:string){
    const secure = environment.url_api.indexOf("https")!==-1;
    this.cookieService.set(key, value, undefined, undefined, undefined, secure, secure?"None":"Lax");
  }

  getSessionToken(){
    return this.cookieService.get(session_cookie_name);
  }

  /**
   * saveUserData
   * Persiste el token JWT y los datos del usuario en cookies del navegador
   * después de un login exitoso. La flag `secure` habilita la cookie como
   * Secure+SameSite=None en HTTPS (producción) o Lax en HTTP (desarrollo).
   * Soporta respuesta plana (campo directo) o anidada en 'user' (según el rol).
   */
  saveUserData(user_data: any) {
    const secure = environment.url_api.indexOf("https") !== -1;
    // Soporta respuesta plana o anidada en 'user'
    const id = user_data.id || user_data.user?.id;
    const email = user_data.email || user_data.user?.email;
    const first_name = user_data.first_name || user_data.user?.first_name || '';
    const last_name = user_data.last_name || user_data.user?.last_name || '';
    const name = (first_name + " " + last_name).trim();
    this.cookieService.set(user_id_cookie_name, id, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(user_email_cookie_name, email, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(user_complete_name_cookie_name, name, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(session_cookie_name, user_data.token, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(group_name_cookie_name, user_data.rol, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
  }

  /** destroyUser: elimina TODAS las cookies de sesión al cerrar sesión. */
  destroyUser(){
    this.cookieService.deleteAll();
  }

  getUserEmail(){
    return this.cookieService.get(user_email_cookie_name);
  }

  getUserCompleteName(){
    return this.cookieService.get(user_complete_name_cookie_name);
  }

  getUserId(){
    return this.cookieService.get(user_id_cookie_name);
  }

  getUserGroup(){
    return this.cookieService.get(group_name_cookie_name);
  }

  // ---- Role helpers (fuente única de verdad para toda la app) ----
  // Estos métodos son consumidos por NavbarUser, Sidebar, RegistroUsuariosScreen
  // y cualquier componente que necesite condicionar la UI según el rol del usuario.

  isAdmin(): boolean {
    return this.getUserGroup() === 'administrador';
  }

  isTeacher(): boolean {
    return this.getUserGroup() === 'maestro';
  }

  isStudent(): boolean {
    return this.getUserGroup() === 'alumno';
  }

  canSeeAdminItems(): boolean {
    return this.isAdmin();
  }

  canSeeTeacherItems(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  canSeeStudentItems(): boolean {
    return this.isAdmin() || this.isTeacher() || this.isStudent();
  }

  canSeeHomeItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  canSeeRegisterItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

}
