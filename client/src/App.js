import React, { useEffect, useState } from "react";

const App = () => {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // useEffect hook to fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []); 
 
  const handleChange = (e) => {
    setTaskInput(e.target.value);
  };

  const clearTodoList = (e) => {
    e.preventDefault();
    setTasks([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { taskName: taskInput, complete: false };
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to send tasks to server");
      }
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskInput("");
      console.log(newTask);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsComplete = async (taskToComplete) => {
    const updatedTasks = tasks.map((task) => {
      if (taskToComplete === task) {
        return { ...task, complete: true };
      }
      return task;
    });
    try {
      const response = await fetch("/api/tasks/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskToComplete),
      });

      if (!response.ok) {
        throw new Error("Failed to update task on server");
      }
    } catch (error) {
      console.error(error);
    }
    setTasks(updatedTasks);
  };

  const completedTasks = tasks.filter((task) => task.complete === true);

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <h1 className="py-2 text-center font-semibold text-3xl">TODO LIST</h1>
        <form
          onSubmit={handleSubmit}
          className="text-center space-x-2 p-2 mb-2"
        >
          <input
            type="text"
            name="taskInputField"
            value={taskInput}
            onChange={handleChange}
            placeholder="Enter a task..."
            className="px-2 py-1 border rounded-sm focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={!taskInput}
            className={
              !taskInput
                ? "bg-neutral-500 px-2 py-1 hover:cursor-not-allowed rounded text-white"
                : "rounded bg-blue-500 transition hover:bg-blue-400 text-white px-2 py-1"
            }
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={clearTodoList}
            className={
              !taskInput && tasks.length === 0
                ? "bg-neutral-500 px-2 py-1 hover:cursor-not-allowed rounded text-white"
                : "bg-red-500 transition text-white px-2 py-1"
            }
          >
            Clear todo list
          </button>
        </form>
      </div>
      <div className="text-center">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex space-x-2 space-y-2 justify-center items-center"
          >
            <p className={task.complete?'line-through':'mt-3'}>{task.taskName}</p>
            <button
              type="button"
              className={task.complete?"hidden":"bg-green-500 text-white py-1 px-2 rounded-lg font-semibold"}
              title="mark as complete"
              onClick={() => markAsComplete(task)}
            >
              Complete
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto text-center">
        {completedTasks.length > 0 ? (
          <h1 className="text-2xl mt-2">Completed tasks</h1>
        ) : (
          ""
        )}
        {completedTasks.map((task, index) => (
          <div key={index}>{task.taskName}</div>
        ))}
      </div>
    </>
  );
};

export default App;
