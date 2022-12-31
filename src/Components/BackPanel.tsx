import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const StyleBackPanel = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

function BackPanel() {
  return <StyleBackPanel></StyleBackPanel>;
}

export default BackPanel;
