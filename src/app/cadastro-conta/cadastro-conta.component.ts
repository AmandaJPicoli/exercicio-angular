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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const clienteId = this.route.snapshot.paramMap.get('idCliente');

    this.contaForm = this.fb.group({
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
    this.apiService.postConta(this.contaForm.value)
      .subscribe(
        response => this.onSuccessNovaConta(this.contaForm.value.idUsuario),
        error => this.onErrorNovaConta(),
      )
  }
  onSuccessNovaConta(clienteId) {
    this.toastr.success('Sucesso!', 'Conta criada com sucesso.');
    this.router.navigate([`usuario/${clienteId}`])
  }

  onErrorNovaConta() {
    this.toastr.error('Erro!', 'Não foi possível criar conta.');
  }


}

