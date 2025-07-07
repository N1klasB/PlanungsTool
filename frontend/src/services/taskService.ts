import { Task } from "../models/task";

export const deleteTask = (tasks: Task[], taskId: string): Task[] => {
  return tasks.filter((task) => task.taskId !== taskId);
};

export const toggleTaskCompletion = (tasks: Task[], taskId: string): Task[] => {
  return tasks.map((task) =>            // Refactoring Lösung finden (ist map so sinnvoll)
    task.taskId === taskId
      ? { ...task, taskStatus: !task.taskStatus }
      : task
  );
};
