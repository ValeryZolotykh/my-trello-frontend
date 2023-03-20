import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICards } from 'src/app/core/interfaces/icards.interface';
import { CardsService } from '../../services/cards.service';
import { ListsService } from '../../services/lists.service';

@Component({
  selector: 'tr-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  constructor(
    private listsService: ListsService,
    private readonly activatedRoute: ActivatedRoute,
    private cardsService: CardsService,
  ) {}

  @Input() idList = 0;

  @Input() titleList = '';

  @Input() cardsList: ICards[] = [];

  @Output() listDeleted = new EventEmitter();

  @Output() listEdited = new EventEmitter();

  @Output() cardDeleted = new EventEmitter();

  @Output() cardCreated = new EventEmitter();

  idBoard = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  editingList = false;

  creatingCard = false;

  isCardCreated = false;

  /**
   * Editing the name of list by press enter or lost focus of input.
   * If the new value is not equal to the previous value and is not null/undefined,
   * then sending put-request and updating board page.
   * @param newTitle new title of list.
   */
  public editList(newTitle: string): void {
    if (newTitle != this.titleList && newTitle != undefined && newTitle != null) {
      this.listsService.editList(this.idBoard, newTitle, this.idList).subscribe(() => {
        this.listEdited.emit(this.titleList); //send event to parent-component(boardComponent) to update view of the board after response from the API about successful editing list
      });
    }
    this.editingList = false;
  }

  /**
   * Deleting of the current list and updating the board page.
   */
  public deleteList(): void {
    this.listsService.deleteList(this.idBoard, this.idList).subscribe(() => {
      this.listDeleted.emit(this.idList); //send event to parent-component(boardComponent) to update view of the board after response from the API about successful deleting list
    });
  }

  /**
   * After response from API about successful deleting card in child-component(cardComponent), delete this card from array of cards by id-card to update view.
   * @param idCard id card which deleted.
   */
  public onCardDeleted(idCard: number): void {
    this.cardsList?.splice(
      this.cardsList.findIndex((list) => list.id === idCard),
      1,
    );
  }

  /**
   * Creating the new card and updating the board page.
   * @param titleCard title of the new card.
   */
  public createCard(titleCard: string): void {
    this.creatingCard = false;
    if (titleCard != null && titleCard != undefined) {
      const lastCard = this.cardsList[this.cardsList?.length - 1];
      let position = lastCard === undefined ? 0 : lastCard.position;
      this.cardsService
        .createCard(this.idBoard, titleCard, this.idList, ++position)
        .subscribe(() => {
          this.cardCreated.emit(this.idList); //send event to parent-component(boardComponent) to update view of the board after response from the API about successful creating card
        });
    }
  }
}
