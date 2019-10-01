import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from 'src/app/models/medico.model';

import swal from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  token: string;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {
    this.token = this._usuarioService.token;

  }

  cargarMedicos( desde: number) {

    let url = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get( url );
  }

  cargarMedico( id: string ) {

    let url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get( url )
      .pipe( map( ( resp: any ) => resp.medico ));
  }

  borrarMedico( id: string ) {

    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url)
      .pipe(map( resp => {
        swal('Médico borrado', 'El médico ha sido eliminado correctamente', 'success');
        return true;
      }));
  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {

      // Actualizando

      url += '/' + medico._id;
      url += '?token=' + this.token;

      return this.http.put( url, medico )
        .pipe( map( (resp: any) => {
          swal('Médico actualizado', medico.nombre , 'success');
          return resp.medico;
        }));



    } else {

      // Creando

      url += '?token=' + this.token;

      return this.http.post( url, medico )
        .pipe( map( (resp: any) => {
          swal('Médico creado', 'El médico ha sido creado correctamente', 'success');
          return resp.medico;
        }));


    }


  }

  buscarMedico( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url)
        .pipe(map( (resp: any) => resp.medicos ));
  }

}
