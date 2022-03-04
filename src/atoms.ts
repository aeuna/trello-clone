import { atom, selector } from "recoil";

export const minuteState = atom({
  // state는 오직 minutes만 있는데 selector를 사용해서 hours state까지 커버가능
  key: "minutes",
  default: 0,
});

export const hourSelector = selector<number>({
  key: "hours",
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
  set: ({ set }, newValue) => {
    const minutes = Number(newValue) * 60;
    set(minuteState, minutes);
  },
});
