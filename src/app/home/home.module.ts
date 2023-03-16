import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeRoutingModule } from './home-routing.module';
import { BoardComponent } from './components/board/board.component';
import { ListComponent } from './components/list/list.component';
import { CardComponent } from './components/card/card.component';
import { HomeComponent } from './components/home/home.component';
import { SimpleInputFormComponent } from './components/simple-input-form/simple-input-form.component';

@NgModule({
  declarations: [
    BoardComponent,
    ListComponent,
    CardComponent,
    HomeComponent,
    SimpleInputFormComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, ReactiveFormsModule, HttpClientModule],
})
export class HomeModule {}
