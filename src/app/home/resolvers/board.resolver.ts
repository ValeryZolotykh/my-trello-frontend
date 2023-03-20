import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IBoard } from 'src/app/core/interfaces/iboard.interface';
import { BoardsService } from '../services/boards.service';

@Injectable({
  providedIn: 'root',
})
export class BoardResolver implements Resolve<IBoard> {
  constructor(private readonly boardsService: BoardsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBoard> {
    const idBoard = Number(route.paramMap.get('id'));
    return this.boardsService.getBoard(idBoard);
  }
}
