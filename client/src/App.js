import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  const API = "http://localhost:5000/tasks";

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;
    const res = await axios.post(API, { text });
    setTasks([...tasks, res.data]);
    setText("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  const toggleTask = async (task) => {
    const res = await axios.put(`${API}/${task._id}`, {
      completed: !task.completed
    });
    setTasks(tasks.map(t => t._id === task._id ? res.data : t));
  };

  return (
    <div className="container">
      <h1>📝 To-Do App</h1>

      <div className="inputBox">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="taskList">
        {tasks.map(task => (
          <li key={task._id} className="taskItem">
            <span
              onClick={() => toggleTask(task)}
              className={task.completed ? "done" : ""}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task._id)}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;