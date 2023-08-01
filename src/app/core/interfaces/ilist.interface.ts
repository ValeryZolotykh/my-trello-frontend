export interface IList {
  id: number;
  title: string;
  position: number;
  cards: {
    id: number;
    title: string;
    position: number;
  }[];
}
