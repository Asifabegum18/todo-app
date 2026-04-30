import { useState } from "react";
import "./App.css";
import Login from "./Login";
function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  const addTask = () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setText("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

const token = localStorage.getItem("token");

if (!token) {
  return <Login />;
}
  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <div className="container">
      <h1>📝 To-Do App</h1>

      <div className="inputBox">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="taskList">
        {tasks.map(task => (
          <li key={task.id} className="taskItem">
            <span
              onClick={() => toggleTask(task.id)}
              className={task.completed ? "done" : ""}
            >
              {task.text}
            </span>

            <button onClick={() => deleteTask(task.id)}>
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;