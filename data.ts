import { Code, Server, Layers, PenTool } from "lucide-react";

export const roadmapData = [
  {
    id: 1,
    title: "Frontend Developer",

    description:
      "Your journey to becoming a modern frontend developer. Start with the basics and move towards advanced frameworks and tools.",
    microGoals: [
      {
        id: "fe_mg_1",
        title: "Learn the Basics: HTML, CSS, & JavaScript",
        tasks: [
          "Understand semantic HTML tags.",
          "Learn CSS Box Model, Flexbox, and Grid.",
          "Master JavaScript fundamentals: variables, functions, DOM manipulation.",
          "Build a simple static website.",
        ],
      },
      {
        id: "fe_mg_2",
        title: "Choose a Framework",
        tasks: [
          "Learn React basics: Components, Props, and State.",
          "Explore Vue.js concepts.",
          "Understand Angular's structure.",
          "Build a small project with one of the frameworks.",
        ],
      },
      {
        id: "fe_mg_3",
        title: "Version Control with Git",
        tasks: [
          "Learn basic Git commands: add, commit, push, pull.",
          "Understand branching and merging.",
          "Create a GitHub repository for your projects.",
        ],
      },
      {
        id: "fe_mg_4",
        title: "Styling and Component Libraries",
        tasks: [
          "Learn a CSS preprocessor like SASS.",
          "Explore utility-first CSS with Tailwind CSS.",
          "Use a component library like Material-UI or Shadcn/ui.",
        ],
      },
      {
        id: "fe_mg_5",
        title: "Advanced Topics (Optional)",
        tasks: [],
      },
    ],
  },
  {
    id: 2,
    title: "Backend Developer (Node.js)",

    description:
      "Become a backend developer using the JavaScript ecosystem with Node.js, Express, and databases.",
    microGoals: [
      {
        id: "be_mg_1",
        title: "Master Node.js",
        tasks: [
          "Understand the Node.js event loop.",
          "Learn about modules and npm.",
          "Build a simple command-line application.",
        ],
      },
      {
        id: "be_mg_2",
        title: "Build APIs with Express.js",
        tasks: [
          "Create routes and middleware.",
          "Handle requests and responses.",
          "Implement RESTful API principles.",
          "Build a basic CRUD API.",
        ],
      },
      {
        id: "be_mg_3",
        title: "Databases",
        tasks: [
          "Learn SQL basics with PostgreSQL.",
          "Explore NoSQL with MongoDB.",
          "Connect your Express app to a database.",
          "Understand Object-Relational Mapping (ORM) with Prisma or Sequelize.",
        ],
      },
      {
        id: "be_mg_4",
        title: "Authentication & Authorization",
        tasks: [],
      },
      {
        id: "be_mg_5",
        title: "Deployment",
        tasks: [
          "Learn to containerize your app with Docker.",
          "Deploy to a cloud provider like Vercel, Render, or AWS.",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Full-Stack Developer",

    description:
      "Combine the frontend and backend skills to build complete web applications from start to finish.",
    microGoals: [
      {
        id: "fs_mg_1",
        title: "Complete Frontend Roadmap",
        tasks: [
          "Master HTML, CSS, and JavaScript.",
          "Become proficient in a frontend framework like React.",
        ],
      },
      {
        id: "fs_mg_2",
        title: "Complete Backend Roadmap",
        tasks: [
          "Learn Node.js and Express.",
          "Understand database management (SQL and NoSQL).",
        ],
      },
      {
        id: "fs_mg_3",
        title: "Connect Frontend and Backend",
        tasks: [
          "Fetch data from your backend API in your frontend application.",
          "Implement user authentication flow.",
          "Handle CORS and environment variables.",
        ],
      },
      {
        id: "fs_mg_4",
        title: "Understand DevOps Principles",
        tasks: [],
      },
    ],
  },
  {
    id: 4,
    title: "UI/UX Designer",

    description:
      "Learn the principles of user interface and user experience design to create intuitive and beautiful digital products.",
    microGoals: [
      {
        id: "ux_mg_1",
        title: "Design Fundamentals",
        tasks: [
          "Study color theory and typography.",
          "Learn about layout and composition.",
          "Understand visual hierarchy.",
        ],
      },
      {
        id: "ux_mg_2",
        title: "Learn a Design Tool",
        tasks: [
          "Master Figma or Sketch.",
          "Learn about prototyping and creating design systems.",
        ],
      },
      {
        id: "ux_mg_3",
        title: "User Research",
        tasks: [
          "Learn to conduct user interviews.",
          "Create user personas and journey maps.",
        ],
      },
      {
        id: "ux_mg_4",
        title: "Wireframing and Prototyping",
        tasks: [],
      },
    ],
  },
];
