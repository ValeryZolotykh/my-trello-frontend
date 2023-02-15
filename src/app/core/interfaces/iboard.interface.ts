export interface IBoard{
    id: number;
    title: string;
}
export interface IBoard2{
    id: number;
    title: string;
    lists:{
        id:number;
        title:string;
        cards:{
            id:number;
            title:string;
        }[];
    }[];
}