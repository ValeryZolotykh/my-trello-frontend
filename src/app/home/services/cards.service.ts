import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  constructor(private httpClient: HttpClient, private notification: ToastrService) {}
  apiUrl = environment.baseURL;
  boardUrl = this.apiUrl + '/board';

  /**
   * Creating new card.
   * @param idBoard id current board.
   * @param titleCard new title of the card.
   * @param idList id current list.
   * @param position position card in the list
   * @returns response from APi
   */
  public createCard(
    idBoard: number,
    titleCard: string,
    idList: number,
    position: number,
  ): Observable<HttpResponse<Object>> {
    const response = this.httpClient.post(
      this.boardUrl + '/' + idBoard + '/card',
      { title: titleCard, list_id: idList, position: position },
      { headers: { Authorization: 'Bearer 123' }, observe: 'response' },
    );
    this.catchResponse(response, 'Карточка создана!', 'Карточка не создана!');
    return response;
  }

  /**
   * Deleting certain card
   * @param idBoard id of current board.
   * @param idCard id certain card to be deleted.
   * @returns response from API
   */
  public deleteCard(idBoard: number, idCard: number): Observable<HttpResponse<Object>> {
    const response = this.httpClient.delete(this.boardUrl + '/' + idBoard + '/card/' + idCard, {
      headers: { Authorization: 'Bearer 123' },
      observe: 'response',
    });
    this.catchResponse(response, 'Карточка удалена!', 'Карточка не удалена!');
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
