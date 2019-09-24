import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor( public activatedRoute: ActivatedRoute,
               public http: HttpClient,
               public router: Router ) {

    activatedRoute.params
      .subscribe( params => {
        let termino = params.termino;
        this.buscar( termino );
      });
   }

  ngOnInit() {
  }

  buscar( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/todo/' + termino;

    return this.http.get( url )
              .subscribe( (resp: any) => {
                console.log(resp);
                this.usuarios = resp.usuarios;
                this.medicos = resp.medicos;
                this.hospitales = resp.hospitales;
              });
  }

  clickUsuario() {
    this.router.navigate(['/usuarios']);
  }

  clickHospital() {
    this.router.navigate(['/hospitales']);
  }

  clickMedico( id: string ) {
    this.router.navigate(['/medico', id]);
  }
}
