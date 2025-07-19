import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { PlusIcon, CheckIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask: () => void;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onToggleSubtask,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  onCreateTask
}: TaskListProps) {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const urgentTasks = activeTasks.filter(task => 
    task.priority === 'high' || 
    (task.dueDate && new Date(task.dueDate) < new Date())
  );

  const todayTasks = activeTasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === today.toDateString();
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-scale-in">
          <CheckIcon className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Ready to get productive?</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create your first task and start organizing your day. You can use natural language like "Call John tomorrow" or "Urgent: Review proposal".
        </p>
        <Button onClick={onCreateTask} size="lg" className="animate-fade-in shadow-hover">
          <PlusIcon className="mr-2 h-5 w-5" />
          Create Your First Task
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-card p-4 rounded-lg border border-border/60 shadow-card">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold text-primary">{activeTasks.length}</p>
        </div>
        
        <div className="bg-gradient-card p-4 rounded-lg border border-border/60 shadow-card">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <p className="text-2xl font-bold text-success">{completedTasks.length}</p>
        </div>
        
        <div className="bg-gradient-card p-4 rounded-lg border border-border/60 shadow-card">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">Due Today</span>
          </div>
          <p className="text-2xl font-bold text-warning">{todayTasks.length}</p>
        </div>
        
        <div className="bg-gradient-card p-4 rounded-lg border border-border/60 shadow-card">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Urgent</span>
          </div>
          <p className="text-2xl font-bold text-destructive">{urgentTasks.length}</p>
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <Button onClick={onCreateTask} className="shadow-hover">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Urgent Tasks Section */}
      {urgentTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="animate-fade-in">
              <AlertCircleIcon className="mr-1 h-3 w-3" />
              Urgent
            </Badge>
            <span className="text-sm text-muted-foreground">
              {urgentTasks.length} task{urgentTasks.length !== 1 ? 's' : ''} need immediate attention
            </span>
          </div>
          <div className="grid gap-3">
            {urgentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onToggleSubtask={onToggleSubtask}
                onAddSubtask={onAddSubtask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Tasks Section */}
      {activeTasks.filter(task => !urgentTasks.includes(task)).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <ClockIcon className="mr-1 h-3 w-3" />
              Active Tasks
            </Badge>
          </div>
          <div className="grid gap-3">
            {activeTasks
              .filter(task => !urgentTasks.includes(task))
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onToggleSubtask={onToggleSubtask}
                  onAddSubtask={onAddSubtask}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <CheckIcon className="mr-1 h-3 w-3" />
              Completed ({completedTasks.length})
            </Badge>
          </div>
          <div className="grid gap-3">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onToggleSubtask={onToggleSubtask}
                onAddSubtask={onAddSubtask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}