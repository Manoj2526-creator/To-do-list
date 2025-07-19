export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  subtasks: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
}