import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICard } from 'src/app/core/interfaces/icard.interface';
import { ICards } from 'src/app/core/interfaces/icards.interface';
import { IList } from 'src/app/core/interfaces/ilist.interface';
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

  @Input() list?: IList;
  @Input() idList = 0;
  @Input() titleList = '';
  @Input() cardsList: ICards[] = [];

  @Output() listDeleted = new EventEmitter();
  @Output() listEdited = new EventEmitter();
  @Output() cardDeleted = new EventEmitter();
  @Output() cardCreated = new EventEmitter();
  @Output() cardDragged = new EventEmitter();

  idBoard = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  editingList = false;
  creatingCard = false;
  isCardCreated = false;
  newPositionForCard = 0;

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

  /* DRAG AND DROP */

  /**
   * Save the information about the dragged card.
   * @param event The drag event that triggered the method.
   * @param card The dragged card.
   */
  public onDragStart(event: DragEvent, card: ICard): void {
    event.dataTransfer?.setData(
      'application/json',
      JSON.stringify({
        idCard: card.id, // The ID of the dragged card.
        idList: this.idList, // The ID of initial list of the dragged card..
        position: card.position, // Position of the dragged card in the initial list.
        initialList: this.list, // The initial list of the dragged card.
      }),
    );
  }

  /**
   * Called when a draggable card is dragged over the drop-zone.
   * Creates a drop-zone slot above or below the card.
   * @param event The drag event that triggered the method.
   * @param card The dragged card.
   */
  public onDragEnter(event: DragEvent, card?: ICard): void {
    event.preventDefault(); // Prevent the default behavior of the drag event, which may interfere with the custom logic
    const dropZoneTarget = event.target as HTMLElement; // Get the target element that triggered the event and cast it as an html-element
    // Find the drop-zone slots within the card container and check if the array of cards isn't empty
    if (dropZoneTarget.className === 'content-card' && !!this.cardsList) {
      // Get the dimensions and position of the card
      const cardRect = dropZoneTarget.getBoundingClientRect(); // Return the position and size information of the element
      const cardHeight = cardRect.height; // Return the height of the element(card)
      const cardTopOffset = cardRect.top;
      const mouseY = event.clientY; // Get the Y coordinate of the mouse cursor at the time of the event
      const isAboveHalf = mouseY - cardTopOffset < cardHeight / 2;

      const cardContainer = dropZoneTarget.parentElement;
      const slots = cardContainer?.querySelectorAll('.drop');
      // Create a new drop-zone slot
      if (!slots?.length) {
        const slot = this.createDropZone();
        if (isAboveHalf) {
          // If the cursor is above the half of the card, insert the slot above it
          dropZoneTarget?.insertAdjacentElement('beforebegin', slot); // Insert the slot before the target element
          this.newPositionForCard = card!.position; // Update position for the card
        } else {
          // If the cursor is below the half of the card, insert the slot below it
          dropZoneTarget?.insertAdjacentElement('afterend', slot); // Insert the slot after the target element
          this.newPositionForCard = card!.position + 1; // Update position for the card
        }
      }
    }
  }

  /**
   * Handles the event when a draggable element leaves a drop zone.
   * @param event The drag event that triggered the method.
   */
  public onDragLeave(event: DragEvent): void {
    event.preventDefault(); // Prevent the default behavior of the drag event, which may interfere with the custom logic
    const element = event.target as HTMLElement; // Get the target element that triggered the event and cast it as an html-element
    const cardContainer = element.closest('.card'); // Find the closest ancestor element with the class "card" inside the target element
    const containerCoordinate = cardContainer!.getBoundingClientRect(); //Get the bounding rectangle of the card container element to determine its position and size

    // Check if the mouse pointer is outside the boundaries of the container
    if (
      event.clientX < containerCoordinate.left ||
      event.clientX > containerCoordinate.right ||
      event.clientY < containerCoordinate.top ||
      event.clientY > containerCoordinate.bottom
    ) {
      // Remove all drop slots within the card container
      const slots = cardContainer!.querySelectorAll('.drop');
      slots.forEach((slot: any) => slot.remove());
    }
  }

  /**
   *  This method handles the logic when a drag event triggers the drop action for a card.
   * @param event The drag event that triggered the method.
   */
  public onDragDrop(event: DragEvent): void {
    event.preventDefault(); // Prevent the default behavior of the drag event, which may interfere with the custom logic

    // Extract data about the dragged card from the drag event
    const dataDrag = JSON.parse(event.dataTransfer!.getData('application/json'));

    // Change the position of the dragged card
    this.cardsService
      .editCard(
        [{ id: dataDrag.idCard, position: this.newPositionForCard, list_id: this.idList }],
        this.idBoard,
      )
      .subscribe(() => {
        /* Data about the old list where the card was moved from of the dragged card 
        and about the new list where the card was moved.*/
        const dragData = {
          currentListCards: this.cardsList,
          newPositionOfCard: this.newPositionForCard,
          currentIdList: this.idList,
          oldListCards: dataDrag.initialList,
          oldPositionOfCard: dataDrag.position,
          oldIdList: dataDrag.idList,
        };
        this.cardDragged.emit(dragData); // Change the positions +1 in the list where card was moved and -1 in the list wheere vards was moved from
      });

    // Delete the drop-zone element from the DOM after the drop event
    const dropZone = event.target as HTMLElement;
    dropZone?.remove();
  }

  /**
   * Called when a draggable card is dragged over the drop-zone in empty list.
   * Creates a drop-zone slot in empty list.
   * @param event The drag event that triggered the method.
   */
  public onDragEnterEmptyList(event: DragEvent): void {
    event.preventDefault(); // Prevent the default behavior of the drag event, which may interfere with the custom logic
    // If list is empty, then create the drop-zone
    if (!this.cardsList.length) {
      const cardContainer = event.target as HTMLElement;
      const slots = cardContainer?.querySelectorAll('.drop');
      if (!slots?.length) {
        const slot = this.createDropZone();
        cardContainer.lastElementChild?.insertAdjacentElement('beforebegin', slot);
        this.newPositionForCard = 1;
      }
    }
  }

  /**
   * Handles the event when a draggable element leaves a drop zone when list is empty.
   * @param event The drag event that triggered the method.
   */
  public onDragLeaveEmptyList(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const containerCoordinate = target!.getBoundingClientRect();

    // Check if the mouse pointer is outside the boundaries of the container
    if (
      event.clientX < containerCoordinate.left ||
      event.clientX > containerCoordinate.right ||
      event.clientY < containerCoordinate.top ||
      event.clientY > containerCoordinate.bottom - 5
    ) {
      // Remove all drop slots within the card container
      const slots = target!.querySelectorAll('.drop');
      slots.forEach((slot: any) => slot.remove());
    }
  }

  /**
   * Creates a drop zone element and returns it. The drop zone is a div element with specified styles and a 'drop' class.
   * It is used to handle drag-and-drop events for elements that can be dropped onto it.
   * @returns {HTMLElement} The created drop zone element.
   */
  public createDropZone(): HTMLElement {
    const slot = document.createElement('div');
    slot.style.cssText = `
    width: auto;
    height: 30px;
    border-radius: 4px;
    border: 1px dotted white;
    background: rgba(120, 120, 193, 0.355);
    margin-bottom: 20px;
    margin-top: 10px;`;
    /* Prevent the default behavior when an element is dragged over the drop zone.
    This is necessary to allow dropping elements onto the zone.*/
    slot.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    slot.classList.add('drop');
    return slot;
  }
  /* END LOGIC OF DRAG-N-DROP */
}
