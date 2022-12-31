import styled from "styled-components";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { IPanelState, ITodo, PanelState, toDoState } from "./atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Board from "./Components/Board";
import Garbage from "./Components/DeleteBoard";
import { useForm } from "react-hook-form";
import { useState } from "react";
import BackPanel from "./Components/BackPanel";

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

const AddForm = styled.div`
  margin-bottom: 10px;
  display: flex;
  width: 920px;
  justify-content: flex-start;
  align-items: center;
`;
interface IProps {
  panelsId: string;
  index: number;
}
interface IForm {
  addToDo: string;
}
/* const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    }; */
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [panels, SetPanels] = useRecoilState(PanelState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ addToDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: addToDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [addToDo]: [],
      };
    });
  };
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
    if (source.droppableId === "Boards") {
      setToDos((allBoards) => {
        const boardList = Object.keys(allBoards);
        const taskObj = boardList[source.index];
        boardList.splice(source.index, 1);
        boardList.splice(destination.index, 0, taskObj);
        /* console.log({ ...allBoards }); */
        let boards = {};
        boardList.map((board) => {
          boards = { ...boards, [board]: allBoards[board] };
        });
        return {
          ...boards,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <AddForm>
          <form onSubmit={handleSubmit(onValid)}>
            <input
              type="text"
              {...register("addToDo", {
                required: true,
              })}
              placeholder={`New Board add here`}
            />
          </form>
        </AddForm>
        <BtnWrapper>
          <Garbage />
          <StyleBtn>ADD</StyleBtn>
        </BtnWrapper>
        <Droppable droppableId="Boards" direction="horizontal" type="BOARD">
          {(provided, snapshot) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Boards>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
