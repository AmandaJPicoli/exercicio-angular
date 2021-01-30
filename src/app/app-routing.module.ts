import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { DetalhesClienteComponent } from './detalhes-cliente/detalhes-cliente.component';
import { CadastroContaComponent } from './cadastro-conta/cadastro-conta.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: 'usuario/:id', component: DetalhesClienteComponent },
  { path: 'usuario/:id/cadastro-conta', component: CadastroContaComponent },
  { path: 'usuario/:id/editar', component: CadastroUsuarioComponent },
  ];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
