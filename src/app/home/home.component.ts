import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { Usuario } from '../model/usuario.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  clientes: Usuario[];
  estaCarregando: boolean;
  erroNoCarregamento: boolean;
  clienteForm: FormGroup;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.carregarClientes();
    this.inicializaForm();
  }

  inicializaForm() {
    this.clienteForm = this.fb.group({
      cliente: ['', Validators.required]
    })
  }

  get cliente() {
    return this.clienteForm.get('cliente').value;
  }

  onSubmit(){
    let clienteId = this.clienteForm.get('cliente').value;
    this.router.navigate([`usuario/${clienteId}`]);
  }

  carregarClientes() {
    this.estaCarregando = true;
    this.erroNoCarregamento = false;

    this.apiService.getUsuarios()
      .pipe(
        take(1),
        finalize(() => this.estaCarregando = false)
      )
      .subscribe(
        response => this.onSuccess(response),
        error => this.onError(error)
      );
  }

  onSuccess(response: Usuario[]) {
    this.clientes = response;
  }

  onError(error: any) {
    this.erroNoCarregamento = true;
    console.error(error);
  }

  gotoDetalhesCliente(clienteId: number) {
    this.router.navigate([`usuario/${clienteId}`]);
  }

  gotoCadastroClientes() {
    this.router.navigate(['cadastro-usuario']);
  }

  gotoEditarCliente(clienteId: number) {
    this.router.navigate([`usuario/${clienteId}/editar`]);
  }

  deletarCliente(idCliente: number) {
    this.apiService.deleteUsuario(idCliente.toString())
      .subscribe(
        response => this.onSuccessDeletarCliente(idCliente),
        error => this.onErrorDeletarCliente(),
      );
  }

  onSuccessDeletarCliente(idCliente) {
    this.toastr.success('Sucesso!', 'Cliente deletado com sucesso.');
    this.clientes = this.clientes.filter(cliente => cliente.id !== idCliente);
  }

  onErrorDeletarCliente() {
    this.toastr.success('Erro!', 'Houve um erro ao tentar deletar. Tente novamente');
  }



}
