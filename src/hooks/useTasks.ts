import { useState, useEffect } from 'react';
import { Task, TaskFormData, SubTask } from '@/types/task';

// Simple in-memory storage for MVP - can be replaced with Supabase later
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        // Convert date strings back to Date objects
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          subtasks: task.subtasks.map((st: any) => ({
            ...st,
            createdAt: new Date(st.createdAt)
          }))
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const createTask = (formData: TaskFormData): Task => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      completed: false,
      dueDate: formData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: []
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  const addSubtask = (taskId: string, title: string) => {
    const newSubtask: SubTask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: [...task.subtasks, newSubtask],
            updatedAt: new Date()
          }
        : task
    ));
  };

  const toggleSubtaskComplete = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(st => 
              st.id === subtaskId 
                ? { ...st, completed: !st.completed }
                : st
            ),
            updatedAt: new Date()
          }
        : task
    ));
  };

  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  };

  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const urgentTasks = tasks.filter(t => 
      !t.completed && (
        t.priority === 'high' || 
        (t.dueDate && new Date(t.dueDate) < new Date())
      )
    ).length;

    return {
      total: totalTasks,
      active: activeTasks,
      completed: completedTasks,
      urgent: urgentTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    toggleSubtaskComplete,
    getTaskById,
    getTaskStats
  };
}