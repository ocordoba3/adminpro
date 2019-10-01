import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  token: string;
  usuario: Usuario;
  menu: any[] = [];

  constructor( public http: HttpClient,
               public router: Router,
               public _subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
  }

  renuevaToken() {

    let url = URL_SERVICIOS + '/login/renuevaToken';
    url += '?token=' + this.token;

    return this.http.get( url )
                    .pipe( map( (resp: any) => {
                      this.token = resp.token;
                      localStorage.setItem('token', this.token);

                      return true;
                    }),
                    catchError( err => {
                      this.router.navigate(['/login']);
                      swal( 'Error al renovar token', 'No fue posible renovar el token', 'error');
                      return Observable.throw( err );
                    }));
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
            .pipe(map( (resp: any) => {
              swal('Usuario creado correctamente', usuario.email, 'success');
              return resp.usuario;
            }),
            catchError( err => {
              swal( err.error.mensaje , err.error.errors.message, 'error');
              return Observable.throw( err );
            }));

  }

  loginGoogle( token: string ) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
    .pipe(map( (resp: any) => {
      this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
      // console.log(resp);
      return true;
    }));
  }


  login( usuario: Usuario, recuerdame: boolean = false ) {

    if ( recuerdame ) {
     localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';

    return this.http.post( url, usuario )
                    .pipe(map( (resp: any) => {
                      this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
                      return true;
                    }),
                          catchError( err => {
                            swal( 'Error al inciar sesión', err.error.mensaje, 'error');
                            return Observable.throw( err );
                          }));
  }

  logOut() {
    this.token = '';
    this. usuario = null;
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');


    this.router.navigate(['/login']);
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('menu', JSON.stringify(menu) );


    this.token = token;
    this.usuario = usuario;
    this.menu = menu;

  }

  cargarStorage() {

    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.menu = JSON.parse( localStorage.getItem('menu') );

    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
        .pipe(map( (resp: any) => {
          if ( usuario._id === this.usuario._id ) {
            this.guardarStorage(resp.usuario._id, this.token, this.usuario, this.menu);
          }
          swal('Usuario actualizado', usuario.nombre, 'success');
          return true;
        }),
        catchError( err => {
          swal( err.error.mensaje , err.error.errors.message, 'error');
          return Observable.throw( err );
        }));

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
      .then( (resp: any) => {

        this.usuario.img = resp.usuario.img;
        swal( 'Imagen actualizada', this.usuario.nombre , 'success');
        this.guardarStorage(id, this.token, this.usuario, this.menu);

      })
      .catch( resp => {
        swal( 'Error al cambiar imagen', this.usuario.nombre , 'warning');
      });

  }

  cargarUsuarios( desde: number ) {

    let url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);
  }

  buscarUsuarios( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
    .pipe(map( (resp: any) => resp.usuarios ));
  }

  borrarUsuario( id: string ) {

    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url)
      .pipe(map( resp => {
        swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
        return true;
      }));
  }
}
