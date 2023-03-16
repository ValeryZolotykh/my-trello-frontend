import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IBoard } from 'src/app/core/interfaces/iboard.interface';
import { IBoards } from 'src/app/core/interfaces/iboards.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private httpClient: HttpClient, private notification: ToastrService) {}

  apiUrl = environment.baseURL;
  boardUrl = this.apiUrl + '/board';

  /**
   * Getting all boards.
   * @returns response from API
   */
  public getBoards(): Observable<IBoards[]> {
    return this.httpClient
      .get<{ boards: IBoards[] }>(this.boardUrl, { headers: { Authorization: 'Bearer 123' } })
      .pipe(map((response) => response.boards));
  }

  /**
   * Get certain board.
   * @param id id of certain board.
   * @returns response from API
   */
  public getBoard(id: number): Observable<IBoard> {
    return this.httpClient.get<IBoard>(this.boardUrl + '/' + id, {
      headers: { Authorization: 'Bearer 123' },
    });
  }

  /**
   * Creating new board.
   * @param titleBoard title of new board
   * @returns response from API
   */
  public createBoard(titleBoard: string): Observable<HttpResponse<Object>> {
    const response = this.httpClient.post(
      this.boardUrl,
      { title: titleBoard },
      { headers: { Authorization: 'Bearer 123' }, observe: 'response' },
    );
    this.catchResponse(
      response,
      'Доска создана',
      'Доска не создана! Возможно, доска с таким именем уже существует',
    );
    return response;
  }

  /**
   * Editing certain board.
   * @param idBoard id of certain board to be edited.
   * @param titleBoard new title of board
   * @returns response from API
   */
  public editBoard(idBoard: number, titleBoard: string): Observable<HttpResponse<Object>> {
    const response = this.httpClient.put(
      this.boardUrl + '/' + idBoard,
      { title: titleBoard },
      { headers: { Authorization: 'Bearer 123' }, observe: 'response' },
    );
    this.catchResponse(response, 'Доска отредактирована', 'Доска не отредактирована!');
    return response;
  }

  /**
   * Deleting certain board
   * @param idBoard id of certain board to be deleted.
   * @returns response from API
   */
  public deleteBoard(idBoard: number): Observable<HttpResponse<Object>> {
    const response = this.httpClient.delete(this.boardUrl + '/' + idBoard, {
      headers: { Authorization: 'Bearer 123' },
      observe: 'response',
    });
    this.catchResponse(response, 'Доска удалена', 'Доска не удалена!');
    return response;
  }

  /**
   * Catch response for notification about response.
   * @param response current response
   * @param successMessage message in successful response
   * @param errorMessage message in failed response
   */
  private catchResponse(
    response: Observable<HttpResponse<Object>>,
    successMessage: string,
    errorMessage: string,
  ): void {
    response.subscribe(
      () => {
        this.notification.success(successMessage);
      },
      () => {
        this.notification.error(errorMessage);
      },
    );
  }
}
