import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  token: string;
  usuario: Usuario;

  constructor( public http: HttpClient,
               public router: Router,
               public _subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
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
            }));

  }

  loginGoogle( token: string ) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
    .pipe(map( (resp: any) => {
      this.guardarStorage( resp.id, resp.token, resp.usuario );
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
      this.guardarStorage( resp.id, resp.token, resp.usuario );
      return true;
    }));
  }

  logOut() {
    this.token = '';
    this. usuario = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario) );

    this.token = token;
    this.usuario = usuario;

  }

  cargarStorage() {

    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
        .pipe(map( (resp: any) => {

          if ( usuario._id === this.usuario._id ) {
            this.guardarStorage(resp.usuario._id, this.token, this.usuario);
          }

          swal('Usuario actualizado', usuario.nombre, 'success');

          return true;

        }));

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
      .then( (resp: any) => {

        this.usuario.img = resp.usuario.img;
        swal( 'Imagen actualizada', this.usuario.nombre , 'success');
        this.guardarStorage(id, this.token, this.usuario);

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
