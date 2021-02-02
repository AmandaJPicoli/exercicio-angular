import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { Conta } from '../model/conta.interface';
import { Usuario } from '../model/usuario.interface';

@Component({
  selector: 'app-detalhes-cliente',
  templateUrl: './detalhes-cliente.component.html',
  styleUrls: ['./detalhes-cliente.component.scss']
})
export class DetalhesClienteComponent implements OnInit {

  contas: Conta[];
  cliente: Usuario;
  estaCarregando: boolean;
  erroNoCarregamento: boolean;
  clienteId: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.carregarContato();
    this.carregarContas();
  }

  carregarContas() {
    this.estaCarregando = true;
    this.erroNoCarregamento = false;
    
    this.apiService.getContaByIdCLiente(this.clienteId)
      .pipe(
      take(1),
      finalize(() => this.estaCarregando = false)
    )
      .subscribe(
        response => this.onSuccessContas(response),
        error => this.onError(error),
      );
  }

  onSuccessContas(response: Conta[]) {
    this.contas = response;
  }

  carregarContato() {
    this.estaCarregando = true;
    this.erroNoCarregamento = false;

    this.clienteId = this.route.snapshot.paramMap.get('id');
    this.apiService.getUsuarioById(this.clienteId)
      .pipe(
        take(1),
        finalize(() => this.estaCarregando = false)
      )
      .subscribe(
        response => this.onSuccess(response),
        error => this.onError(error),
      );
  }

  onSuccess(response: Usuario) {
    this.cliente = response;
  }

  onError(error: any) {
    this.erroNoCarregamento = true;
    console.error(error);
  }

  voltar() {
    this.router.navigate(['']);
  }

  gotoContas(idCliente) {
    this.router.navigate([`usuario/${idCliente}/cadastro-conta`]);
  }

  deletarConta(id: number) {
    this.apiService.deleteConta(id.toString())
      .subscribe(
        response => this.onSuccessDeletarConta(id),
        error => this.onErrorDeletarConta(),
      );
  }

  onSuccessDeletarConta(id) {
    this.toastr.success('Sucesso!', 'Contato deletado com sucesso.');
    this.contas = this.contas.filter(conta => conta.id !== id);
  }

  onErrorDeletarConta() {
    this.toastr.error('Erro!', 'Houve um erro ao tentar deletar. Tente novamente');
  }

  gotoEditarConta(clienteId ,idConta){
    this.router.navigate([`usuario/${clienteId}/cadastro-conta/${idConta}`]);
  }


}
