export interface IBoard {
  id: number;
  title: string;
  lists: {
    id: number;
    title: string;
    position: number;
    cards: {
      id: number;
      title: string;
      position: number;
    }[];
  }[];
}
