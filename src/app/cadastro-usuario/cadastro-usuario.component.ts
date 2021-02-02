import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Usuario } from '../model/usuario.interface';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

  clienteForm: FormGroup;
  estaCarregando: boolean;
  erroNoCarregamento: boolean;
  clienteId: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.inicializaFormulario();
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      this.carregarCliente();
    }
  }

  inicializaFormulario() {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    })
  }


  carregarCliente() {
    this.estaCarregando = true;
    this.erroNoCarregamento = false;

    this.apiService.getUsuarioById(this.clienteId)
      .pipe(
        take(1),
        finalize(() => this.estaCarregando = false)
      )
      .subscribe(
        response => this.onSuccessCarregarCliente(response),
        error => this.onErrorCarregarCliente(error),
      );
  }

  onSuccessCarregarCliente(response: Usuario) {
    this.clienteForm.patchValue(response);
  }

  onErrorCarregarCliente(error: any) {
    this.erroNoCarregamento = true;
    console.error(error);
  }

  estaEditando = () => Boolean(this.clienteId);

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
    if (this.clienteForm.invalid) {
      this.validateAllFormFiels(this.clienteForm);
      return;
    }
    if (this.estaEditando()) {
      this.salvarCliente();
      return;
    }

    this.cadastro();
  }

  salvarCliente() {
    this.apiService.updateUsuario(this.clienteId, this.clienteForm.value)
      .subscribe(
        response => this.onSuccessSalvarCliente(),
        error => this.onError(),
      );
  }

  onSuccessSalvarCliente() {
    this.toastr.success('Sucesso!', 'Cliente editado com sucesso.');
    this.router.navigate(['']);
  }

  cadastro() {
    this.apiService.postUsuario(this.clienteForm.value)
      .subscribe(
        response => this.onSuccessNovoCliente(),
        error => this.onError(),
      )
  }
  onSuccessNovoCliente() {
    this.toastr.success('Sucesso!', 'Cliente criado com sucesso.');
    this.router.navigate(['']);
  }

  onError() {
    this.toastr.error('Erro!', 'Alguma coisa deu errado.');
  }

  exibeErro(nomeControle: string) {
    if (!this.clienteForm.get(nomeControle)) {
      return false;
    }
    return this.clienteForm.get(nomeControle).invalid && this.clienteForm.get(nomeControle).touched;
  }


}
