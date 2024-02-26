import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { TypographyLead } from "./components/ui/TypographyLead";
import { TypographyH2 } from "./components/ui/TypographyH2";
import { Card, CardContent } from "./components/ui/card";

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
    // Container
    <div className="w-max space-y-3 mx-auto mt-5">
      {/* Heading and task input field */}
      <div>
        {/* Heading */}
        <TypographyH2>TODO LIST</TypographyH2>

        {/* Input field and button */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            name="taskInputField"
            value={taskInput}
            onChange={handleChange}
            placeholder="Enter a task..."
            required
            className="w-max"
          />

          <Button type="submit" disabled={!taskInput}>
            Add Task
          </Button>
          <Button
            type="button"
            onClick={clearTodoList}
            disabled={!taskInput && tasks.length === 0}
          >
            Clear todo list
          </Button>
        </form>
      </div>

      {/* Rendering area */}
      <div className=" space-y-5">
        {/* Tasks yet to be completed */}
        <Card className="w-full">
          <CardContent className="pt-6">
            <TypographyH2>Tasks todo</TypographyH2>
            {tasks.map((task, index) => (
              <div key={index} className="flex gap-2 space-y-3 items-center">
                <TypographyLead className={task.complete ? "line-through" : ""}>
                  {task.taskName}
                </TypographyLead>
                <Button
                  type="button"
                  className={task.complete ? "hidden" : ""}
                  title="mark as complete"
                  onClick={() => markAsComplete(task)}
                >
                  Complete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed tasks */}
        <Card className="w-full">
          <CardContent className="pt-6">
            {completedTasks.length > 0 ? (
              <TypographyH2>Completed tasks</TypographyH2>
            ) : (
              ""
            )}
            {completedTasks.map((task, index) => (
              <TypographyLead className="flex" key={index}>{task.taskName}</TypographyLead>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
