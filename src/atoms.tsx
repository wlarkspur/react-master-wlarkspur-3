import { atom, selector } from "recoil";
import { getLocalStorage } from "./util/localstorage";

export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: getLocalStorage() ?? {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});
