import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICard } from 'src/app/core/interfaces/icard.interface';

@Component({
  selector: 'tr-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  @Input() titleList: string = '';
  @Input() cardsList: ICard[] = [];
}
