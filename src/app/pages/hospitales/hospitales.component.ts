import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde = 0;
  cargando = true;

  constructor( public _hospitalService: HospitalService,
               public _modalService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalService.notificacion
      .subscribe( () => this.cargarHospitales() );
  }

  cargarHospitales() {

    this._hospitalService.cargarHospitales( this.desde )
      .subscribe( (resp: any) => {
        this.hospitales = resp;
        this.cargando = false;
            });

  }

  crearHospital( ) {
    swal({
      title: 'Crear hospital',
      text: 'Ingrese nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    })
    .then( (nombre: string) => {

      if ( !nombre || nombre.length === 0) {
        return;
      }

      this._hospitalService.crearHospital( nombre )
          .subscribe( resp => {
            // console.log( resp );
            this.cargarHospitales();

          });
    });

  }

  borrarHospital( hospital: Hospital ) {
    swal({
      title: '¿Está seguro?',
      text: 'De borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( borrar => {
      console.log( borrar );

      if (borrar) {

        this._hospitalService.borrarHospital( hospital._id )
          .subscribe( resp => {
            // console.log( resp );
            this.cargarHospitales();

          });

      }
    });
  }

  guardar( hospital: Hospital ) {

    this._hospitalService.actualizarHospital( hospital )
     .subscribe();
  }

  mostrarModal( id: string ) {

    this._modalService.mostrarModal( 'hospitales', id );

  }

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital( termino )
      .subscribe( (hospitales: Hospital[]) => {

        this.hospitales = hospitales;
        this.cargando = false;

      });
    }



  cambiar( valor: number ) {

    let desde = this.desde + valor;

    if ( desde >= this._hospitalService.totalHospitales ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
      }
}

