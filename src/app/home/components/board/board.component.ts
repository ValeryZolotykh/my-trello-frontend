import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBoard } from 'src/app/core/interfaces/iboard.interface';
import { ICards } from 'src/app/core/interfaces/icards.interface';
import { BoardsService } from '../../services/boards.service';
import { CardsService } from '../../services/cards.service';
import { ListsService } from '../../services/lists.service';

@Component({
  selector: 'tr-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private boardService: BoardsService,
    private router: Router,
    private listsService: ListsService,
    private cardsService: CardsService,
  ) {}

  board?: IBoard;

  idBoard = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  creatingList = false;

  editingBoard = false;

  ngOnInit(): void {
    this.initBoard();
    console.log(this.board?.lists);
  }

  /**
   * Initializing the board. Getting data before loading of the board page.
   */
  private initBoard(): void {
    this.activatedRoute.data.subscribe(({ board }) => {
      this.board = board;
    });
  }

  /**
   * Navigation to home page.
   */
  public linkToBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Editing the name of board by press enter or lost focus of input.
   * If the new value is not equal to the previous value and is not null/undefined,
   * then sending put-request and updating current board.
   * @param newTitle new title of board.
   */
  public editBoard(newTitle: string): void {
    if (newTitle != this.board?.title && newTitle != undefined && newTitle != null) {
      this.boardService.editBoard(this.idBoard, newTitle).subscribe(() => {
        this.getBoard(this.idBoard);
      });
    }
    this.editingBoard = false; //flag of editing of title toggle to false
  }

  /**
   * Deleting of the current board and return to the home page.
   */
  public deleteBoard(): void {
    this.boardService.deleteBoard(this.idBoard).subscribe(() => {
      this.linkToBack();
    });
  }

  /**
   * Creating the new list and updating current board.
   * @param titleList title of the new list.
   */
  public createList(titleList: string): void {
    this.creatingList = false;

    if (titleList != undefined && titleList != null) {
      const currentLists = this.board!.lists;
      const lastList = currentLists[currentLists?.length - 1];
      let position = lastList === undefined ? 0 : lastList.position;

      this.listsService.createList(this.idBoard, titleList, ++position).subscribe(() => {
        this.getBoard(this.idBoard);
      });
    }
  }

  /**
   * After response from API about successful deleting list in child-component(listComponent), delete this list from array of lists by id-list to update view.
   * @param idList id list which deleted.
   */
  public onListDeleted(idList: number): void {
    // this.board?.lists?.splice(
    //   this.board.lists.findIndex((list) => list.id === idList),
    //   1,
    // );
    this.getBoard(this.idBoard);
  }

  /**
   * After response from API about successful editing list in child-component(listComponent), send get-request to API to update view of board
   */
  public onListEdited(): void {
    this.getBoard(this.idBoard);
  }

  /**
   * After response from API about successful creating card in child-component(listComponent), send get-request to API to update view of board
   */
  public onCardCreated(): void {
    this.getBoard(this.idBoard);
  }

  /**
   * After response from API about successful dragging card in child-component(listComponent),
   * change the positions of cards in old list of dragged card and in the new list and send get-request
   * to API to update view of board.
   * @param dataDrag data about the old list of the dragged card and about the new list where the card was moved.
   */
  public onCardDragged(dataDrag: any): void {
    /* Getting an array of cards for which need to add 1 to the them position in the list
    where the card was moved */
    const changedCards: ICards[] = dataDrag.currentListCards.slice(dataDrag.newPositionOfCard - 1);

    /* Change the positions of the cards to +1 and create array of objects for put-request */
    const requestCardsData: { id: number; position: number; list_id: number }[] = [];
    for (let i = 0; i < changedCards.length; i++) {
      const position: number = 1 + changedCards[i].position;
      const cardData = {
        id: changedCards[i].id,
        position: position,
        list_id: dataDrag.currentIdList,
      };
      requestCardsData.push(cardData);
    }

    /* Send the put-request for update the positions of the cards */
    this.cardsService.editCard(requestCardsData, this.idBoard).subscribe(() => {
      this.getBoard(this.idBoard);

      /* Getting an array of cards for which need to subtract 1 to the them position in the list
     where the card was moved from*/
      const updatedCards = dataDrag.oldListCards.cards.slice(dataDrag.oldPositionOfCard);

      /* Change the positions of the cards to -1 and create array of objects for put-request */
      const reqCardsData: { id: number; position: number; list_id: number }[] = [];
      for (let i = 0; i < updatedCards.length; i++) {
        const position: number = updatedCards[i].position - 1;
        const cardData = {
          id: updatedCards[i].id,
          position: position,
          list_id: dataDrag.oldIdList,
        };
        reqCardsData.push(cardData);
      }
      /* Send the put-request for update the positions of the cards */
      this.cardsService.editCard(reqCardsData, this.idBoard).subscribe(() => {
        this.getBoard(this.idBoard);
      });
    });
  }

  /**
   * Get certain board.
   * @param idBoard id of certain board.
   */
  public getBoard(idBoard: number): void {
    this.boardService.getBoard(idBoard).subscribe((response) => {
      this.board = response;
      this.cdRef.markForCheck();
    });
  }
}
