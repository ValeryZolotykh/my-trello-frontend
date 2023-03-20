import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  @Input() idCard = 0;

  @Output() cardDeleted = new EventEmitter();

  /**
   * Deleting of the card and updating the board page.
   */
  public deleteCard(): void {
    const idBoard = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.cardsService.deleteCard(idBoard, this.idCard).subscribe(() => {
      this.cardDeleted.emit(this.idCard); //send event to parent-component(listComponent) to update view of the list after response from the API about successful deleting card
    });
  }
}
