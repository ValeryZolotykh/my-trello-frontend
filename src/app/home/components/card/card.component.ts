import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICard } from 'src/app/core/interfaces/icard.interface';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'tr-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  constructor(
    private cardsService: CardsService,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  @Input() titleCard = '';

  @Input() card?: ICard;

  @Input() idCard = 0;

  @Input() idList = 0;

  @Output() cardDeleted = new EventEmitter();

  @Output() cardDragged = new EventEmitter();
  @Output() cardDraggedOldList = new EventEmitter();
  // @Output() cardDragged2 = new EventEmitter();

  isDraggedCard = false;

  newPositionForCard = 0;

  /**
   * Deleting of the card and updating the board page.
   */
  public deleteCard(): void {
    const idBoard = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.cardsService.deleteCard(idBoard, this.idCard).subscribe(() => {
      this.cardDeleted.emit(this.idCard); //send event to parent-component(listComponent) to update view of the list after response from the API about successful deleting card
    });
  }

  public onDragStart(event: DragEvent) {
    // event.dataTransfer!.setData('text', String(this.idCard));
    event.dataTransfer!.setData(
      'application/json',
      JSON.stringify({ idCard: this.idCard, idList: this.idList, position: this.card?.position }),
    );

    this.cardDraggedOldList.emit(this.card?.position); //update the view of the list
  }

  public onDragEnter(event: DragEvent) {
    event.preventDefault();
    const el = event.target as HTMLElement;
    console.log("el")
    console.log(el)
    const list_element = (event.target as HTMLElement).parentElement?.parentElement?.parentElement;
    console.log("list_element")
    console.log(list_element)
    if (el.className === 'content-card') {
      const cardRect = el.getBoundingClientRect();
      const cardHeight = cardRect.height;
      const cardTopOffset = cardRect.top;
      const mouseY = event.clientY;
      const isAboveHalf = mouseY - cardTopOffset < cardHeight / 2;

      const cardContainer = el.parentElement;

      const slots = cardContainer?.querySelectorAll('.drop-top, .drop-bottom');
      if (!slots?.length) {
        const slot = document.createElement('div');
        slot.style.width = 'auto';
        slot.style.height = '50px';
        slot.style.border = ' 2px dotted white';
        slot.style.background = ' rgba(120, 120, 193, 0.355)';
        slot.style.marginBottom = '20px';
        slot.style.marginTop = '10px';
        // slot.classList.add('drop');
        slot.addEventListener('dragover', (event) => {
          event.preventDefault();
        });
        // slot.addEventListener('drop', (event)=>{
        //   event.preventDefault();
        //   const cardId = event.dataTransfer!.getData('text/plain'); //принимаем данные id перетаскиваемой карточки
        //   console.log(cardId)
        //   console.log(event.target as HTMLElement)
        // })
        // el?.insertAdjacentElement('afterend', slot);
        if (isAboveHalf) {
          slot.classList.add('drop-top');
          el?.insertAdjacentElement('beforebegin', slot);
          this.newPositionForCard = this.card!.position;
          // console.log('ПЕРЕМЕСТИЛАСЬ СВЕРХУ ОТ КАРОТОЧКИ');
        } else {
          slot.classList.add('drop-bottom');
          el?.insertAdjacentElement('afterend', slot);
          this.newPositionForCard = this.card!.position + 1;
          // console.log('ПЕРЕМЕСТИЛАСЬ СНИЗУ ОТ КАРТОЧКИ');
        }
      }
    }
    if (el === list_element) {
      console.log('11111111111111111111111'); 
    }
  }

  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const cardContainer = target.closest('.container__body-card');
    // console.log(cardContainer);
    const containerCoordinate = cardContainer!.getBoundingClientRect();

    if (
      event.clientX < containerCoordinate.left ||
      event.clientX > containerCoordinate.right ||
      event.clientY < containerCoordinate.top ||
      event.clientY > containerCoordinate.bottom - 5
    ) {
      const slots = cardContainer!.querySelectorAll('.drop-top, .drop-bottom');
      slots.forEach((slot: any) => slot.remove());
    }
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  public onDragDrop(event: DragEvent) {
    event.preventDefault();
    /* ID of the Board */
    const idBoard = Number(this.activatedRoute.snapshot.params['id']);

    /* ID of the dragging card and  list */
    const dataDrag = JSON.parse(event.dataTransfer!.getData('application/json'));
    const idCard = dataDrag.idCard;
    const idList = dataDrag.idList;
    const oldPos = dataDrag.position;

    console.log(
      'Новая позиция для перетаскиваемой карточки в новом списке: ' + this.newPositionForCard,
    );

    // /* Send the PUT-request for editing card */

    this.cardsService
      .editCard([{ id: idCard, position: this.newPositionForCard, list_id: this.idList }], idBoard)
      .subscribe((response) => {
        this.isDraggedCard = true;
        console.log(response);
        this.cardDragged.emit(this.newPositionForCard); //update the view of the list
        // this.cardDragged2.emit(dataDrag); //update the view of the list
      });

    /* Delete Drop-Zone */
    const dropZone = (event.target as HTMLElement).parentElement?.querySelector('.drop');
    dropZone?.remove();
  }

  // NEWWW
}
