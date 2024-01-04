import { atom, selector } from "recoil";

interface IToDoState {
  [key: string]: string[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "해야할 일": ["a", "b"],
    "하는 중": ["c", "d"],
    완료: ["e", "f"],
  },
});

// export const categoryState = atom<Categories>({
//   key: "category",
//   default: Categories.TO_DO,
// });

// export const toDoSelector = selector({
//   key: "toDoSelector",
//   get: ({ get }) => {
//     const toDos = get(toDoState);

//     const category = get(categoryState);
//     if (category === Categories.OTHER) {
//       return toDos.filter(
//         (todo) =>
//           todo.category !== Categories.TO_DO &&
//           todo.category !== Categories.DOING &&
//           todo.category !== Categories.DONE
//       );
//     }
//     return toDos.filter((toDo) => toDo.category === category);
//   },
// });
