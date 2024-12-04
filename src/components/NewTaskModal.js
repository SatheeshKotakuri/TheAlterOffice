import React, { useState, useEffect } from "react";
import "./NewTaskModal.css";

const NewTaskModal = ({ isOpen, onClose, onAdd, task, minDate, maxDate }) => {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState("#FF5733");
  const [errors, setErrors] = useState({}); // To track errors

  useEffect(() => {
    if (task) {
      setName(task.name || "");
      setStart(task.start || "");
      setEnd(task.end || "");
      setProgress(task.progress || 0);
      setColor(task.color || "#FF5733");
    }
  }, [task]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "Task name is required.";
    if (!start) errors.start = "Start date is required.";
    if (!end) errors.end = "End date is required.";
    if (new Date(start) > new Date(end)) errors.dateRange = "Start date must be before end date.";
    if (progress < 0 || progress > 100) errors.progress = "Progress must be between 0 and 100.";
    return errors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onAdd({ name, start, end, progress, color });
    setName("");
    setStart("");
    setEnd("");
    setProgress(0);
    setColor("#FF5733");
    setErrors({});
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{task ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Task Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </label>
          <label>
            Start Date:
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              min={minDate.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
              className={errors.start ? "error" : ""}
            />
            {errors.start && <span className="error-text">{errors.start}</span>}
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              min={start || minDate.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
              className={errors.end ? "error" : ""}
            />
            {errors.end && <span className="error-text">{errors.end}</span>}
          </label>
          {errors.dateRange && <span className="error-text">{errors.dateRange}</span>}
          <label>
            Progress (%):
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              min="0"
              max="100"
              className={errors.progress ? "error" : ""}
            />
            {errors.progress && <span className="error-text">{errors.progress}</span>}
          </label>
          <label>
            Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={handleSubmit}>
              Save
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default NewTaskModal;
