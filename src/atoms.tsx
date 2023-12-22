import { atom, selector } from "recoil";

export const minuteState = atom({
  key: "minutes",
  default: 0,
});

export const hourSelector = selector({
  key: "hours",
  get: ({ get }) => {
    const minutes = get(minuteState);
    // selector안에서 atom에 접근하고 싶다면 get(atom의 값을 가져옴) 사용
    return minutes / 60; // hourSelector의 value
  },
});
