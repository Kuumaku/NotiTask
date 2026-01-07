import InputTodo from "./InputTodo";
import ListTodo from "./ListTodos";
import { useParams } from "react-router-dom";

function MainPage() {
  const { userId } = useParams(); // 👈 Get userId from URL

  return (
    <div>
      <InputTodo userId={userId} />
      <ListTodo userId={userId} />
    </div>
  );
}

export default MainPage;
