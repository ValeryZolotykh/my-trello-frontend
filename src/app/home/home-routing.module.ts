import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { HomeComponent } from './components/home/home.component';
import { BoardResolver } from './resolvers/board.resolver';

const routes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path: 'board/:id',
    component: BoardComponent,
    resolve: {
      board: BoardResolver
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
