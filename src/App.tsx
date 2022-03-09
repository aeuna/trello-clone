import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { toDoState } from "./atoms";
import Board from "./components/Board";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const Boards = styled.div`
  display: flex;
  height: 85%;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const Header = styled.div`
  width: 100%;
  height: 15%;
`;

const Form = styled.form`
  padding: 30px 10px;
  width: 15%;
  float: right;
  input {
    width: 100%;
  }
`;

interface IForm {
  category: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ category }: IForm) => {
    setToDos((allBoards) => {
      const newToDoData = { ...allBoards, [category]: [] };
      window.localStorage.setItem("toDos", JSON.stringify(newToDoData));
      return newToDoData;
    });
    setValue("category", "");
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId } = info;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        const newToDoData = { ...allBoards, [source.droppableId]: boardCopy };
        window.localStorage.setItem("toDos", JSON.stringify(newToDoData));
        return newToDoData;
      });
    }
    if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoardCopy = [...allBoards[source.droppableId]];
        const taskObj = sourceBoardCopy[source.index];
        sourceBoardCopy.splice(source.index, 1);
        const destBoardCopy = [...allBoards[destination.droppableId]];
        destBoardCopy.splice(destination.index, 0, taskObj);
        const newToDoData = {
          ...allBoards,
          [source.droppableId]: sourceBoardCopy,
          [destination.droppableId]: destBoardCopy,
        };
        window.localStorage.setItem("toDos", JSON.stringify(newToDoData));
        return newToDoData;
      });
    }
  };

  useEffect(() => {
    const localToDos = window.localStorage.getItem("toDos");
    if (localToDos) {
      setToDos(JSON.parse(localToDos));
    }
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Header>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("category", { required: true })}
              type="text"
              placeholder="Add Categories"
            />
          </Form>
        </Header>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} boardId={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
