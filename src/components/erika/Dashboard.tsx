import { Activity, TrendingUp, Users, FileText, Brain, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for charts
const activityData = [
  { name: 'Mon', value: 12, queries: 8, files: 4 },
  { name: 'Tue', value: 19, queries: 12, files: 7 },
  { name: 'Wed', value: 15, queries: 9, files: 6 },
  { name: 'Thu', value: 27, queries: 18, files: 9 },
  { name: 'Fri', value: 22, queries: 14, files: 8 },
  { name: 'Sat', value: 8, queries: 5, files: 3 },
  { name: 'Sun', value: 6, queries: 4, files: 2 },
];

const topicsData = [
  { name: 'Strategy', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Finance', value: 28, color: 'hsl(var(--success))' },
  { name: 'Operations', value: 22, color: 'hsl(var(--warning))' },
  { name: 'HR', value: 15, color: 'hsl(var(--destructive))' },
];

const performanceData = [
  { month: 'Jan', accuracy: 92, speed: 85, confidence: 88 },
  { month: 'Feb', accuracy: 94, speed: 87, confidence: 90 },
  { month: 'Mar', accuracy: 96, speed: 89, confidence: 92 },
  { month: 'Apr', accuracy: 95, speed: 91, confidence: 94 },
  { month: 'May', accuracy: 97, speed: 93, confidence: 95 },
  { month: 'Jun', accuracy: 98, speed: 95, confidence: 97 },
];

export function Dashboard() {
  const stats = [
    {
      title: "Total Documents",
      value: "2,847",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: FileText,
      description: "Files processed this month"
    },
    {
      title: "Active Queries",
      value: "142",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: Brain,
      description: "Queries executed today"
    },
    {
      title: "Processing Time",
      value: "2.4s",
      change: "-15.3%",
      changeType: "decrease" as const,
      icon: Clock,
      description: "Average processing time"
    },
    {
      title: "Accuracy Rate",
      value: "98.2%",
      change: "+2.1%",
      changeType: "increase" as const,
      icon: CheckCircle,
      description: "Classification accuracy"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-title-1 font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-body text-muted-foreground mt-2">
          Monitor your AI assistant's performance and system insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-caption-1 font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-title-2 font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={stat.changeType === 'increase' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  <p className="text-caption-2 text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-headline flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Weekly Activity
            </CardTitle>
            <CardDescription>
              Document processing and query activity over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Topic Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-headline flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Topic Distribution
            </CardTitle>
            <CardDescription>
              Document classification by topic categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-headline flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              AI model performance tracking over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  name="Accuracy (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  name="Speed Score (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
                  name="Confidence (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-headline flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Recent System Activity
          </CardTitle>
          <CardDescription>
            Latest operations and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'success', message: 'Document Q3_Strategy.pdf processed successfully', time: '2 minutes ago' },
              { type: 'info', message: 'New classification model deployed', time: '15 minutes ago' },
              { type: 'warning', message: 'High processing queue detected (24 files)', time: '1 hour ago' },
              { type: 'success', message: 'Weekly backup completed', time: '3 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-success' :
                  activity.type === 'warning' ? 'bg-warning' :
                  activity.type === 'info' ? 'bg-primary' : 'bg-muted-foreground'
                }`} />
                <div className="flex-1">
                  <p className="text-callout text-foreground">{activity.message}</p>
                  <p className="text-caption-2 text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}