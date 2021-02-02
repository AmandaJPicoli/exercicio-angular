import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Conta } from '../model/conta.interface';

@Component({
  selector: 'app-cadastro-conta',
  templateUrl: './cadastro-conta.component.html',
  styleUrls: ['./cadastro-conta.component.scss']
})
export class CadastroContaComponent implements OnInit {

  contaForm: FormGroup;
  valor: number;
  idCliente: string;
  idConta: string;
  estaCarregando: boolean;
  erroNoCarregamento: boolean;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }



  ngOnInit(): void {

    this.inicializaFormulario();

    this.idCliente = this.route.snapshot.paramMap.get('id');
    this.idConta = this.route.snapshot.paramMap.get('idConta')
    console.log("Modo Edição: " +  this.estaEditando())

    if (this.idCliente && this.idConta ) {
      this.carregarConta();
    }
  }

  estaEditando = () => Boolean(this.idConta);

  inicializaFormulario(){
    this.contaForm = this.fb.group({
      idUsuario: [this.idCliente],
      saldo: ['', Validators.required],
    })
  }

  

  carregarConta() {
    this.estaCarregando = true;
    this.erroNoCarregamento = false;

    this.apiService.getContaById(this.idConta)
      .pipe(
        take(1),
        finalize(() => this.estaCarregando = false)
      )
      .subscribe(
        response => this.onSuccessCarregarConta(response),
        error => this.onError(error),
      );
  }

  onSuccessCarregarConta(response: Conta) {
    this.contaForm.patchValue(response);
  }


  validateAllFormFiels(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFiels(control);
      }
    });
  }

  onSubmit() {
    if (this.contaForm.invalid) {
      this.validateAllFormFiels(this.contaForm);
      return;
    }
    if (this.estaEditando()) {
      this.salvarConta();
      return;
    }

    this.cadastro();
  }

  salvarConta() {
    this.apiService.updateConta(this.idConta, this.contaForm.value)
      .subscribe(
        response => this.onSuccessSalvarConta(),
        error => this.onError(error),
      );
  }

  onSuccessSalvarConta() {
    this.toastr.success('Sucesso!', 'Conta editada com sucesso.');
    this.router.navigate([`usuario/${this.idCliente}`]);
  }

  cadastro() {
    console.log(this.contaForm.value);
    this.apiService.postConta(this.contaForm.value)
      .subscribe(
        response => this.onSuccessNovaConta(),
        error => this.onError(error),
      )
  }

  onSuccessNovaConta() {
    this.toastr.success('Sucesso!', 'Conta criada com sucesso.');
    this.router.navigate([`usuario/${this.idCliente}`])
  }

  onError(error) {
    this.toastr.error('Erro!', 'Não foi possível realizar a operação.');
    console.log(error);
  }

  voltar(){
    this.router.navigate([`usuario/${this.idCliente}`]);
  }


}

