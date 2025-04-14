
export type UserRole = "admin" | "supervisor" | "technician";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type TaskStatus = "backlog" | "todo" | "in_progress" | "blocked" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  reporterId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimatedHours: number;
  loggedHours: number;
  isFlagged: boolean;
  tags: string[];
  esn?: string; // Engine Serial Number
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  members: string[];
  tags: string[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: "flag" | "status" | "assignment" | "progress";
  relatedItemId?: string;
}
