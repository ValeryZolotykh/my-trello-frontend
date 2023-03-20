import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tr-simple-input-form',
  templateUrl: './simple-input-form.component.html',
  styleUrls: ['./simple-input-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleInputFormComponent implements OnInit {
  constructor(private notification: ToastrService) {}

  @Input() previousValue = '';

  @Output() lostFocus: EventEmitter<void> = new EventEmitter<void>();

  @Output() enter: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Create validators for input values: min of length(2 char), max of length(30 char),
   * acceptable symbols(letters, digital and few chars(spaces, dashes, dots, underscores)
   * and unacceptable empty value.
   */
  valueControl = new FormControl(this.previousValue, [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern(/^[а-яa-zА-ЯA-Z0-9_\s.-]*$/),
  ]);

  ngOnInit(): void {
    this.valueControl.setValue(this.previousValue);
  }

  /**
   * Getting final correct value from input.
   * Showing error notification about error, if unput is invalid.
   * @returns final correct value from input.
   */
  public getValue(): string {
    if (!this.valueControl.invalid) {
      return this.valueControl.value || '';
    } else {
      this.notification.warning('В названии допущена ошибка');
      return this.previousValue;
    }
  }

  /**
   * This method emits an 'blur' event for input.
   */
  public onBlur(): void {
    this.lostFocus.emit();
  }

  /**
   * This method emits an 'enter' key-event for input.
   */
  public onEnter(): void {
    this.lostFocus.emit();
  }
}
