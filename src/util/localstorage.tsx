import { IToDoState, toDoState } from "../atoms";

export const setLocalStorage = (toDos: IToDoState) => {
  return localStorage.setItem("toDos", JSON.stringify({ toDos }));
};

export const getLocalStorage = (toDos: string) => {
  const localToDos = localStorage.getItem(toDos);
  if (localToDos) {
    return JSON.parse(localToDos);
  }
};
