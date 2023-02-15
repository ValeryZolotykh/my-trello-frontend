import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IBoard2 } from 'src/app/core/interfaces/iboard.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BoardsService {
  constructor(private httpClient: HttpClient) { }
  apiUrl = environment.baseURL;
  boardUrl = this.apiUrl + '/board';

  getBoards(): Observable<IBoard2[]> {
    return this.httpClient.get<{ boards: IBoard2[] }>(
      this.boardUrl, 
      { headers: { 'Authorization': 'Bearer 123'}}
    ).pipe(map(response => response.boards))
  }

  getBoard(id:number):Observable<IBoard2> {
    return this.httpClient.get<{ board: IBoard2 }>(
      this.boardUrl+"/"+id, 
      { headers: { 'Authorization': 'Bearer 123'}}
    ).pipe(map(response => response.board))
  }

  //  createBoard(boardValue: string) {
  //   return this.httpClient
  //     .post(this.boardUrl, { title: boardValue }, { headers: { Authorization: 'Bearer 123' } })
  //     .subscribe();
  // } 

  createBoard(titleBoard: string|null|undefined) {
    // if (!titleBoard) {//здесь тс ругался на то что может приходить андефайдет или нулл поэтому тут либо стринг либо тулл либо андефайдед но хз как это лучше
    //   return;
    // }
    return this.httpClient.post(this.boardUrl, { title: titleBoard }, { headers: { Authorization: 'Bearer 123' } });
  }

}


