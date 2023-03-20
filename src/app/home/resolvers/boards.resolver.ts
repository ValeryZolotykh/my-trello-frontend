import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IBoards } from 'src/app/core/interfaces/iboards.interface';
import { BoardsService } from '../services/boards.service';

@Injectable({
  providedIn: 'root',
})
export class BoardsResolver implements Resolve<IBoards[]> {
  constructor(private readonly boardsService: BoardsService) {}

  resolve(): Observable<IBoards[]> {
    return this.boardsService.getBoards();
  }
}
