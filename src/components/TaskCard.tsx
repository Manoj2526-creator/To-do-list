import { useState } from 'react';
import { Task, Priority } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  CircleIcon,
  MoreHorizontalIcon,
  PlusIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-priority-low text-success border-success/20',
  medium: 'bg-priority-medium text-warning border-warning/20',
  high: 'bg-priority-high text-destructive border-destructive/20'
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export function TaskCard({ 
  task, 
  onToggleComplete, 
  onToggleSubtask, 
  onAddSubtask,
  onEditTask,
  onDeleteTask 
}: TaskCardProps) {
  const [showSubtasks, setShowSubtasks] = useState(task.subtasks.length > 0);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const progressPercentage = task.subtasks.length > 0 
    ? (completedSubtasks / task.subtasks.length) * 100 
    : 0;

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isDueSoon = task.dueDate && isPast(task.dueDate) && !task.completed;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onAddSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
    }
  };

  return (
    <Card className={cn(
      "group p-4 transition-all duration-300 hover:shadow-hover animate-fade-in",
      "bg-gradient-card border-border/60",
      task.completed && "opacity-60"
    )}>
      {/* Main Task Row */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 transition-colors hover:scale-105"
        >
          {task.completed ? (
            <CheckCircle2Icon className="h-5 w-5 text-success" />
          ) : (
            <CircleIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
          )}
        </button>

        <div className="flex-1 space-y-2">
          {/* Title and Priority */}
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "font-medium leading-none",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {priorityLabels[task.priority]}
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontalIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}

          {/* Due Date and Progress */}
          <div className="flex items-center justify-between text-xs">
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isDueSoon && "text-destructive"
              )}>
                <CalendarIcon className="h-3 w-3" />
                <span>{formatDueDate(task.dueDate)}</span>
                {isDueSoon && <ClockIcon className="h-3 w-3" />}
              </div>
            )}
            
            {task.subtasks.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-16 bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-muted-foreground">
                  {completedSubtasks}/{task.subtasks.length}
                </span>
              </div>
            )}
          </div>

          {/* Subtasks */}
          {(showSubtasks || task.subtasks.length > 0) && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 pl-2">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                    className="h-3 w-3"
                  />
                  <span className={cn(
                    "text-sm flex-1",
                    subtask.completed && "line-through text-muted-foreground"
                  )}>
                    {subtask.title}
                  </span>
                </div>
              ))}

              {/* Add Subtask */}
              {isAddingSubtask ? (
                <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pl-2">
                  <div className="h-3 w-3" />
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask..."
                    className="text-sm bg-transparent border-none outline-none flex-1 placeholder:text-muted-foreground"
                    autoFocus
                    onBlur={() => setIsAddingSubtask(false)}
                  />
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingSubtask(true)}
                  className="flex items-center gap-2 pl-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <PlusIcon className="h-3 w-3" />
                  <span>Add subtask</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}