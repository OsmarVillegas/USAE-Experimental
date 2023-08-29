import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { DatosGenerales } from './models/datosGenerales';
import { Antiguedad } from './models/antiguedad';
import { preaparacionAcademica } from './models/preaparacionAcademica';
import { Curso } from './models/cursos';
import { Centro } from './models/centro';
import { Empleados } from './models/empleados';
import { debounceTime } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css'],
})
export class AdminViewComponent implements OnInit {
  //Variables
  puntajeAnios: number[] = new Array(28).fill(0);
  Cursos = [
    {
      _id: '0',
      id: 1,
      nombre: 'Curso_1',
      puntaje: 10,
    },
    {
      _id: '1',
      id: 2,
      nombre: 'Curso_2',
      puntaje: 11,
    },
    {
      _id: '2',
      id: 3,
      nombre: 'Curso_3',
      puntaje: 12,
    },
  ];

  ObjetoImpersion = [
    {
      _id: '64db4b4d387e427c22a89069',
      validar: [false, true],
      id: '1',
    },
  ];

  CentrosDeTrabajo: any = [];

  Empleados: any = [];

  ejemplo: any;

  Personal = [
    {
      RFC: 'AAAV870205SX6',
      Nombre: 'VICTOR MANUEL ALVAREZ AGUILAR',
    },
    {
      RFC: 'AABE820901356',
      Nombre: 'EFRAIN ALFARO BARBOSA',
    },
  ];

  modoImpresion: boolean[] = [false, true];
  visibilidadModoImpresion: boolean[] = [false, true];
  modoEdicion: boolean = false;
  programasDesarrollo: number = 0;
  total: number = 0;
  posicionDelCurso: number = 0;
  habilitarBotonAgregarCurso: boolean = false;
  habilitarBotonEnviarInformacion: boolean = false;
  habilitarFormularioCentrosDeTrabajo: boolean = false;
  habilitarFormularioEmpleados: boolean = false;
  evaluar1: boolean = false;
  evaluar2: boolean = false;
  evaluar3: boolean = false;
  validacionArchivo: boolean = false;
  URL: string = 'https://experimental-kteg.vercel.app/api/';
  MAX_RETRIES: number = 6; // Número máximo de intentos
  BASE_INTERVAL_MS: number = 2000; // Intervalo base en milisegundos
  requestOptions = {
    method: 'GET',
  };
  formatos: boolean = true;
  centroDeTrabajo: boolean = false;
  empleados: boolean = false;
  guiaUsuarios: boolean = false;
  pageCentros: number = 1;
  pageEmpleados: number = 1;

  //Variables formato
  Formato_FCAPS_Seleccionado: File = new File([], '');
  Formato_CentralesDrs_Seleccionado: File = new File([], '');
  Formato_Educativa_Seleccionado: File = new File([], '');
  Formato_Horario_Seleccionado: File = new File([], '');
  Formato_Inscripciones_Seleccionado: File = new File([], '');
  Formato_SNTE_Seleccionado: File = new File([], '');
  Formato_Jefatura_Seleccionado: File = new File([], '');
  Formato_Guia_Usuario_Seleccionado: File = new File([], '');

  Formato_FCAPS_Nombre: string = '';
  Formato_CentralesDrs_Nombre: string = '';
  Formato_Educativa_Nombre: string = '';
  Formato_Horario_Nombre: string = '';
  Formato_Inscripciones_Nombre: string = '';
  Formato_SNTE_Nombre: string = '';
  Formato_Jefatura_Nombre: string = '';
  Formato_Guia_Usuario_Nombre: string = '';

  //Información que se recibe del backend
  datosgenerales: DatosGenerales;
  antiguedad: Antiguedad;
  preparacionacademica: preaparacionAcademica;
  curso: Curso;
  centro: Centro;
  empleado: Empleados;
  buscarClave = new FormControl();
  buscarNombre = new FormControl();

  //Preparación académica
  puntajeTotalMaximo: number = 0;

  calcularPuntajeTotalMaximo() {
    this.puntajeTotalMaximo =
      this.preparacionacademica.primaria[5] +
      this.preparacionacademica.secundaria[2] +
      this.preparacionacademica.carreraC[2] +
      this.preparacionacademica.licenciatura[3];
  }

  //Cursos
  constructor(private spinner: NgxSpinnerService, private http: HttpClient) {
    this.datosgenerales = {
      _id: '0',
      anio: '0',
      etapa: '',
      etapaConLetra: '',
      fechaLimite: '',
      municipio: '',
      periodoEvaluado: '',
    };
    this.antiguedad = {
      _id: '0',
      valoresAntiguedad: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
    };
    this.preparacionacademica = {
      _id: '0',
      primaria: [0, 0, 0, 0, 0, 0],
      secundaria: [0, 0, 0],
      carreraC: [0, 0, 0],
      licenciatura: [0, 0, 0, 0],
    };
    this.Cursos.length >= 1
      ? (this.curso = {
          _id: '',
          id: this.Cursos[this.Cursos.length - 1].id + 1,
          nombre: '',
          puntaje: 0,
        })
      : (this.curso = {
          _id: '',
          id: 0,
          nombre: '',
          puntaje: 0,
        });

    this.CentrosDeTrabajo.length >= 1
      ? (this.centro = {
          _id: '',
          id: this.CentrosDeTrabajo[this.CentrosDeTrabajo.length - 1].id + 1,
          claveCentro: '',
          nombreCentro: '',
        })
      : (this.centro = {
          _id: '',
          id: 0,
          claveCentro: '',
          nombreCentro: '',
        });

    this.Empleados.length >= 1
      ? (this.empleado = {
          _id: '',
          id: this.Empleados[this.Empleados.length - 1].id + 1,
          RFC: '',
          nombreEmpleado: '',
        })
      : (this.empleado = {
          _id: '',
          id: 0,
          RFC: '',
          nombreEmpleado: '',
        });
  }

  // Inicio Centro de Trabajo

  buscarCentroDeTrabajo() {
    this.buscarClave.valueChanges.pipe(debounceTime(500)).subscribe((query) => {
      this.obtenerCentroDeTrabajo(query.toUpperCase());
    });
  }

  async obtenerCentroDeTrabajo(query: string) {
    this.http
      .get(this.URL + 'centroDeTrabajo', {
        params: new HttpParams().set('claveCentro', query),
      })
      .subscribe((result) => {
        this.CentrosDeTrabajo = result;
      });
  }

  async agregarCentroDeTrabajo() {
    try {
      let idCentro: string = '';

      this.CentrosDeTrabajo.length >= 1
        ? (this.centro.id =
            this.CentrosDeTrabajo[this.CentrosDeTrabajo.length - 1].id + 1)
        : (this.centro.id = 0);

      await fetch(this.URL + 'centroDeTrabajo', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(this.centro), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error('Error:', error))
        .then((response) => {
          console.log('Success:', response);
          idCentro = response._id;
        });

      this.centro._id = idCentro;

      this.CentrosDeTrabajo.push(this.centro);

      this.centro = {
        _id: '',
        id: this.Cursos[this.Cursos.length - 1].id + 1,
        claveCentro: '',
        nombreCentro: '',
      };
    } catch (err) {
      alert('Ha ocurrido un error.');
    }
  }

  async eliminarCentroDeTrabajo(id: number) {
    let posicionDelCentro = 0;

    for (let i = 0; this.CentrosDeTrabajo.length - 1 >= i; i++) {
      if (this.CentrosDeTrabajo[i].id === id) {
        posicionDelCentro = i;
        break;
      }
    }

    if (confirm('¿Está seguro que desea eliminarlo?')) {
      await fetch(
        this.URL +
          'centroDeTrabajo/' +
          this.CentrosDeTrabajo[posicionDelCentro]._id,
        {
          method: 'delete',
        }
      ).then((response) =>
        response.json().then((json) => {
          return json;
        })
      );

      this.CentrosDeTrabajo.splice(posicionDelCentro, 1);
    }
  }

  // Fin Centro de Trabajo

  // Inicio Empleado

  buscarEmpleado() {
    this.buscarNombre.valueChanges
      .pipe(debounceTime(500))
      .subscribe((query) => {
        this.obtenerEmpleado(query.toUpperCase());
      });
  }

  async obtenerEmpleado(query: string) {
    this.http
      .get(this.URL + 'empleados', {
        params: new HttpParams().set('nombre', query),
      })
      .subscribe((result) => {
        this.Empleados = result;
      });
  }

  async agregarEmpleado() {
    try {
      let idEmpleados: string = '';

      this.Empleados.length >= 1
        ? (this.empleado.id =
            this.Empleados[this.Empleados.length - 1].id + 1)
        : (this.empleado.id = 0);

      await fetch(this.URL + 'empleados', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(this.empleado), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error('Error:', error))
        .then((response) => {
          console.log('Success:', response);
          idEmpleados = response._id;
        });

      this.empleado._id = idEmpleados;

      this.Empleados.push(this.empleado);

      this.empleado = {
        _id: '',
        id: this.Cursos[this.Cursos.length - 1].id + 1,
        RFC: '',
        nombreEmpleado: '',
      };
    } catch (err) {
      alert('Ha ocurrido un error.');
    }
  }

  async eliminarEmpleado(id: number) {
    let posicionDelEmpleado = 0;

    for (let i = 0; this.Empleados.length - 1 >= i; i++) {
      if (this.Empleados[i].id === id) {
        posicionDelEmpleado = i;
        break;
      }
    }

    if (confirm('¿Está seguro que desea eliminarlo?')) {
      await fetch(
        this.URL + 'empleados/' + this.Empleados[posicionDelEmpleado]._id,
        {
          method: 'delete',
        }
      ).then((response) =>
        response.json().then((json) => {
          return json;
        })
      );

      this.Empleados.splice(posicionDelEmpleado, 1);
    }
  }

  // Fin Centro de Trabajo

  async sendRequestWithRetry(
    url: string,
    options: object,
    retries = 0
  ): Promise<any> {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        return response.json();
      } else {
        if (retries == 6) {
          this.spinner.hide();
          alert('No se ha podido conectar al servidor');
        }
        throw new Error(`Respuesta no válida: ${response.status}`);
      }
    } catch (error) {
      if (retries < this.MAX_RETRIES) {
        console.error(`Intento ${retries + 1} - Error: ${error}`);
        const interval = this.BASE_INTERVAL_MS * Math.pow(2, retries);
        await new Promise((resolve) => setTimeout(resolve, interval));
        return this.sendRequestWithRetry(url, options, retries + 1);
      } else {
        alert('No se ha podido conectar al servidor');
        throw error;
      }
    }
  }

  async ngOnInit() {
    this.spinner.show();

    this.buscarCentroDeTrabajo();
    this.buscarEmpleado();


    await this.sendRequestWithRetry(
      this.URL + 'empleados',
      this.requestOptions
    ).then((post) => {
      this.Empleados = post;
    });

    await this.sendRequestWithRetry(
      this.URL + 'centroDeTrabajo',
      this.requestOptions
    ).then((post) => {
      this.CentrosDeTrabajo = post;
    });

    await this.sendRequestWithRetry(this.URL + 'datosGenerales', this.requestOptions).then((post) => {
      this.datosgenerales = post[0];
    });

    await this.sendRequestWithRetry(this.URL + 'antiguedad', this.requestOptions).then((post) => {
      this.antiguedad = post[0];
    });

    await this.sendRequestWithRetry(this.URL + 'preparacionAcademica', this.requestOptions).then((post) => {
      this.preparacionacademica = post[0];
    });

    await this.sendRequestWithRetry(this.URL + 'cursos', this.requestOptions).then((post) => {
      this.Cursos = post;
    });

    await this.sendRequestWithRetry(this.URL + 'modoImpresion', this.requestOptions).then((post) => {
      this.ObjetoImpersion = post;
    });

    setTimeout(() => {
      this.modoImpresion = [...this.ObjetoImpersion[0].validar];
      this.visibilidadModoImpresion = [...this.modoImpresion];
      this.spinner.hide();
      this.rellenarFormularioAntiguedad();
    }, 500);

    const FCAPS = document.getElementById(
      'btnFormato_FCAPS'
    ) as HTMLInputElement;
    const centrales = document.getElementById(
      'btnCentralesDRs'
    ) as HTMLInputElement;
    const educativa = document.getElementById(
      'btnEducativa'
    ) as HTMLInputElement;
    const SNTE = document.getElementById('btnSNTE') as HTMLButtonElement;
    const Jefatura = document.getElementById('btnJefatura') as HTMLInputElement;


    FCAPS.disabled = true;
    centrales.disabled = true;
    educativa.disabled = true;
    SNTE.disabled = true;
    Jefatura.disabled = true;

    
    let comprobar_1 = true;
    let comprobar_2 = true;

    // Variables que se repiten constantemente
    setInterval(() => {
      this.calcularPuntajeTotalMaximo();
      if (this.formatos) {
        this.evaluandoCurso();
        this.evaluarFormulario();

        if(comprobar_1){
          const FCAPS = document.getElementById(
            'btnFormato_FCAPS'
          ) as HTMLInputElement;
          const centrales = document.getElementById(
            'btnCentralesDRs'
          ) as HTMLInputElement;
          const educativa = document.getElementById(
            'btnEducativa'
          ) as HTMLInputElement;
          const SNTE = document.getElementById('btnSNTE') as HTMLButtonElement;
          const Jefatura = document.getElementById('btnJefatura') as HTMLInputElement;

          FCAPS.disabled = true;
          centrales.disabled = true;
          educativa.disabled = true;
          SNTE.disabled = true;
          Jefatura.disabled = true;

          comprobar_1 = false;
          comprobar_2 = true;
        }

      }

      if (this.centroDeTrabajo) {
        this.evaluandoCentroDeTrabajo();

        comprobar_1 = true;
        comprobar_2 = true;
      }
      
      if (this.empleados) {
        this.evaluandoEmpleados();

        comprobar_1 = true;
        comprobar_2 = true;
      }

      if (this.guiaUsuarios) {
        if(comprobar_2) {
          const GuiaUsuarios = document.getElementById('btnGuiaUsuario') as HTMLInputElement;
          GuiaUsuarios.disabled = true;

          comprobar_1 = true;
          comprobar_2 = false;
        }
      }

      this.programasDesarrollo = this.Cursos.reduce((a, b) => a + b.puntaje, 0);
      this.total = this.puntajeAnios[27] + this.programasDesarrollo + this.puntajeTotalMaximo + 60;

    }, 100);
  }

  async seleccionarModoImpresion() {
    let error = true;

    this.modoImpresion = [...this.visibilidadModoImpresion];
    this.ObjetoImpersion[0].validar = [...this.visibilidadModoImpresion];

    await fetch(this.URL + 'modoImpresion/64db4b4d387e427c22a89069', {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(this.ObjetoImpersion[0]), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((error) => console.log(error))
      .then((response) => {
        console.log('Success:', response);
        error = false;
      });

    if (error) {
      alert('ERROR, no se pudo actualizar el modo de impresión');
    } else {
      alert('Actualizado correctamente');
    }

    // this.Cursos.splice(this.posicionDelCurso, 1); // Eliminar el registro del arreglo
    // this.Cursos.push(this.curso);
  }

  cambiarModoImpresion_1() {
    const modoImpresion_1 = document.getElementById(
      'modoEdicion_1'
    ) as HTMLInputElement;

    this.visibilidadModoImpresion[0] = modoImpresion_1.checked;
    this.visibilidadModoImpresion[1] = false;
  }

  cambiarModoImpresion_2() {
    const modoImpresion_2 = document.getElementById(
      'modoEdicion_2'
    ) as HTMLInputElement;

    this.visibilidadModoImpresion[1] = modoImpresion_2.checked;
    this.visibilidadModoImpresion[0] = false;
  }

  // Cursos
  async addCursos() {
    let idParaObjeto: string = '';
    this.Cursos.length >= 1
      ? (this.curso.id = this.Cursos[this.Cursos.length - 1].id + 1)
      : (this.curso.id = 0);

    await fetch(this.URL + 'cursos', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(this.curso), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        console.log('Success:', response);
        idParaObjeto = response._id;
      });

    this.curso._id = idParaObjeto;

    this.Cursos.push(this.curso);

    this.curso = {
      _id: '',
      id: this.Cursos[this.Cursos.length - 1].id + 1,
      nombre: '',
      puntaje: 0,
    };

    this.programasDesarrollo = this.Cursos.reduce((a, b) => a + b.puntaje, 0);
  }

  // Evaluar formularios
  evaluandoCentroDeTrabajo() {
    const claveCentroTrabajo = document.getElementById('claveCentro') as HTMLInputElement;
    const nombreCentroTrabajo = document.getElementById('nombreCentro') as HTMLInputElement;

    if(claveCentroTrabajo.value.length >= 1 && nombreCentroTrabajo.value.length >= 1){
      this.habilitarFormularioCentrosDeTrabajo = true;
    } else {
      this.habilitarFormularioCentrosDeTrabajo = false;
    }
  }

  evaluandoEmpleados() {
    const empleadoRFC = document.getElementById('empleadoRFC') as HTMLInputElement;
    const empleadoNombre = document.getElementById('nombreEmpleado') as HTMLInputElement;

    let valirEmpleadoRFC = false;

    if (this.rfcValido(empleadoRFC.value)) {
      valirEmpleadoRFC = true;
    } else {
      valirEmpleadoRFC = false;
    }

    if(valirEmpleadoRFC === true && empleadoNombre.value.length >= 1){
      this.habilitarFormularioEmpleados = true;
    } else {
      this.habilitarFormularioEmpleados = false;
    }
  }

  evaluandoCurso() {
    const cursoNombre = document.getElementById(
      'nombreCurso'
    ) as HTMLInputElement;
    const cursoPuntaje = document.getElementById('puntaje') as HTMLInputElement;

    if (cursoNombre.value.length >= 1 && cursoPuntaje.value.length >= 1) {
      this.habilitarBotonAgregarCurso = true;
    } else {
      this.habilitarBotonAgregarCurso = false;
    }
  }
  // Evaluar formularios

  async deleteCursos(id: number) {
    console.log(id);
    console.log('cursos/' + this.Cursos[this.posicionDelCurso]._id);
    console.log(this.Cursos);

    for (let i = 0; this.Cursos.length - 1 >= i; i++) {
      if (this.Cursos[i].id === id) {
        this.posicionDelCurso = i;
        break;
      }
    }

    if (confirm('¿Está seguro que desea eliminarlo?')) {
      await fetch(
        this.URL + 'cursos/' + this.Cursos[this.posicionDelCurso]._id,
        {
          method: 'delete',
        }
      ).then((response) =>
        response.json().then((json) => {
          return json;
        })
      );

      this.Cursos.splice(this.posicionDelCurso, 1); // Eliminar el registro del arreglo
    }

    this.programasDesarrollo = this.Cursos.reduce((a, b) => a + b.puntaje, 0);
  }

  salirDelModoEdicion() {
    this.modoEdicion = false;

    this.curso = {
      _id: '',
      id: this.Cursos[this.Cursos.length - 1].id + 1,
      nombre: '',
      puntaje: 0,
    };
  }

  // Form
  resetForm(form?: NgForm) {
    if (form) {
      form.resetForm();
    }
  }

  rellenarFormularioAntiguedad() {
    this.puntajeAnios = this.antiguedad.valoresAntiguedad;
  }

  async enviarInformacion() {
    let comprobar = false;
    this.spinner.show();

    try {
      await fetch(this.URL + 'datosGenerales/' + this.datosgenerales._id, {
        method: 'PUT', // or 'PUT'
        body: JSON.stringify(this.datosgenerales), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error('Error:', error))
        .then((response) => {
          comprobar = true;
        });

      await fetch(this.URL + 'antiguedad/' + this.antiguedad._id, {
        method: 'PUT', // or 'PUT'
        body: JSON.stringify(this.antiguedad), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error('Error:', error))
        .then((response) => {
          comprobar = true;
        });

      await fetch(
        this.URL + 'preparacionAcademica/' + this.preparacionacademica._id,
        {
          method: 'PUT', // or 'PUT'
          body: JSON.stringify(this.preparacionacademica), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .catch((error) => console.error('Error:', error))
        .then((response) => {
          comprobar = true;
        });
      
      this.spinner.hide();

      if (comprobar) {
        alert('Se ha modificado la información exitosamente');
      } else {
        alert('Ha ocurrido un error mientras se enviaba la información');
      }
    } catch (error) {
      console.log(error);
    }
  }

  evaluarFormulario() {
    // Datos Generales
    // const anios = document.getElementById('anio') as HTMLInputElement;
    // const periodo = document.getElementById('periodo') as HTMLInputElement;
    const municipio = document.getElementById('municipio') as HTMLInputElement;
    // const etapa = document.getElementById('etapa') as HTMLInputElement;
    // const etapaLetra = document.getElementById(
    //   'etapaLetra'
    // ) as HTMLInputElement;
    // const fechaLimite = document.getElementById(
    //   'fechaLimite'
    // ) as HTMLInputElement;

    if (municipio.value.length >= 1) {
      this.evaluar1 = true;
    } else {
      this.evaluar1 = false;
    }

    // Anios de antiguedad
    const puntajeAnios1 = document.getElementById(
      'puntajeAnios1'
    ) as HTMLInputElement;
    const puntajeAnios2 = document.getElementById(
      'puntajeAnios2'
    ) as HTMLInputElement;
    const puntajeAnios3 = document.getElementById(
      'puntajeAnios3'
    ) as HTMLInputElement;
    const puntajeAnios4 = document.getElementById(
      'puntajeAnios4'
    ) as HTMLInputElement;
    const puntajeAnios5 = document.getElementById(
      'puntajeAnios5'
    ) as HTMLInputElement;
    const puntajeAnios6 = document.getElementById(
      'puntajeAnios6'
    ) as HTMLInputElement;
    const puntajeAnios7 = document.getElementById(
      'puntajeAnios7'
    ) as HTMLInputElement;
    const puntajeAnios8 = document.getElementById(
      'puntajeAnios8'
    ) as HTMLInputElement;
    const puntajeAnios9 = document.getElementById(
      'puntajeAnios9'
    ) as HTMLInputElement;
    const puntajeAnios10 = document.getElementById(
      'puntajeAnios10'
    ) as HTMLInputElement;
    const puntajeAnios11 = document.getElementById(
      'puntajeAnios11'
    ) as HTMLInputElement;
    const puntajeAnios12 = document.getElementById(
      'puntajeAnios12'
    ) as HTMLInputElement;
    const puntajeAnios13 = document.getElementById(
      'puntajeAnios13'
    ) as HTMLInputElement;
    const puntajeAnios14 = document.getElementById(
      'puntajeAnios14'
    ) as HTMLInputElement;
    const puntajeAnios15 = document.getElementById(
      'puntajeAnios15'
    ) as HTMLInputElement;
    const puntajeAnios16 = document.getElementById(
      'puntajeAnios16'
    ) as HTMLInputElement;
    const puntajeAnios17 = document.getElementById(
      'puntajeAnios17'
    ) as HTMLInputElement;
    const puntajeAnios18 = document.getElementById(
      'puntajeAnios18'
    ) as HTMLInputElement;
    const puntajeAnios19 = document.getElementById(
      'puntajeAnios19'
    ) as HTMLInputElement;
    const puntajeAnios20 = document.getElementById(
      'puntajeAnios20'
    ) as HTMLInputElement;
    const puntajeAnios21 = document.getElementById(
      'puntajeAnios21'
    ) as HTMLInputElement;
    const puntajeAnios22 = document.getElementById(
      'puntajeAnios22'
    ) as HTMLInputElement;
    const puntajeAnios23 = document.getElementById(
      'puntajeAnios23'
    ) as HTMLInputElement;
    const puntajeAnios24 = document.getElementById(
      'puntajeAnios24'
    ) as HTMLInputElement;
    const puntajeAnios25 = document.getElementById(
      'puntajeAnios25'
    ) as HTMLInputElement;
    const puntajeAnios26 = document.getElementById(
      'puntajeAnios26'
    ) as HTMLInputElement;
    const puntajeAnios27 = document.getElementById(
      'puntajeAnios27'
    ) as HTMLInputElement;
    const puntajeAnios28 = document.getElementById(
      'puntajeAnios28'
    ) as HTMLInputElement;

    if (
      puntajeAnios1.value.length >= 1 &&
      puntajeAnios2.value.length >= 1 &&
      puntajeAnios3.value.length >= 1 &&
      puntajeAnios4.value.length >= 1 &&
      puntajeAnios5.value.length >= 1 &&
      puntajeAnios6.value.length >= 1 &&
      puntajeAnios7.value.length >= 1 &&
      puntajeAnios8.value.length >= 1 &&
      puntajeAnios9.value.length >= 1 &&
      puntajeAnios10.value.length >= 1 &&
      puntajeAnios11.value.length >= 1 &&
      puntajeAnios12.value.length >= 1 &&
      puntajeAnios13.value.length >= 1 &&
      puntajeAnios14.value.length >= 1 &&
      puntajeAnios15.value.length >= 1 &&
      puntajeAnios16.value.length >= 1 &&
      puntajeAnios17.value.length >= 1 &&
      puntajeAnios18.value.length >= 1 &&
      puntajeAnios19.value.length >= 1 &&
      puntajeAnios20.value.length >= 1 &&
      puntajeAnios21.value.length >= 1 &&
      puntajeAnios22.value.length >= 1 &&
      puntajeAnios23.value.length >= 1 &&
      puntajeAnios24.value.length >= 1 &&
      puntajeAnios25.value.length >= 1 &&
      puntajeAnios27.value.length >= 1 &&
      puntajeAnios28.value.length >= 1
    ) {
      this.evaluar2 = true;
    } else {
      this.evaluar2 = false;
    }

    // preparacion Academica
    const prim1 = document.getElementById('prim1') as HTMLInputElement;
    const prim2 = document.getElementById('prim2') as HTMLInputElement;
    const prim3 = document.getElementById('prim3') as HTMLInputElement;
    const prim4 = document.getElementById('prim4') as HTMLInputElement;
    const prim5 = document.getElementById('prim5') as HTMLInputElement;
    const prim6 = document.getElementById('prim6') as HTMLInputElement;

    const sec1 = document.getElementById('sec1') as HTMLInputElement;
    const sec2 = document.getElementById('sec2') as HTMLInputElement;
    const sec3 = document.getElementById('sec3') as HTMLInputElement;

    const bach1 = document.getElementById('bach1') as HTMLInputElement;
    const bach2 = document.getElementById('bach2') as HTMLInputElement;
    const bach3 = document.getElementById('bach3') as HTMLInputElement;

    const lic1 = document.getElementById('lic1') as HTMLInputElement;
    const lic2 = document.getElementById('lic2') as HTMLInputElement;
    const lic3 = document.getElementById('lic3') as HTMLInputElement;
    const lic4 = document.getElementById('lic4') as HTMLInputElement;

    if (
      prim1.value.length >= 1 &&
      prim2.value.length >= 1 &&
      prim3.value.length >= 1 &&
      prim4.value.length >= 1 &&
      prim5.value.length >= 1 &&
      prim6.value.length >= 1 &&
      sec1.value.length >= 1 &&
      sec2.value.length >= 1 &&
      sec3.value.length >= 1 &&
      bach1.value.length >= 1 &&
      bach2.value.length >= 1 &&
      bach3.value.length >= 1 &&
      lic1.value.length >= 1 &&
      lic2.value.length >= 1 &&
      lic3.value.length >= 1 &&
      lic4.value.length >= 1
    ) {
      this.evaluar3 = true;
    } else {
      this.evaluar3 = false;
    }

    if (
      this.evaluar1 == true &&
      this.evaluar2 == true &&
      this.evaluar3 == true
    ) {
      this.habilitarBotonEnviarInformacion = true;
    } else {
      this.habilitarBotonEnviarInformacion = false;
    }
  }

  cargarArchivo_Formato_FCAPS(evento: any) {
    let FCAPS = document.getElementById('btnFormato_FCAPS') as HTMLInputElement;

    try {
      this.Formato_FCAPS_Seleccionado = evento.target.files[0];
      this.Formato_FCAPS_Nombre = this.Formato_FCAPS_Seleccionado.name;
      if (this.Formato_FCAPS_Seleccionado) {
        FCAPS.disabled = false;
      }
    } catch (e: any) {
      FCAPS.disabled = true;
    }
  }

  async enviarArchivo_Formato_FCAPS(evento: any) {
    this.spinner.show();
    evento.preventDefault();

    if (this.Formato_FCAPS_Seleccionado) {
      const formData = new FormData();
      formData.append('file', this.Formato_FCAPS_Seleccionado);
      this.validacionArchivo = true;

      await fetch(this.URL + 'files/Formato_FCAPS', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            this.validacionArchivo = true;
            // Realiza acciones adicionales si es necesario
          } else {
            this.validacionArchivo = false;
          }
        })
        .catch((error) => {
          this.validacionArchivo = false;
        });

      if (this.validacionArchivo) {
        this.spinner.hide();
        alert('Archivo enviado');
      } else {
        this.spinner.hide();
        alert('ERROR, archivo no enviado');
      }
    }
  }

  cargarArchivo_CentralesDrs(evento: any) {
    let centrales = document.getElementById(
      'btnCentralesDRs'
    ) as HTMLInputElement;

    try {
      this.Formato_CentralesDrs_Seleccionado = evento.target.files[0];
      this.Formato_CentralesDrs_Nombre =
        this.Formato_CentralesDrs_Seleccionado.name;

      if (this.Formato_CentralesDrs_Seleccionado) {
        centrales.disabled = false;
      }
    } catch (e: any) {
      centrales.disabled = true;
    }
  }

  async enviarArchivo_CentralesDrs(evento: any) {
    evento.preventDefault();
    this.validacionArchivo = true;

    if (this.Formato_CentralesDrs_Seleccionado) {
      const formData = new FormData();
      formData.append('file', this.Formato_CentralesDrs_Seleccionado);

      await fetch(this.URL + 'files/CentralesDRs', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            this.validacionArchivo = true;
            // Realiza acciones adicionales si es necesario
          } else {
            this.validacionArchivo = false;
          }
        })
        .catch((error) => {
          this.validacionArchivo = false;
        });

      if (this.validacionArchivo) {
        alert('Archivo enviado');
      } else {
        alert('ERROR, archivo no enviado');
      }
    }
  }

  cargarArchivo_Educativa(evento: any) {
    let educativa = document.getElementById('btnEducativa') as HTMLInputElement;

    try {
      this.Formato_Educativa_Seleccionado = evento.target.files[0];
      this.Formato_Educativa_Nombre = this.Formato_Educativa_Seleccionado.name;

      if (this.Formato_Educativa_Seleccionado) {
        educativa.disabled = false;
      }
    } catch (e: any) {
      educativa.disabled = true;
    }
  }

  async enviarArchivo_Educativa(evento: any) {
    evento.preventDefault();
    this.validacionArchivo = true;

    if (this.Formato_Educativa_Seleccionado) {
      const formData = new FormData();
      formData.append('file', this.Formato_Educativa_Seleccionado);

      await fetch(this.URL + 'files/Educativas', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            this.validacionArchivo = true;
            // Realiza acciones adicionales si es necesario
          } else {
            this.validacionArchivo = false;
            console.error('Error al enviar el archivo:', response.statusText);
          }
        })
        .catch((error) => {
          this.validacionArchivo = false;
          console.error('Error al enviar el archivo:', error);
        });

      if (this.validacionArchivo) {
        alert('Archivo enviado');
      } else {
        alert('ERROR, archivo no enviado');
      }
    }
  }

  cargarArchivo_Horario(evento: any) {
    let Horario = document.getElementById('btnHorario') as HTMLInputElement;

    try {
      this.Formato_Horario_Seleccionado = evento.target.files[0];
      this.Formato_Horario_Nombre = this.Formato_Horario_Seleccionado.name;

      if (this.Formato_Horario_Seleccionado) {
        Horario.disabled = false;
      }
    } catch (e: any) {
      Horario.disabled = true;
    }
  }

  async enviarArchivo_Horario(evento: any) {
    evento.preventDefault();
    this.validacionArchivo = true;

    if (this.Formato_Horario_Seleccionado) {
      const formData = new FormData();
      formData.append('file', this.Formato_Horario_Seleccionado);

      await fetch(this.URL + 'files/Horario', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            this.validacionArchivo = true;
            // Realiza acciones adicionales si es necesario
          } else {
            this.validacionArchivo = false;
            console.error('Error al enviar el archivo:', response.statusText);
          }
        })
        .catch((error) => {
          this.validacionArchivo = false;
          console.error('Error al enviar el archivo:', error);
        });

      if (this.validacionArchivo) {
        alert('Archivo enviado');
      } else {
        alert('ERROR, archivo no enviado');
      }
    }
  }

  cargarArchivo_Inscripciones(evento: any) {
    let Inscripcion = document.getElementById(
      'btnInscripciones'
    ) as HTMLInputElement;

    try {
      this.Formato_Inscripciones_Seleccionado = evento.target.files[0];
      this.Formato_Inscripciones_Nombre =
        this.Formato_Inscripciones_Seleccionado.name;
      if (this.Formato_Inscripciones_Seleccionado) {
        Inscripcion.disabled = false;
      }
    } catch (e: any) {
      Inscripcion.disabled = true;
    }
  }

  async enviarArchivo_Inscripciones(evento: any) {
    evento.preventDefault();
    this.validacionArchivo = true;

    if (this.Formato_Inscripciones_Seleccionado) {
      const formData = new FormData();
      formData.append('file', this.Formato_Inscripciones_Seleccionado);

      await fetch(this.URL + 'files/Inscripcion', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            this.validacionArchivo = true;
            // Realiza acciones adicionales si es necesario
          } else {
            this.validacionArchivo = false;
          }
        })
        .catch((error) => {
          this.validacionArchivo = false;
        });

      if (this.validacionArchivo) {
        alert('Archivo enviado');
      } else {
        alert('ERROR, archivo no enviado');
      }
    }
  }

  cargarArchivo_SNTE(evento: any) {
    let SNTE = document.getElementById('btnSNTE') as HTMLInputElement;

    try {
      this.Formato_Educativa_Seleccionado = evento.target.files[0];
      this.Formato_Educativa_Nombre = this.Formato_Educativa_Seleccionado.name;
      if (this.Formato_Educativa_Seleccionado) {
        SNTE.disabled = false;
      }
    } catch (e: any) {
      SNTE.disabled = true;
    }
  }

  async enviarArchivo_SNTE(evento: any) {
    evento.preventDefault();
    this.validacionArchivo = true;

    if (this.Formato_Educativa_Seleccionado) {
      const formData = new FormData();
      formData.append('file', this.Formato_Educativa_Seleccionado);

      await fetch(this.URL + 'files/SNTE', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            this.validacionArchivo = true;
          } else {
            this.validacionArchivo = false;
          }
        })
        .catch((error) => {
          this.validacionArchivo = true;
        });

      if (this.validacionArchivo) {
        alert('Archivo enviado');
      } else {
        alert('ERROR, archivo no enviado');
      }
    }
  }

  cargarArchivo_Jefatura(evento: any) {
    let Jefatura = document.getElementById('btnJefatura') as HTMLInputElement;

    try {
      this.Formato_Educativa_Seleccionado = evento.target.files[0];
      this.Formato_Educativa_Nombre = this.Formato_Educativa_Seleccionado.name;
      if (this.Formato_Educativa_Seleccionado) {
        Jefatura.disabled = false;
      }
    } catch (e: any) {
      Jefatura.disabled = true;
    }
  }

  async enviarArchivo_Jefatura(evento: any) {
    evento.preventDefault();
    this.validacionArchivo = true;

    if (this.Formato_Educativa_Seleccionado) {
      const formData = new FormData();
      formData.append('file', this.Formato_Educativa_Seleccionado);

      await fetch(this.URL + 'files/Jefatura', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            this.validacionArchivo = true;
          } else {
            this.validacionArchivo = false;
          }
        })
        .catch((error) => {
          this.validacionArchivo = false;
        });

      if (this.validacionArchivo) {
        alert('Archivo enviado');
      } else {
        alert('ERROR, archivo no enviado');
      }
    }
  }

  cargarArchivo_GuiaUsuario(evento: any) {
    let GuiaUsuarios = document.getElementById('btnGuiaUsuario') as HTMLInputElement;

    try {
      this.Formato_Guia_Usuario_Seleccionado = evento.target.files[0];
      this.Formato_Educativa_Nombre = this.Formato_Guia_Usuario_Seleccionado.name;
      if (this.Formato_Guia_Usuario_Seleccionado) {
        GuiaUsuarios.disabled = false;
      }
    } catch (e: any) {
      GuiaUsuarios.disabled = true;
    }
  }

  async enviarArchivo_GuiaUsuario(evento: any) {
    evento.preventDefault();
    this.validacionArchivo = true;

    if (this.Formato_Guia_Usuario_Seleccionado) {
      const formData = new FormData();
      formData.append('file', this.Formato_Guia_Usuario_Seleccionado);

      await fetch(this.URL + 'files/Usuario', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            this.validacionArchivo = true;
          } else {
            this.validacionArchivo = false;
          }
        })
        .catch((error) => {
          this.validacionArchivo = false;
        });

      if (this.validacionArchivo) {
        alert('Archivo enviado');
      } else {
        alert('ERROR, archivo no enviado');
      }
    }
  }

  rfcValido(rfc: string, aceptarGenerico = true) {
    const re =
      /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    var validado = rfc.match(re);
  
    if (!validado)
      //Coincide con el formato general del regex?
      return false;
  
    //Separar el dígito verificador del resto del RFC
    const digitoVerificador = validado.pop(),
      rfcSinDigito = validado.slice(1).join(''),
      len = rfcSinDigito.length,
      //Obtener el digito esperado
      diccionario = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ',
      indice = len + 1;
    var suma, digitoEsperado;
  
    if (len == 12) suma = 0;
    else suma = 481; //Ajuste para persona moral
  
    for (var i = 0; i < len; i++)
      suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
    digitoEsperado = 11 - (suma % 11);
    if (digitoEsperado == 11) digitoEsperado = 0;
    else if (digitoEsperado == 10) digitoEsperado = 'A';
  
    //El dígito verificador coincide con el esperado?
    // o es un RFC Genérico (ventas a público general)?
    if (
      digitoVerificador != digitoEsperado &&
      (!aceptarGenerico || rfcSinDigito + digitoVerificador != 'XAXX010101000')
    )
      return false;
    else if (
      !aceptarGenerico &&
      rfcSinDigito + digitoVerificador == 'XEXX010101000'
    )
      return false;
    return rfcSinDigito + digitoVerificador;
  }

}
