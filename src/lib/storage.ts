import { User, Task, Project, Comment, Notification } from "@/types";

// Initial data for demonstration
const initialUsers: User[] = [
  {
    id: "u1",
    name: "Sahan Amarasekara",
    email: "sahan@FTAI.co.uk",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=59",
  },
  {
    id: "u2",
    name: "Tomas Cozens",
    email: "tomas@FTAI.co.uk",
    role: "supervisor",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "u3",
    name: "David Nelson",
    email: "david@FTAI.co.uk",
    role: "technician",
    avatar: "https://i.pravatar.cc/150?img=51",
  },
  {
    id: "u4",
    name: "Sepideh Jokari",
    email: "sepideh@FTAI.co.uk",
    role: "technician",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "Engine Overhaul A320",
    description: "Complete overhaul of A320 engines for AirLine Inc.",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: "u2",
    members: ["u2", "u3", "u4"],
    tags: ["A320", "Overhaul", "Critical"],
  },
  {
    id: "p2",
    name: "Routine Maintenance B737",
    description: "Scheduled maintenance for B737 fleet.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: "u2",
    members: ["u2", "u3"],
    tags: ["B737", "Maintenance", "Routine"],
  },
];

const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Inspect fan blades",
    description: "Complete inspection of all fan blades for damage or wear.",
    status: "todo",
    priority: "high",
    assigneeId: "u3",
    reporterId: "u2",
    projectId: "p1",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 8,
    loggedHours: 0,
    isFlagged: false,
    tags: ["Inspection", "Fan"],
    esn: "ESN12345",
  },
  {
    id: "t2",
    title: "Replace fuel pump",
    description: "Remove and replace main fuel pump according to manual.",
    status: "in_progress",
    priority: "critical",
    assigneeId: "u4",
    reporterId: "u2",
    projectId: "p1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 12,
    loggedHours: 4,
    isFlagged: true,
    tags: ["Replacement", "Fuel System"],
    esn: "ESN12345",
  },
  {
    id: "t3",
    title: "Calibrate sensors",
    description: "Calibrate all engine sensors according to specification.",
    status: "backlog",
    priority: "medium",
    assigneeId: undefined,
    reporterId: "u2",
    projectId: "p1",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 6,
    loggedHours: 0,
    isFlagged: false,
    tags: ["Calibration", "Sensors"],
    esn: "ESN12345",
  },
  {
    id: "t4",
    title: "Oil system flush",
    description: "Complete oil system flush and refill.",
    status: "todo",
    priority: "high",
    assigneeId: "u3",
    reporterId: "u2",
    projectId: "p2",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 4,
    loggedHours: 0,
    isFlagged: false,
    tags: ["Oil System", "Maintenance"],
    esn: "ESN54321",
  },
  {
    id: "t5",
    title: "Update maintenance logs",
    description: "Document all maintenance performed in system logs.",
    status: "done",
    priority: "low",
    assigneeId: "u4",
    reporterId: "u2",
    projectId: "p2",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 2,
    loggedHours: 2,
    isFlagged: false,
    tags: ["Documentation", "Logs"],
    esn: "ESN54321",
  },
];

const initialComments: Comment[] = [
  {
    id: "c1",
    taskId: "t2",
    userId: "u2",
    content: "Please document all serial numbers of replaced parts.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c2",
    taskId: "t2",
    userId: "u4",
    content: "Will do. Replacement parts are on backorder, might cause delay.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

const initialNotifications: Notification[] = [
  {
    id: "n1",
    userId: "u2",
    title: "Task Flagged",
    message: "Bob Wilson flagged 'Replace fuel pump' as blocked",
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    type: "flag",
    relatedItemId: "t2",
  },
  {
    id: "n2",
    userId: "u3",
    title: "New Task Assignment",
    message: "You've been assigned to task 'Inspect fan blades'",
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: "assignment",
    relatedItemId: "t1",
  },
];

// Helper functions to work with localStorage
const getItem = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored) as T;
};

const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initialize data in localStorage if it doesn't exist
const initializeData = () => {
  if (!localStorage.getItem("users")) {
    setItem("users", initialUsers);
  }

  if (!localStorage.getItem("projects")) {
    setItem("projects", initialProjects);
  }

  if (!localStorage.getItem("tasks")) {
    setItem("tasks", initialTasks);
  }

  if (!localStorage.getItem("comments")) {
    setItem("comments", initialComments);
  }

  if (!localStorage.getItem("notifications")) {
    setItem("notifications", initialNotifications);
  }

  // Set current user for demo purposes
  if (!localStorage.getItem("currentUser")) {
    setItem("currentUser", "");
  }
};

// Data access functions
export const getCurrentUser = (): string => {
  return getItem<string>("currentUser", "");
};

export const setCurrentUser = (userId: string): void => {
  setItem("currentUser", userId);
};

export const getUsers = (): User[] => {
  return getItem<User[]>("users", []);
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.id === id);
};

export const createUser = (user: Omit<User, "id">): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `u${Date.now()}`,
  };
  setItem("users", [...users, newUser]);
  return newUser;
};

export const updateUser = (user: User): void => {
  const users = getUsers();
  const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
  setItem("users", updatedUsers);
};

export const deleteUser = (id: string): void => {
  const users = getUsers();
  setItem(
    "users",
    users.filter((user) => user.id !== id)
  );
};

export const getProjects = (): Project[] => {
  return getItem<Project[]>("projects", []);
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find((project) => project.id === id);
};

export const createProject = (
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
): Project => {
  const projects = getProjects();
  const now = new Date().toISOString();
  const newProject: Project = {
    ...project,
    id: `p${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  setItem("projects", [...projects, newProject]);
  return newProject;
};

export const updateProject = (project: Project): void => {
  const projects = getProjects();
  const updatedProjects = projects.map((p) => {
    if (p.id === project.id) {
      return { ...project, updatedAt: new Date().toISOString() };
    }
    return p;
  });
  setItem("projects", updatedProjects);
};

export const deleteProject = (id: string): void => {
  const projects = getProjects();
  setItem(
    "projects",
    projects.filter((project) => project.id !== id)
  );

  // Also delete all tasks associated with this project
  const tasks = getTasks();
  setItem(
    "tasks",
    tasks.filter((task) => task.projectId !== id)
  );
};

export const getTasks = (): Task[] => {
  return getItem<Task[]>("tasks", []);
};

export const getTaskById = (id: string): Task | undefined => {
  const tasks = getTasks();
  return tasks.find((task) => task.id === id);
};

export const getTasksByProject = (projectId: string): Task[] => {
  const tasks = getTasks();
  return tasks.filter((task) => task.projectId === projectId);
};

export const getTasksByAssignee = (assigneeId: string): Task[] => {
  const tasks = getTasks();
  return tasks.filter((task) => task.assigneeId === assigneeId);
};

export const getTasksForUser = (userId: string): Task[] => {
  const tasks = getTasks();
  return tasks.filter(
    (task) => task.assigneeId === userId || task.reporterId === userId
  );
};

export const createTask = (
  task: Omit<Task, "id" | "createdAt" | "updatedAt">
): Task => {
  const tasks = getTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    ...task,
    id: `t${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  setItem("tasks", [...tasks, newTask]);

  // Create notification for assignee if one exists
  if (newTask.assigneeId) {
    createNotification({
      userId: newTask.assigneeId,
      title: "New Task Assignment",
      message: `You've been assigned to task '${newTask.title}'`,
      isRead: false,
      type: "assignment",
      relatedItemId: newTask.id,
    });
  }

  return newTask;
};

export const updateTask = (task: Task): void => {
  const tasks = getTasks();
  const existingTask = tasks.find((t) => t.id === task.id);

  const updatedTasks = tasks.map((t) => {
    if (t.id === task.id) {
      return { ...task, updatedAt: new Date().toISOString() };
    }
    return t;
  });

  setItem("tasks", updatedTasks);

  // Create notification if assignee changed
  if (
    existingTask &&
    existingTask.assigneeId !== task.assigneeId &&
    task.assigneeId
  ) {
    createNotification({
      userId: task.assigneeId,
      title: "New Task Assignment",
      message: `You've been assigned to task '${task.title}'`,
      isRead: false,
      type: "assignment",
      relatedItemId: task.id,
    });
  }

  // Create notification if status changed
  if (existingTask && existingTask.status !== task.status) {
    // Notify project owner
    const project = getProjectById(task.projectId);
    if (project) {
      createNotification({
        userId: project.ownerId,
        title: "Task Status Updated",
        message: `Task '${task.title}' status changed to ${task.status.replace(
          "_",
          " "
        )}`,
        isRead: false,
        type: "status",
        relatedItemId: task.id,
      });
    }
  }

  // Create notification if flagged
  if (existingTask && !existingTask.isFlagged && task.isFlagged) {
    // Notify project owner
    const project = getProjectById(task.projectId);
    if (project) {
      createNotification({
        userId: project.ownerId,
        title: "Task Flagged",
        message: `Task '${task.title}' has been flagged`,
        isRead: false,
        type: "flag",
        relatedItemId: task.id,
      });
    }
  }
};

export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  setItem(
    "tasks",
    tasks.filter((task) => task.id !== id)
  );

  // Also delete all comments associated with this task
  const comments = getComments();
  setItem(
    "comments",
    comments.filter((comment) => comment.taskId !== id)
  );
};

export const getComments = (): Comment[] => {
  return getItem<Comment[]>("comments", []);
};

export const getCommentsByTask = (taskId: string): Comment[] => {
  const comments = getComments();
  return comments.filter((comment) => comment.taskId === taskId);
};

export const createComment = (
  comment: Omit<Comment, "id" | "createdAt">
): Comment => {
  const comments = getComments();
  const newComment: Comment = {
    ...comment,
    id: `c${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  setItem("comments", [...comments, newComment]);
  return newComment;
};

export const deleteComment = (id: string): void => {
  const comments = getComments();
  setItem(
    "comments",
    comments.filter((comment) => comment.id !== id)
  );
};

export const getNotifications = (): Notification[] => {
  return getItem<Notification[]>("notifications", []);
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  const notifications = getNotifications();
  return notifications.filter((notification) => notification.userId === userId);
};

export const createNotification = (
  notification: Omit<Notification, "id" | "createdAt">
): Notification => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `n${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  setItem("notifications", [...notifications, newNotification]);
  return newNotification;
};

export const markNotificationAsRead = (id: string): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map((n) => {
    if (n.id === id) {
      return { ...n, isRead: true };
    }
    return n;
  });
  setItem("notifications", updatedNotifications);
};

export const deleteNotification = (id: string): void => {
  const notifications = getNotifications();
  setItem(
    "notifications",
    notifications.filter((notification) => notification.id !== id)
  );
};

// Initialize the data
initializeData();
