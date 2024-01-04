import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.article`
  min-height: 300px;
  padding: 10px 0;
  background-color: ${(props) => props.theme.board};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  h1 {
    text-align: center;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 18px;
  }
`;
const Area = styled.p<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
interface IBoardProps {
  toDos: string[];
  boardId: string;
}
function Board({ toDos, boardId }: IBoardProps) {
  return (
    <Wrapper>
      <h1>{boardId}</h1>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard key={toDo} toDo={toDo} index={index} />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
