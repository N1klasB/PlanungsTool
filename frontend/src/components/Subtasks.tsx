import React from "react";
import { Subtask } from "../models/subtask";

interface SubtasksProps {
  subtasks: Subtask[];
  toggleSubtask: (subtaskId: string) => void;
  onClose: () => void;
}

const Subtasks: React.FC<SubtasksProps> = ({
  subtasks,
  toggleSubtask,
  onClose,
}) => {
  const completedCount = subtasks.filter((st) => st.subtaskStatus).length;
  const total = subtasks.length;
  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <h3>Subtasks ({percentage}% erledigt)</h3>
        <ul className="subtask-list">
          {subtasks.map((st) => (
            <li key={st.subtaskId}>
              <label>
                <input
                  type="checkbox"
                  checked={st.subtaskStatus}
                  onChange={() => toggleSubtask(st.subtaskId)}
                />
                {st.subtaskTitle}
              </label>
            </li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Subtasks;
