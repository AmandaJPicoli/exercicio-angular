import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

  clienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    })

  }

  validateAllFormFiels() {
    Object.keys(this.clienteForm.controls).forEach(field => {
      const control = this.clienteForm.get(field);
      control.markAsTouched();
    })
  }

  onSubmit() {
    if (this.clienteForm.invalid) {
      this.validateAllFormFiels();
      return;
    }

    this.cadastro();
  }

  cadastro() {
    this.apiService.postUsuario(this.clienteForm.value)
      .subscribe(
        response => this.onSuccessNovoCliente(),
        error => this.onErrorNovoCliente(),
      )
  }
  onSuccessNovoCliente(){
    this.toastr.success('Sucesso!', 'Cliente criado com sucesso.');
    this.router.navigate(['']);
  }

  onErrorNovoCliente(){
    this.toastr.error('Erro!', 'Não foi possível cadastrar cliente.');
  }
}
