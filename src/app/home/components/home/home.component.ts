import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IBoards } from 'src/app/core/interfaces/iboards.interface';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'tr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  boards: IBoards[] = [];
  creatingBoard = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private boardService: BoardsService,
  ) {}

  ngOnInit(): void {
    this.initBoards();
  }

  /**
   *  Initializing the boards. Getting data before loading of the boards page.
   */
  private initBoards(): void {
    this.activatedRoute.data.subscribe(({ boards }) => {
      this.boards = boards;
    });
  }

  /**
   * Creating the new board and updating current home page.
   * @param titleBoard title of the new board.
   */
  public createBoard(titleBoard: string): void {
    if (titleBoard != undefined && titleBoard != null) {
      this.boardService
        .createBoard(titleBoard)
        .pipe(switchMap(() => this.boardService.getBoards()))
        .subscribe((boards) => {
          this.boards = boards;
          this.cdRef.markForCheck();
        });
    }
    this.creatingBoard = false;
  }
}
