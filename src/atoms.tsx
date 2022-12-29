import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: ITodo[];
}
export interface ILocalStorage {
  "To Do": [];
  Doing: [];
  Done: [];
}

export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: /* getLocalStorage() ?? */ {
    "To Do": [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});
