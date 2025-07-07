export interface Task {
  taskId: string;
  title: string;
  taskStatus: boolean;
  deadline: string;
  description?: string;
  priority: number;
  estimatedEffort?: number;
  projectId?: string;
  dependencies?: string[];
  creationDate: string;
  lastModified: string;
  attachments?: string[];
  progress?: number;
  recurrence?: string;
  reminder?: string;
  subtasks?: string[];
}