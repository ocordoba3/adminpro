import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/service.index';
import { Medico } from 'src/app/models/medico.model';
import { Router } from '@angular/router';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  totalRegistros = 0;
  desde = 0;
  medicos: Medico[] = [];
  cargando = true;

  constructor( public _medicoService: MedicoService,
               public router: Router) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  buscarMedico( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this._medicoService.buscarMedico( termino )
      .subscribe( (medicos: Medico[]) => {

        this.medicos = medicos;
        this.cargando = false;

      });
    }

  cargarMedicos() {
    this._medicoService.cargarMedicos( this.desde)
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.medicos = resp.medicos;
        this.cargando = false;
            });
  }


  editarMedico( medico: Medico ) {

    this.router.navigate(['/medico/', medico._id]);


  }

  borrarMedico( medico: Medico ) {

    swal({
      title: '¿Está seguro?',
      text: 'De borrar a ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( borrar => {
      // console.log( borrar );

      if (borrar) {

        this._medicoService.borrarMedico( medico._id )
          .subscribe( resp => {
            this.cargarMedicos();
          });

      }
    });
  }

  cambiarDesde( valor: number ) {

    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }


}
