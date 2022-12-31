import styled from "styled-components";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { IPanelState, ITodo, toDoState } from "./atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Board from "./Components/Board";
import Garbage from "./Components/DeleteBoard";
import { useForm } from "react-hook-form";

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
  const { register, handleSubmit } = useForm<IForm>();
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
    const { destination, source, type } = info;
    console.log(info);
    if (!destination) return;
    if (type === "CARD" && destination?.droppableId === source.droppableId) {
      //same board movement
      setToDos((allBoards) => {
        console.log({ ...allBoards });
        console.log(type);
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
    if (type === "CARD" && destination.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        console.log(taskObj);
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
    if (destination.droppableId === "Remove") {
      setToDos((allBoards) => {
        //console.log(allBoards);
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
        console.log(boardList);
        const taskObj = boardList[source.index];
        boardList.splice(source.index, 1);
        boardList.splice(destination?.index, 0, taskObj);
        console.log(boardList, allBoards);
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
              pattern="[a-z0-9]+"
              {...register("addToDo", {
                required: true,
              })}
              placeholder={`New Board add here`}
            />
          </form>
        </AddForm>
        <BtnWrapper>
          <Garbage boardId={"Remove"} />
          {/* <StyleBtn>ADD</StyleBtn> */}
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
