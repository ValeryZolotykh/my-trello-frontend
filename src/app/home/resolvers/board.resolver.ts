import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IBoard } from 'src/app/core/interfaces/iboard.interface';
import { IBoard2 } from 'src/app/core/interfaces/iboard.interface';
import { BoardsService } from '../services/boards.service';

@Injectable({
  providedIn: 'root'
})

export class BoardResolver implements Resolve<IBoard2> {
  constructor(
    private readonly boardsService: BoardsService,
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<IBoard2> {
    let idBoard = Number(route.paramMap.get('id'));
    return this.boardsService.getBoard(idBoard);
  }
}
  //  let board = {
  //     id:1,
  //     title: "Моя тестовая доска from boardResolver",
  //     lists: [
  //       {
  //         id: 1,
  //         title: "Планы",
  //         cards: [
  //           {id: 1, title: "помыть кота"},
  //           {id: 2, title: "приготовить суп"},
  //           {id: 3, title: "сходить в магазин"}
  //         ]
  //       },
  //       {
  //         id: 2,
  //         title: "В процессе",
  //         cards: [
  //           {id: 4, title: "посмотреть сериал"}
  //         ]
  //       },
  //       {
  //         id: 3,
  //         title: "Сделано",
  //         cards: [
  //           {id: 5, title: "сделать домашку"},
  //           {id: 6, title: "погулять с собакой"}
  //         ]
  //       }
  //     ]
  //   }