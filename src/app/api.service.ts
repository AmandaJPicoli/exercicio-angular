import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from './model/usuario.interface';
import { environment } from 'src/environments/environment';
import { Conta } from './model/conta.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL = environment.API_URL;

  constructor(
    private http: HttpClient
  ) {
  }

  getUsuarios() {
    let usuarios = this.http.get<Usuario[]>(this.API_URL + '/usuario');
    return usuarios;
  }

  getUsuarioById(id: string) {
    let usuario = this.http.get<Usuario>(this.API_URL + `/usuario/${id}`);
    return usuario;
  }

  postUsuario(usuario: Usuario) {
    return this.http.post<Usuario>(this.API_URL + '/usuario', usuario);
  }

  updateUsuario(id: string, usuario: Usuario) {
    return this.http.put<Usuario>(this.API_URL + `/usuario/${id}`, usuario);
  }

  deleteUsuario(id: string) {
    return this.http.delete<Usuario>(this.API_URL + `/usuario/${id}`);
  }
  // CONTAS

  getConta() {
    return this.http.get<Conta[]>(this.API_URL + '/contas');
  }

  getContaById(idConta: any) {
    return this.http.get<Conta>(this.API_URL + `/contas/${idConta}`);
  }

  getContaByIdCLiente(idCliente: any) {
    return this.http.get<Conta[]>(this.API_URL + `/contas?idUsuario=${idCliente}`);
  }

  postConta(conta: Conta) {
    return this.http.post<Conta>(this.API_URL + '/contas', conta);
  }

  updateConta(idConta: string, conta: Conta) {
    return this.http.put<Conta>(this.API_URL + `/contas/${idConta}`, conta);
  }

  deleteConta(idConta: string) {
    return this.http.delete<Conta>(this.API_URL + `/contas/${idConta}`);
  }


}
