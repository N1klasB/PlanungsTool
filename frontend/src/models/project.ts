import { Task } from "./task";

export interface Project {
    projectId: string;
    title: string;
    description?: string;
    tasks: Task[];
    startDate: string;
    endDate: string;
  }
  