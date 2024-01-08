import { atom, selector } from "recoil";

export interface IToDo {
  id: number;
  text: string;
}
interface IToDoState {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "해야할 일": [],
    "하는 중": [],
    완료: [],
  },
});
export const boardState = atom<IToDoState>({
  key: "toDo",
  default: {
    "해야할 일": [],
    "하는 중": [],
    완료: [],
  },
});
