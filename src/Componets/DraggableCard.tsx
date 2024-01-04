import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isDragging ? "tomato" : props.theme.card};
  box-shadow: ${(props) =>
    props.isDragging ? "0 2px 5px rgab(0,0,0,0.5)" : "none"};
`;

interface IDragabbleCardProps {
  toDo: string;
  index: number;
}

function DraggableCard({ toDo, index }: IDragabbleCardProps) {
  console.log(toDo, "has been rendered");
  return (
    <Draggable key={toDo} draggableId={toDo} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDo}
        </Card>
      )}
    </Draggable>
  );
}
export default React.memo(DraggableCard);
