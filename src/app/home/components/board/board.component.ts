import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { last } from 'rxjs';
import { IBoard } from 'src/app/core/interfaces/iboard.interface';
import { BoardsService } from '../../services/boards.service';
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
  ) {}

  board?: IBoard;
  idBoard = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  creatingList = false;
  editingBoard = false;

  ngOnInit(): void {
    this.initBoard();
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
        this.boardService.getBoard(this.idBoard).subscribe((response) => {
          this.board = response;
          this.cdRef.markForCheck();
        });
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
   * After response from API about successful deleting list in child-component(listComponent), delete this list from array of lists by id-list to update view.
   * @param idList id list which deleted.
   */
  public onListDeleted(idList: number): void {
    this.board?.lists?.splice(
      this.board.lists.findIndex((list) => list.id === idList),
      1,
    );
  }

  /**
   * After response from API about successful editing list in child-component(listComponent), send get-request to API to update view of board
   */
  public onListEdited(): void {
    this.boardService.getBoard(this.idBoard).subscribe((response) => {
      this.board = response;
      this.cdRef.markForCheck();
    });
  }

  /**
   * After response from API about successful creating card in child-component(listComponent), send get-request to API to update view of board
   */
  public onCardCreated(): void {
    this.boardService.getBoard(this.idBoard).subscribe((response) => {
      this.board = response;
      this.cdRef.markForCheck();
    });
  }

  /**
   * Creating the new list and updating current board.
   * @param titleList title of the new list.
   */
  public createList(titleList: string): void {
    this.creatingList = false;

    if (titleList != undefined && titleList != null) {
      let currentLists = this.board!.lists;
      let lastList = currentLists[currentLists?.length - 1];
      let position = lastList === undefined ? 0 : lastList.position;

      this.listsService.createList(this.idBoard, titleList, ++position).subscribe(() => {
        this.boardService.getBoard(this.idBoard).subscribe((response) => {
          this.board = response;
          this.cdRef.markForCheck();
        });
      });
    }
  }
}
