import { Injectable, Input } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { Router } from '@angular/router';
import {map} from 'rxjs/operators';
import { Hospital } from '../../models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';




@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  token: string;
  id: string;
  hospital: Hospital;
  totalHospitales = 0;

  constructor(
      public http: HttpClient,
      public router: Router,
      public _subirArchivoService: SubirArchivoService,
      public _usuarioService: UsuarioService
      ) {
        this._usuarioService.cargarStorage();
        this.token = this._usuarioService.token;

      }

    cargarHospitales( desde: number ) {

      let url = URL_SERVICIOS + '/hospital?desde=' + desde;

      return this.http.get(url)
        .pipe( map( (resp: any) => {
          this.totalHospitales = resp.total;
          return resp.hospitales;
        }));
    }

    crearHospital( nombre: string ) {

      let url = URL_SERVICIOS + '/hospital';
      url += '?token=' + this.token ;

      return this.http.post( url, { nombre } )
              .pipe(map( (resp: any) => {
                swal('Hospital creado', 'correctamente' , 'success');
                return resp.hospital;
              }));

      }

    obtenerHospital( id: string ) {

      let url = URL_SERVICIOS + '/hospital/' + id;

      return this.http.get(url)
        .pipe( map( (resp: any) => resp.hospital ));

    }

    borrarHospital( id: string ) {

      let url = URL_SERVICIOS + '/hospital/' + id;
      url += '?token=' + this.token;

      return this.http.delete(url)
        .pipe(map( resp => {
          swal('Hospital borrado', 'El hospital ha sido eliminado correctamente', 'success');
          return true;
        }));
    }

    buscarHospital( termino: string ) {

      let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

      return this.http.get(url)
          .pipe(map( (resp: any) => resp.hospitales ));
    }

    actualizarHospital( hospital: Hospital ) {

      let url = URL_SERVICIOS + '/hospital/' + hospital._id;
      url += '?token=' + this.token;

      return this.http.put( url, hospital )
          .pipe(map( (resp: any) => {

            swal('Hospital actualizado', hospital.nombre, 'success');

            return true;

          }));
    }
  }
