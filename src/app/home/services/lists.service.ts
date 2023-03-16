import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  constructor(private httpClient: HttpClient, private notification: ToastrService) {}
  apiUrl = environment.baseURL;
  boardUrl = this.apiUrl + '/board';

  /**
   * Creating new list.
   * @param idBoard id of certain board.
   * @param titleList new title of list.
   * @param position position of list in board page.
   * @returns response from API
   */
  public createList(
    idBoard: number,
    titleList: string,
    position: number,
  ): Observable<HttpResponse<Object>> {
    const response = this.httpClient.post(
      this.boardUrl + '/' + idBoard + '/list',
      { title: titleList, position: position },
      { headers: { Authorization: 'Bearer 123' }, observe: 'response' },
    );
    this.catchResponse(response, 'Список создан!', 'Список не создан!');
    return response;
  }

  /**
   * Editing certain list.
   * @param idBoard id current board.
   * @param titleList new title of list.
   * @param idList id of certain list to be edited.
   * @returns response from API
   */
  public editList(
    idBoard: number,
    titleList: string,
    idList: number,
  ): Observable<HttpResponse<Object>> {
    const response = this.httpClient.put(
      this.boardUrl + '/' + idBoard + '/list/' + idList,
      { title: titleList },
      { headers: { Authorization: 'Bearer 123' }, observe: 'response' },
    );
    this.catchResponse(response, 'Список отредактирован!', 'Список не отредактирован!');
    return response;
  }

  /**
   * Deleting certain list.
   * @param idBoard id of current board.
   * @param idList id of certain list to be deleted.
   * @returns response from API
   */
  public deleteList(idBoard: number, idList: number): Observable<HttpResponse<Object>> {
    const response = this.httpClient.delete(this.boardUrl + '/' + idBoard + '/list/' + idList, {
      headers: { Authorization: 'Bearer 123' },
      observe: 'response',
    });
    this.catchResponse(response, 'Список удален!', 'Список не удален!');
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
