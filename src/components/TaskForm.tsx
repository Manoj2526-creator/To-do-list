import { useState } from 'react';
import { TaskFormData, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
    }
  };

  const parseNaturalLanguage = (input: string) => {
    // Simple natural language parsing
    const lowerInput = input.toLowerCase();
    
    // Extract due date hints
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let suggestedDate: Date | undefined;
    let cleanTitle = input;
    
    if (lowerInput.includes('today')) {
      suggestedDate = today;
      cleanTitle = input.replace(/\s*today\s*/gi, ' ').trim();
    } else if (lowerInput.includes('tomorrow')) {
      suggestedDate = tomorrow;
      cleanTitle = input.replace(/\s*tomorrow\s*/gi, ' ').trim();
    }
    
    // Extract priority hints
    let suggestedPriority: Priority = formData.priority;
    if (lowerInput.includes('urgent') || lowerInput.includes('important') || lowerInput.includes('asap')) {
      suggestedPriority = 'high';
      cleanTitle = cleanTitle.replace(/\s*(urgent|important|asap)\s*/gi, ' ').trim();
    } else if (lowerInput.includes('low priority') || lowerInput.includes('sometime')) {
      suggestedPriority = 'low';
      cleanTitle = cleanTitle.replace(/\s*(low priority|sometime)\s*/gi, ' ').trim();
    }
    
    return { cleanTitle, suggestedDate, suggestedPriority };
  };

  const handleTitleChange = (value: string) => {
    const { cleanTitle, suggestedDate, suggestedPriority } = parseNaturalLanguage(value);
    
    setFormData(prev => ({
      ...prev,
      title: value, // Keep original input for editing
      ...(suggestedDate && !prev.dueDate && { dueDate: suggestedDate }),
      priority: suggestedPriority
    }));
  };

  return (
    <Card className="p-6 animate-slide-up shadow-elegant">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {initialData ? 'Edit Task' : 'Create New Task'}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., Call John tomorrow, Review urgent report..."
            className="transition-all duration-200 focus:shadow-card"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            💡 Try natural language: "Call John tomorrow" or "Review urgent report"
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add more details about this task..."
            className="min-h-[80px] transition-all duration-200 focus:shadow-card"
          />
        </div>

        {/* Priority and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value: Priority) => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="transition-all duration-200 focus:shadow-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low Priority</SelectItem>
                <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                <SelectItem value="high">🔴 High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal transition-all duration-200 hover:shadow-card",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!formData.title.trim()}
            className="min-w-[100px] transition-all duration-200 hover:shadow-card"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {initialData ? 'Update' : 'Create'} Task
          </Button>
        </div>
      </form>
    </Card>
  );
}