import styled from "styled-components";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { IPanelState, panelState, toDoState } from "./atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Board from "./Components/Board";
import Garbage from "./Components/DeleteBoard";
import { useForm } from "react-hook-form";
import { useState } from "react";

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const BtnWrapper = styled.div`
  display: flex;
`;

const Boards = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

const StyleBtn = styled.button`
  display: flex;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: yellowgreen;
  border-radius: 15px;
  margin-left: 5px;
  justify-content: center;
  font-weight: 700;
`;

interface AddCategoryForm {
  category: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    console.log(info);
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      //same board movement
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (
      destination.droppableId !== source.droppableId &&
      destination.droppableId !== "garbagecan"
    ) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
    if (destination.droppableId === "garbagecan") {
      setToDos((allBoards) => {
        console.log(allBoards);
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <form>
          <input type="text" />
        </form>
        <BtnWrapper>
          <Garbage />
          <StyleBtn>ADD</StyleBtn>
        </BtnWrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
