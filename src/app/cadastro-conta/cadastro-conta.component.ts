import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cadastro-conta',
  templateUrl: './cadastro-conta.component.html',
  styleUrls: ['./cadastro-conta.component.scss']
})
export class CadastroContaComponent implements OnInit {

  contaForm: FormGroup;
  valor: number;
  idCliente: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.idCliente = this.route.snapshot.paramMap.get('id');

    this.inicializaFormulario();
  }

  inicializaFormulario(){
    this.contaForm = this.fb.group({
      idUsuario: [this.idCliente],
      saldo: ['', Validators.required],
    })
  }

  validateAllFormFiels() {
    Object.keys(this.contaForm.controls).forEach(field => {
      const control = this.contaForm.get(field);
      control.markAsTouched();
    })
  }

  onSubmit() {
    if (this.contaForm.invalid) {
      this.validateAllFormFiels();
      return;
    }

    this.cadastro();
  }

  cadastro() {
    console.log(this.contaForm.value);
    this.apiService.postConta(this.contaForm.value)
      .subscribe(
        response => this.onSuccessNovaConta(),
        error => this.onErrorNovaConta(),
      )
  }
  onSuccessNovaConta() {
    this.toastr.success('Sucesso!', 'Conta criada com sucesso.');
    this.router.navigate([`usuario/${this.idCliente}`])
  }

  onErrorNovaConta() {
    this.toastr.error('Erro!', 'Não foi possível criar conta.');
  }


}

