import { ChangeDetectionStrategy, Input, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBoard } from 'src/app/core/interfaces/iboard.interface';

@Component({
  selector: 'tr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit {
  boards: IBoard[] = [];
  showModal = false;
  

  constructor(
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initBoards();
  }

  private initBoards(): void {
    this.activatedRoute.data.subscribe(({ boards }) => {
      this.boards = boards;
    })
  }

}

// export class HomeComponent {
//   boards: IBoard[] = [
//     {id: 1, title: "покупки"},
//     {id: 2, title: "подготовка к свадьбе"},
//     {id: 3, title: "разработка интернет-магазина"},
//     {id: 4, title: "курс по продвижению в соцсетях"},
//     {id: 5, title: "курс по продвижению в соцсетях"},
//     {id: 6, title: "курс по продвижению в соцсетях"},
//     {id: 7, title: "курс по продвижению в соцсетях"}
//   ];
// }