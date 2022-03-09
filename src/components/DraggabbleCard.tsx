import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { BsFillTrashFill } from "react-icons/bs";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0,0,0,0.05)" : "none"};
`;

const Trash = styled(BsFillTrashFill)`
  color: gray;
  float: right;
`;

interface IDraggabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

function DraggabbleCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggabbleCardProps) {
  const setToDos = useSetRecoilState(toDoState);

  const onClick = () => {
    setToDos((allBoards) => {
      const copyBoard = [...allBoards[boardId]];
      copyBoard.splice(index, 1);
      const newToDoData = {
        ...allBoards,
        [boardId]: copyBoard,
      };
      window.localStorage.setItem("toDos", JSON.stringify(newToDoData));
      return newToDoData;
    });
  };

  return (
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {toDoText}
          <Trash onClick={onClick} size={12} />
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggabbleCard);
