import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tr-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalWindowComponent {
  @Input() showModal: boolean = true;
  // boardName:string="";
  onSubmit() {
    // validateDate();
    // createBoard();
  }
}
