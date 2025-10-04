import { useTasks } from "@/contexts/TasksContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  Calendar,
  Flame,
  Award,
  Timer,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Animations

export default function AnalyticsPage() {
  const {
    tasks,
    getTotalTasksCount,
    getCompletedTasksCount,
    getActiveTasksCount,
    getCurrentStreak,
    getLongestStreak,
    getTasksByStatus,
    getTasksByPriority,
  } = useTasks();

  // Stats
  const totalTasks = getTotalTasksCount();
  const completedTasks = getCompletedTasksCount();
  const currentStreak = getCurrentStreak();
  const longestStreak = getLongestStreak();
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Breakdown
  const todoTasks = getTasksByStatus("todo").length;
  const inProgressTasks = getTasksByStatus("in-progress").length;
  const highPriorityTasks = getTasksByPriority("high").length;
  const mediumPriorityTasks = getTasksByPriority("medium").length;
  const lowPriorityTasks = getTasksByPriority("low").length;

  // Time Analytics
  const calculateTimeAnalytics = () => {
    const totalTimeSpent = tasks.reduce((s, t) => s + (t.timeSpent || 0), 0);
    const totalEstimatedTime = tasks.reduce((s, t) => s + ((t.estimatedTime || 0) * 60), 0);
    const tasksWithTime = tasks.filter(t => t.timeSpent && t.timeSpent > 0);
    const averageTimePerTask = tasksWithTime.length > 0
      ? Math.round(totalTimeSpent / tasksWithTime.length)
      : 0;
    const timeAccuracy = totalEstimatedTime > 0
      ? Math.round((totalTimeSpent / totalEstimatedTime) * 100)
      : 0;
    const completedTasksWithTime = tasks.filter(t =>
      t.status === "completed" && t.timeSpent && t.timeSpent > 0
    );
    const averageCompletionTime = completedTasksWithTime.length > 0
      ? Math.round(completedTasksWithTime.reduce((s, t) => s + (t.timeSpent || 0), 0) / completedTasksWithTime.length)
      : 0;

    return {
      totalTimeSpent,
      totalEstimatedTime,
      averageTimePerTask,
      timeAccuracy,
      averageCompletionTime,
      tasksWithTimeCount: tasksWithTime.length,
    };
  };

  const timeAnalytics = calculateTimeAnalytics();

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${seconds}s`;
  };

  const getTopTasksByTime = () => {
    return tasks
      .filter(t => t.timeSpent && t.timeSpent > 0)
      .sort((a, b) => (b.timeSpent || 0) - (a.timeSpent || 0))
      .slice(0, 5);
  };

  // Motion Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] } as any, // Cast to any
    }),
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Detailed insights into your productivity and task management
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[{
          label: "Total Tasks", value: totalTasks, icon: Target, color: "text-primary", bg: "bg-primary/10"
        }, {
          label: "Completion Rate", value: `${completionRate}%`, icon: CheckCircle, color: "text-success", bg: "bg-success/10"
        }, {
          label: "Current Streak", value: currentStreak, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10"
        }, {
          label: "Best Streak", value: longestStreak, icon: Award, color: "text-purple-500", bg: "bg-purple-500/10"
        }].map((item, i) => (
          <motion.div key={i} variants={fadeInUp} custom={i}>
            <Card className="shadow-md hover:shadow-lg transition-shadow rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  </div>
                  <div className={`h-12 w-12 ${item.bg} rounded-xl flex items-center justify-center`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Time Tracking */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[{
          label: "Total Time Tracked", value: formatTime(timeAnalytics.totalTimeSpent), icon: Timer, color: "text-focus", bg: "bg-focus/10"
        }, {
          label: "Avg Time/Task", value: formatTime(timeAnalytics.averageTimePerTask), icon: Clock, color: "text-break", bg: "bg-break/10"
        }, {
          label: "Time Accuracy", value: `${timeAnalytics.timeAccuracy}%`, icon: Target, color: "text-success", bg: "bg-success/10"
        }, {
          label: "Tasks Tracked", value: timeAnalytics.tasksWithTimeCount, icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10"
        }].map((item, i) => (
          <motion.div key={i} variants={fadeInUp} custom={i}>
            <Card className="shadow-md hover:shadow-lg transition-shadow rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  </div>
                  <div className={`h-12 w-12 ${item.bg} rounded-xl flex items-center justify-center`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Task Breakdown + Priority */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={fadeInUp} custom={0}>
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Task Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "To Do", value: todoTasks, color: "bg-muted", percent: totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0 },
                { label: "In Progress", value: inProgressTasks, color: "bg-focus", percent: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0 },
                { label: "Completed", value: completedTasks, color: "bg-success", percent: completionRate },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${s.color} rounded-full`} />
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{s.value}</span>
                    <Badge variant="secondary">{s.percent}%</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} custom={1}>
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "High Priority", value: highPriorityTasks, color: "bg-destructive", percent: totalTasks > 0 ? Math.round((highPriorityTasks / totalTasks) * 100) : 0, badge: "destructive" },
                { label: "Medium Priority", value: mediumPriorityTasks, color: "bg-break", percent: totalTasks > 0 ? Math.round((mediumPriorityTasks / totalTasks) * 100) : 0, badge: "secondary" },
                { label: "Low Priority", value: lowPriorityTasks, color: "bg-success", percent: totalTasks > 0 ? Math.round((lowPriorityTasks / totalTasks) * 100) : 0, badge: "secondary" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${p.color} rounded-full`} />
                    <span className="text-sm">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{p.value}</span>
                    <Badge variant={p.badge as any}>{p.percent}%</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Time Insights + Top Tasks */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={fadeInUp} custom={0}>
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                Top Time Consuming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getTopTasksByTime().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Timer className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No time tracking data yet</p>
                  <p className="text-xs">Start tracking time on your tasks to see insights</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getTopTasksByTime().map((task, index) => (
                    <motion.div
                      key={task.id}
                      variants={fadeInUp}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={task.status === "completed" ? "secondary" : "outline"} className="text-xs">
                            {task.status}
                          </Badge>
                          <Badge variant={
                            task.priority === "high" ? "destructive" :
                            task.priority === "medium" ? "default" : "secondary"
                          } className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-focus">{formatTime(task.timeSpent || 0)}</p>
                        {task.estimatedTime && (
                          <p className="text-xs text-muted-foreground">
                            Est: {task.estimatedTime}m
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} custom={1}>
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Time Estimation Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimation Accuracy</span>
                  <span className={cn(
                    "text-lg font-bold",
                    timeAnalytics.timeAccuracy > 100 ? "text-break" : 
                    timeAnalytics.timeAccuracy > 80 ? "text-success" : "text-muted-foreground"
                  )}>
                    {timeAnalytics.timeAccuracy}%
                  </span>
                </div>
                <Progress
                  value={Math.min(timeAnalytics.timeAccuracy, 100)}
                  className={cn(
                    "h-2 rounded-full",
                    timeAnalytics.timeAccuracy > 100 ? "[&>div]:bg-break" : "[&>div]:bg-success"
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {timeAnalytics.timeAccuracy > 100 
                    ? "You tend to underestimate task duration"
                    : timeAnalytics.timeAccuracy > 80
                    ? "Great estimation accuracy!"
                    : "Consider tracking more tasks for better insights"
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-focus/5 rounded-lg border border-focus/20">
                  <p className="text-xs text-muted-foreground">Avg Completion Time</p>
                  <p className="text-lg font-bold text-focus">{formatTime(timeAnalytics.averageCompletionTime)}</p>
                </div>
                <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                  <p className="text-xs text-muted-foreground">Tasks Tracked</p>
                  <p className="text-lg font-bold text-success">{timeAnalytics.tasksWithTimeCount}</p>
                </div>
              </div>

              {timeAnalytics.totalEstimatedTime > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated vs Actual</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/30 rounded">
                      <p className="text-muted-foreground">Estimated</p>
                      <p className="font-semibold">{formatTime(timeAnalytics.totalEstimatedTime)}</p>
                    </div>
                    <div className="text-center p-2 bg-focus/10 rounded">
                      <p className="text-muted-foreground">Actual</p>
                      <p className="font-semibold text-focus">{formatTime(timeAnalytics.totalTimeSpent)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}