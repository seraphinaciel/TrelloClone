import { useForm } from "react-hook-form";
import styled from "styled-components";

export const CForm = styled.form`
  text-align: center;
  input {
    padding: 10px 20px;
    border: 0;
    border-radius: 4px;
    background-color: ${(props) => props.theme.input};
    color: white;
  }
`;
const Form = styled(CForm)`
  padding: 1rem;
  background-color: ${(props) => props.theme.inputBg};
`;

interface IForm {
  toDo: string;
}

function CreateBoard() {
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };
    // setToDos((allBoards) => {
    //   return {
    //     ...allBoards,
    //     [boardId]: [...allBoards[boardId], newTodo],
    //   };
    // });
    setValue("toDo", "");
  };

  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("toDo", { required: true })}
        placeholder={`새 보드 추가`}
        type="text"
      />
    </Form>
  );
}
export default CreateBoard;
