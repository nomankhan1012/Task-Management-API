import dotenv from "dotenv";
dotenv.config();

import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

const users = [
  {
    userId: 1,
    name: "Admin",
    email: "admin@dev.com",
    age: 26,
    location: "New York, NY",
    purchasedProducts: [1, 3, 6],
    isActive: true,
  },
  {
    userId: 2,
    name: "David Smith",
    email: "david.smith@example.com",
    age: 35,
    location: "Los Angeles, CA",
    purchasedProducts: [2, 4, 5, 10],
    isActive: true,
  },
  {
    userId: 3,
    name: "Emma Williams",
    email: "emma.williams@example.com",
    age: 22,
    location: "Austin, TX",
    purchasedProducts: [7, 8],
    isActive: false,
  },
  {
    userId: 4,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    age: 41,
    location: "Chicago, IL",
    purchasedProducts: [1, 9],
    isActive: true,
  },
  {
    userId: 5,
    name: "Sophia Davis",
    email: "sophia.davis@example.com",
    age: 30,
    location: "Seattle, WA",
    purchasedProducts: [2, 3, 15],
    isActive: true,
  },
  {
    userId: 6,
    name: "James Wilson",
    email: "james.wilson@example.com",
    age: 27,
    location: "Miami, FL",
    purchasedProducts: [5, 11, 16],
    isActive: false,
  },
  {
    userId: 7,
    name: "Olivia Taylor",
    email: "olivia.taylor@example.com",
    age: 26,
    location: "San Francisco, CA",
    purchasedProducts: [3, 4, 7],
    isActive: true,
  },
  {
    userId: 8,
    name: "Liam Harris",
    email: "liam.harris@example.com",
    age: 33,
    location: "Boston, MA",
    purchasedProducts: [8, 9, 10],
    isActive: true,
  },
  {
    userId: 9,
    name: "Isabella Martinez",
    email: "isabella.martinez@example.com",
    age: 29,
    location: "Houston, TX",
    purchasedProducts: [1, 2, 3],
    isActive: true,
  },
  {
    userId: 10,
    name: "Mason Clark",
    email: "mason.clark@example.com",
    age: 31,
    location: "Phoenix, AZ",
    purchasedProducts: [5, 6, 12],
    isActive: false,
  },
];

const Tasks = [
  {
    taskId: 1,
    title: "Finish project report",
    description:
      "Complete the final report for the project and submit it by end of the week.",
    dueDate: "2024-10-10",
    assignedTo: 1, // userId
    status: "In Progress",
    priority: "High",
  },
  {
    taskId: 2,
    title: "Prepare presentation slides",
    description: "Create slides for the upcoming presentation next Monday.",
    dueDate: "2024-10-06",
    assignedTo: 2, // userId
    status: "Not Started",
    priority: "Medium",
  },
  {
    taskId: 3,
    title: "Update website content",
    description: "Revise the homepage content to reflect the latest updates.",
    dueDate: "2024-10-15",
    assignedTo: 3, // userId
    status: "Not Started",
    priority: "Low",
  },
  {
    taskId: 4,
    title: "Conduct user testing",
    description:
      "Organize and conduct user testing sessions for the new app feature.",
    dueDate: "2024-10-20",
    assignedTo: 4, // userId
    status: "In Progress",
    priority: "High",
  },
  {
    taskId: 5,
    title: "Team meeting",
    description:
      "Schedule and hold the weekly team meeting to discuss project updates.",
    dueDate: "2024-10-04",
    assignedTo: 5, // userId
    status: "Completed",
    priority: "Medium",
  },
  {
    taskId: 6,
    title: "Research market trends",
    description:
      "Gather data on current market trends relevant to our product line.",
    dueDate: "2024-10-12",
    assignedTo: 6, // userId
    status: "Not Started",
    priority: "Medium",
  },
  {
    taskId: 7,
    title: "Send out newsletters",
    description:
      "Prepare and send out the monthly newsletters to all subscribers.",
    dueDate: "2024-10-08",
    assignedTo: 7, // userId
    status: "In Progress",
    priority: "High",
  },
  {
    taskId: 8,
    title: "Design marketing materials",
    description:
      "Create graphics and promotional materials for the upcoming campaign.",
    dueDate: "2024-10-18",
    assignedTo: 8, // userId
    status: "Not Started",
    priority: "Low",
  },
  {
    taskId: 9,
    title: "Analyze sales data",
    description: "Review and analyze the sales data from the last quarter.",
    dueDate: "2024-10-14",
    assignedTo: 9, // userId
    status: "In Progress",
    priority: "Medium",
  },
  {
    taskId: 10,
    title: "Update team wiki",
    description:
      "Ensure the team wiki is up to date with the latest procedures and documents.",
    dueDate: "2024-10-25",
    assignedTo: 10, // userId
    status: "Not Started",
    priority: "Low",
  },
];

app.get("/", (req, res) => {
  res.send("Hey from Node server");
});

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    next();
  });
};

app.post("/login", (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = users.find((u) => u.name === name && u.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "4m",
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users", (req, res) => {
  try {
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/task/:taskId", authenticateToken, (req, res) => {
  try {
    const task = Tasks.find((t) => t.taskId === parseInt(req.params.taskId));

    if (!task) {
      return res.status(404).json({ err: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/create-task", authenticateToken, (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, status, priority } =
      req.body;

    const task = {
      taskId: Tasks.length + 1,
      title,
      description,
      dueDate,
      assignedTo,
      status,
      priority,
    };
    Tasks.push(task);

    res.status(201).json({ msg: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/update-tasks/:taskId", authenticateToken, (req, res) => {
  try {
    const task = Tasks.find((t) => t.taskId === parseInt(req.params.taskId));

    if (!task) {
      return res.status(404).json({ err: "Task not found" });
    }

    const { title, description, dueDate, assignedTo, status, priority } =
      req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority;

    res.status(200).json({ msg: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/delete-all-tasks", authenticateToken, (req, res) => {
  Tasks.splice(0, Tasks.length);
  res.status(200).json({ msg: "All Tasks deleted successfully" });
});

app.delete("/api/delete-task/:taskId", authenticateToken, (req, res) => {
  try {
    const task = Tasks.find((t) => t.taskId === parseInt(req.params.taskId));

    if (!task) {
      return res.status(404).send("Task not found");
    }

    const index = Tasks.indexOf(task);

    Tasks.splice(index, 1);

    res.status(200).json({ msg: "Task deleted successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/search", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;

    const endIndex = startIndex + limit;

    const tasks = Tasks.slice(startIndex, endIndex);

    const totalPages = Math.ceil(Tasks.length / limit);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    res.status(200).json({
      tasks,
      page,
      limit,
      totalPages,
      prevPage,
      nextPage,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
