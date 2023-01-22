import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { BoardComponent } from './components/board/board.component';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [
    BoardComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
