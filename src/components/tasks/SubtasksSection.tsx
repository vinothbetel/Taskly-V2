import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTasks } from '@/contexts/TasksContext';
import { Task, Subtask } from '@/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface SubtasksSectionProps {
  task: Task;
}

// Helper function to calculate subtask completion percentage
const calculateCompletionPercentage = (subtasks?: Subtask[]): number => {
  if (!subtasks || subtasks.length === 0) return 0;
  const completed = subtasks.filter(sub => sub.isCompleted).length;
  return Math.round((completed / subtasks.length) * 100);
};

export function SubtasksSection({ task }: SubtasksSectionProps) {
  const { addSubtask, toggleSubtaskStatus, deleteSubtask } = useTasks();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // New state for collapse/expand
  const completionPercentage = calculateCompletionPercentage(task.subtasks);
  const subtaskCount = task.subtasks?.length || 0;

  const handleAddSubtask = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent TaskCard
    if (!newSubtaskTitle.trim()) return;
    await addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = async (e: React.MouseEvent, subtaskId: string) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent TaskCard
    await toggleSubtaskStatus(task.id, subtaskId);
  };

  const handleDeleteSubtask = async (e: React.MouseEvent, subtaskId: string) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent TaskCard
    if (confirm('Are you sure you want to delete this subtask?')) {
      await deleteSubtask(task.id, subtaskId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent TaskCard
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask(e as any); // Cast to any to match MouseEvent signature
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="pt-0 pb-3 space-y-3"> {/* Added pb-3 here */}
      {/* Toggle Button */}
      <Button
        variant="ghost"
        onClick={handleToggleExpanded}
        className="w-full justify-between py-1 px-2 h-auto hover:bg-muted/30 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Subtasks {subtaskCount > 0 && `(${subtaskCount})`}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {/* Animated Content Section */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-0">
              {task.subtasks && task.subtasks.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <Progress value={completionPercentage} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">{completionPercentage}%</span>
                  </div>

                  <div className="space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2 group">
                        <Checkbox
                          id={`subtask-${subtask.id}`}
                          checked={subtask.isCompleted}
                          onCheckedChange={(checked) => handleToggleSubtask({ stopPropagation: () => {} } as any, subtask.id)} // Mock event for onCheckedChange
                          onClick={(e) => e.stopPropagation()} // Stop propagation on click
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`subtask-${subtask.id}`}
                          className={cn(
                            "flex-1 text-sm cursor-pointer",
                            subtask.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                          )}
                          onClick={(e) => e.stopPropagation()} // Stop propagation on label click
                        >
                          {subtask.title}
                        </label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                          onClick={(e) => handleDeleteSubtask(e, subtask.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Add a new subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onClick={(e) => e.stopPropagation()} // Stop propagation on input click
                  className="flex-1"
                />
                <Button size="icon" onClick={handleAddSubtask} disabled={!newSubtaskTitle.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}