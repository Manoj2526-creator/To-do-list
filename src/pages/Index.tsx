import { useState } from 'react';
import { Task } from '@/types/task';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2Icon, BrainIcon, ZapIcon } from 'lucide-react';

const Index = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  
  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    toggleSubtaskComplete,
    getTaskStats
  } = useTasks();

  const stats = getTaskStats();

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSubmitTask = (formData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    } else {
      createTask(formData);
      toast({
        title: "Task created",
        description: "Your new task has been added to your list.",
      });
    }
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    toggleTaskComplete(taskId);
    
    if (task && !task.completed) {
      toast({
        title: "Great job! 🎉",
        description: "Task completed successfully.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse space-y-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto animate-bounce"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-gradient-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-elegant">
                <CheckCircle2Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  NextGen Todo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Smart task management with AI assistance
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.active}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.completionRate}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {showTaskForm ? (
          <div className="max-w-2xl mx-auto">
            <TaskForm
              onSubmit={handleSubmitTask}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
              initialData={editingTask || undefined}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onToggleSubtask={toggleSubtaskComplete}
              onAddSubtask={addSubtask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCreateTask={handleCreateTask}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      {!showTaskForm && tasks.length > 0 && (
        <footer className="border-t border-border/60 bg-gradient-card mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BrainIcon className="h-4 w-4" />
                  <span>AI-powered suggestions</span>
                </div>
                <div className="flex items-center gap-1">
                  <ZapIcon className="h-4 w-4" />
                  <span>Natural language input</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Stay productive! You've completed {stats.completed} tasks so far.
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
