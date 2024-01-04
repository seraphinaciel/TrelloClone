import { atom, selector } from "recoil";

// string을 object로 변경
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
