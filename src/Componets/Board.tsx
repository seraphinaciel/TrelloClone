import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.article`
  min-height: 300px;
  padding: 20px 10px;
  background-color: ${(props) => props.theme.board};
  border-radius: 5px;
  h1 {
    text-align: center;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 18px;
  }
`;

interface IBoardProps {
  toDos: string[];
  boardId: string;
}
function Board({ toDos, boardId }: IBoardProps) {
  return (
    <Wrapper>
      <h1>{boardId}</h1>
      <Droppable droppableId={boardId}>
        {(magic) => (
          <p ref={magic.innerRef} {...magic.droppableProps}>
            {toDos.map((toDo, index) => (
              <DraggableCard key={toDo} toDo={toDo} index={index} />
            ))}
            {magic.placeholder}
          </p>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
