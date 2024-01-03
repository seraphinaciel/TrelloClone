import { atom, selector } from "recoil";

export const toDoState = atom({
  key: "toDo",
  default: ["a", "b", "c", "d", "e", "f"],
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
