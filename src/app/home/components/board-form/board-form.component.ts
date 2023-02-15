import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'tr-board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardFormComponent implements OnInit {
  constructor(private boardService: BoardsService) {}
  apiUrl = environment.baseURL;
  boardUrl = this.apiUrl + '/board';
  ngOnInit() {}

  boardForm = new FormGroup({
    boardName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern(/^[а-яa-zА-ЯA-Z0-9_-\s\.]*$/),
    ]),
  });

  get boardName() {
    return this.boardForm.get('boardName');
  }

  onSubmit() {
    let boardValue = this.boardName?.value;
    if (boardValue != undefined && boardValue != null) {
      //тут эта проверка тк ругается тс
      this.boardService.createBoard(boardValue).subscribe(() => {
        console.log("success");
       
      });
    }
  }

  // createBoard(boardValue: string) {
  //   return this.httpClient
  //     .post(this.boardUrl, { title: boardValue }, { headers: { Authorization: 'Bearer 123' } })
  //     .subscribe();
  // }
}
