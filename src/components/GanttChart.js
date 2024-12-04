import React, { useState } from "react";
import NewTaskModal from "./NewTaskModal";
import "./GanttChart.css";

const GanttChart = ({ user }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Create User Stories",
      start: "2024-11-01",
      end: "2024-11-10",
      progress: 50,
      color: "#FF5733",
      subTasks: [],
    },
    {
      id: 2,
      name: "Create Wireframes",
      start: "2024-11-08",
      end: "2024-11-22",
      progress: 30,
      color: "#33B5FF",
      subTasks: [],
    },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100); // Default zoom level


  const minDate = new Date("2024-11-01");
  const maxDate = new Date("2024-11-30");

  const getDaysArray = (start, end) => {
    let dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const timelineDays = getDaysArray(minDate, maxDate);

  const handleAddTask = (parentId = null) => {
    setCurrentParentId(parentId);
    setModalOpen(true);
  };

  const handleSaveTask = (newTask) => {
    if (currentParentId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentParentId
            ? { ...task, subTasks: [...task.subTasks, { ...newTask, id: Date.now() }] }
            : task
        )
      );
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now(), subTasks: [] }]);
    }
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const calculateBarStyle = (startDate, endDate, progress) => {

    const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24) + 1;


    const taskStartDate = new Date(startDate);
    const taskEndDate = new Date(endDate);

    const leftOffset =
      ((taskStartDate - minDate) / (1000 * 60 * 60 * 24)) * (100 / totalDays);

    // Calculate the width of the task bar based on the task duration
    const taskDuration = (taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24) + 1;
    const totalWidth = (taskDuration / totalDays) * 100;


    const progressWidth = (totalWidth * progress) / 100;

    return { leftOffset, totalWidth, progressWidth };
  };

  const handleDeleteTask = (taskId, parentId = null) => {
    if (parentId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === parentId
            ? { ...task, subTasks: task.subTasks.filter((sub) => sub.id !== taskId) }
            : task
        )
      );
    } else {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }
  };

  const handleZoom = (type) => {
    setZoomLevel((prevZoom) => {
      const newZoom = type === "in" ? prevZoom + 20 : prevZoom - 20;
      return Math.min(Math.max(newZoom, 50), 200);
    });
  };


  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileContent = await file.text();
        const importedTasks = JSON.parse(fileContent);

        // Validate the imported data
        if (Array.isArray(importedTasks)) {
          setTasks(importedTasks);
          alert("Tasks imported successfully!");
        } else {
          throw new Error("Invalid file format!");
        }
      } catch (error) {
        alert("Error importing tasks: " + error.message);
      }
    }
  };


  const handleExport = () => {

    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.json";
    link.click();
  };

  return (
    <div className="gantt-container">
      <div className="gantt-header">
        <div className="header-left">
          <button className="btn" onClick={() => handleAddTask()}>
            + Add Task
          </button>
          <label className="btn">
            Import
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={handleImport}
            />
          </label>

          <button className="btn" onClick={handleExport}>
            Export
          </button>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="header-right">
          <div className="zoom-controls">
            <button
              className="btn"
              onClick={() => handleZoom("in")}
              disabled={zoomLevel >= 150} // Disable if zoom is at max level
            >
              Zoom In
            </button>
            <button
              className="btn"
              onClick={() => handleZoom("out")}
              disabled={zoomLevel <= 70} // Disable if zoom is at min level
            >
              Zoom Out
            </button>
          </div>


          <h3>Welcome, {user.name}</h3>
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="user-avatar" />
          ) : (
            <div className="placeholder-avatar">No Image</div>
          )}
        </div>
      </div>

      <div className="gantt-main">
        <div className="task-sidebar">
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id}>
                <div className="task-heading">
                  <strong>{task.name}</strong>
                  <button onClick={() => handleAddTask(task.id)}>+</button>
                  <button onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                </div>
                {task.subTasks.length > 0 && (
                  <ul className="subtasks-list">
                    {task.subTasks.map((subTask) => (
                      <li key={subTask.id} className="subtask-item">
                        {subTask.name}
                        <button onClick={() => handleDeleteTask(subTask.id, task.id)}>
                          🗑️
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>


        <div className="timeline" style={{ transform: `scale(${zoomLevel / 100})` }}>
          <div className="date-row">
            {timelineDays.map((day, index) => (
              <div key={index} className="date">
                {day.getDate()}
              </div>
            ))}
          </div>

          <div className="task-bars">
            {filteredTasks.map((task, taskIndex) => {
              const { leftOffset, totalWidth, progressWidth } = calculateBarStyle(
                task.start,
                task.end,
                task.progress
              );
              return (
                <React.Fragment key={task.id}>
                  <div
                    className="task-bar"
                    style={{
                      left: `${leftOffset}%`,
                      width: `${totalWidth}%`,
                      top: `${taskIndex * 50}px`,
                      backgroundColor: "#e0e0e0",
                    }}
                  >
                    <div
                      className="task-progress"
                      style={{
                        width: `${(progressWidth / totalWidth) * 100}%`,
                        backgroundColor: task.color,
                      }}
                    />
                    <div className="task-name">{task.name}</div>
                  </div>

                  {task.subTasks.map((subTask, subTaskIndex) => {
                    const { leftOffset, totalWidth, progressWidth } = calculateBarStyle(
                      subTask.start,
                      subTask.end,
                      subTask.progress
                    );
                    return (
                      <div
                        key={subTask.id}
                        className="task-bar subtask-bar"
                        style={{
                          left: `${leftOffset}%`,
                          width: `${totalWidth}%`,
                          top: `${(taskIndex * 50) + (subTaskIndex + 1) * 30}px`,
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <div
                          className="task-progress"
                          style={{
                            width: `${progressWidth}%`,
                            backgroundColor: subTask.color || "#b3b3b3",
                          }}
                        />
                        <div className="task-name">{subTask.name}</div>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleSaveTask}
        task={null}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
};

export default GanttChart;
