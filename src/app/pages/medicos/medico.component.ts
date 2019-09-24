import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { NgForm } from '@angular/forms';
import { Medico } from '../../models/medico.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { MedicoService } from '../../services/medico/medico.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospitalSelect: Hospital = new Hospital('');
  desde = 0;

  constructor( public _hospitalService: HospitalService,
               public _medicoService: MedicoService,
               public router: Router,
               public activatedRoute: ActivatedRoute,
               public _modalService: ModalUploadService ) {

                activatedRoute.params.subscribe( params => {

                  let id = params.id;

                  if ( id !== 'nuevo' ) {
                    this.cargarMedico( id );
                  }
                });
               }

  ngOnInit() {
    this._hospitalService.cargarHospitales( this.desde )
        .subscribe( hospitales => this.hospitales = hospitales );

    this._modalService.notificacion
        .subscribe( (resp: any) => {

          this.medico.img = resp.medico.img;

        });
  }

  cargarMedico( id: string ) {
    this._medicoService.cargarMedico( id )
      .subscribe( medico => {

        this.medico = medico;
        this.medico.hospital = medico.hospital._id;
        this.cambioHospital( this.medico.hospital );
      } );
  }

  guardarMedico( f: NgForm ) {

    console.log(f.value);

    if ( f.invalid ) {
      return;
    }

    this._medicoService.guardarMedico( this.medico )
      .subscribe( medico => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico/', medico._id]);
      });

  }

  cambioHospital( id: string ) {

    this._hospitalService.obtenerHospital( id )
      .subscribe( hospital => this.hospitalSelect = hospital );

  }

  cambiarFoto( ) {

    this._modalService.mostrarModal('medicos', this.medico._id );

  }


}
