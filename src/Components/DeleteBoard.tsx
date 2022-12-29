import { Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { DeleteAreaState } from "../atoms";

const Wrapper = styled.div`
  display: flex;
  margin: 0 0 10px 0;
  width: 920px;
  height: 80px;
  background-color: #333030;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  span {
    color: white;
    position: fixed;
  }
`;

const Garbage = () => {
  const garbagecan = useRecoilValue(DeleteAreaState);
  return (
    <Droppable droppableId="garbagecan">
      {(provided) => (
        <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
          {garbagecan && <span>delete</span>}
          {provided.placeholder}
          <span>Drag items here to delete</span>
        </Wrapper>
      )}
    </Droppable>
  );
};

export default Garbage;
