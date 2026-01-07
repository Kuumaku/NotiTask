import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <-- add this import!

function ListTodo({ userId }) {
    const [todos, setTodos] = useState([]);
    const [status, setStatus] = useState(false);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };
    


    const ChangeStatus = async (id) => {
        try {
          const response = await fetch(`http://localhost:5050/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: !todos.find(todo => todo.project_id === id).status }) // Toggle the status
          });
      
          if (response.ok) {
            await getTodos(); // Refresh the list after updating
          }
        } catch (error) {
          console.error("Error changing status:", error.message);
        }
      };
    
    

    const delTodo = async (id) => {
        try {
            const deleteTodo = await fetch(`http://localhost:5050/todos/${id}`, {
                method: "DELETE"
            });

            setTodos(todos.filter(todo => todo.project_id !== id));
            console.log("Deleted Todo");

        } catch (error) {
            console.log(error.message);
        }
    };

    const getTodos = async () => {
        try {
          const response = await fetch(`http://localhost:5050/todos?user_id=${userId}`);
          const jsonData = await response.json();
          setTodos(jsonData);
        } catch (error) {
          console.log(error.message);
        }
      };

      useEffect(() => {
        if (userId) getTodos();
      }, [userId]);
      
    return (
      <div className="task-list">
      <ol className="todo-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.project_id}>
            <span className="text">{todo.project_name}</span><br />
            <span>Start Date</span><br />
            <span>{formatDate(todo.start_date)}</span><br />
            <span>Due Date</span><br />
            <span>{formatDate(todo.due_date)}</span><br />
  
            <div className="button-group">
              <button 
                className="status-btn"
                onClick={() => ChangeStatus(todo.project_id)}
              >
                {todo.status ? "Complete" : "Incomplete"}
              </button>
              <Link to={`/edit/${todo.project_id}`}>
                <button className="Detail-btn">Detail</button>
              </Link>
              <button className="delete-btn" onClick={() => delTodo(todo.project_id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
    );
}

export default ListTodo;
