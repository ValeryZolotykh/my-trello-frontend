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
export class BoardsResolver implements Resolve<IBoard2[]> {
  constructor (
    private readonly boardsService: BoardsService,
  ) {}
  //resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):......
  resolve(): Observable<IBoard2[]> {
    return this.boardsService.getBoards();
  } 
  
}
