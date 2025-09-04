import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 0️⃣ Clear existing data (optional, ensures idempotency)
  //   await db.userTask.deleteMany();
  //   await db.clonedRoadmap.deleteMany();
  //   await db.task.deleteMany();
  //   await db.microtask.deleteMany();
  //   await db.roadmap.deleteMany();
  //   await db.user.deleteMany();

  //   console.log("Cleared existing data.");

  // 1️⃣ Create users
  console.log("Creating users...");
  const usersData = [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
    { name: "Charlie", email: "charlie@example.com" },
    { name: "David", email: "david@example.com" },
  ];

  const users = await Promise.all(
    usersData.map((u) => db.user.create({ data: u }))
  );
  const [alice, bob, charlie, david] = users;
  console.log("Users created.");

  // 2️⃣ Create roadmaps
  console.log("Creating roadmaps...");

  const roadmap1 = await db.roadmap.create({
    data: {
      title: "Frontend Developer Roadmap",
      description: "A step-by-step guide to becoming a frontend developer.",
      isPublic: true,
      ownerId: alice.id,
      microtasks: {
        create: [
          {
            title: "HTML Basics",
            tasks: {
              create: [{ title: "Learn tags" }, { title: "Forms & Inputs" }],
            },
          },
          {
            title: "CSS Basics",
            tasks: {
              create: [{ title: "Selectors" }, { title: "Flexbox & Grid" }],
            },
          },
          {
            title: "JavaScript Fundamentals",
            tasks: {
              create: [
                { title: "Variables and Data Types" },
                { title: "Functions and Scope" },
                { title: "DOM Manipulation" },
              ],
            },
          },
        ],
      },
    },
    include: { microtasks: { include: { tasks: true } } },
  });

  const roadmap2 = await db.roadmap.create({
    data: {
      title: "Backend Developer Roadmap",
      description: "Your journey into server-side development.",
      isPublic: false,
      ownerId: bob.id,
      microtasks: {
        create: [
          {
            title: "Node.js Basics",
            tasks: {
              create: [{ title: "Setup Express" }, { title: "Routing" }],
            },
          },
          {
            title: "Database Management",
            tasks: {
              create: [{ title: "PostgreSQL" }, { title: "Prisma ORM" }],
            },
          },
        ],
      },
    },
    include: { microtasks: { include: { tasks: true } } },
  });

  const roadmap3 = await db.roadmap.create({
    data: {
      title: "Full Stack Developer Roadmap",
      description:
        "The complete guide from frontend to backend and deployment.",
      isPublic: true,
      ownerId: charlie.id,
      microtasks: {
        create: [
          {
            title: "Frontend Development",
            tasks: {
              create: [
                { title: "Learn React or Vue" },
                { title: "State Management (Redux/Pinia)" },
                { title: "Component Libraries (MUI/Tailwind)" },
              ],
            },
          },
          {
            title: "Backend Development",
            tasks: {
              create: [
                { title: "Build a REST API with Express" },
                { title: "User Authentication (JWT)" },
                { title: "Connect to a Database" },
              ],
            },
          },
          {
            title: "Database & ORM",
            tasks: {
              create: [
                { title: "SQL Fundamentals" },
                { title: "Schema Design" },
                { title: "Advanced Prisma Queries" },
              ],
            },
          },
          {
            title: "Deployment",
            tasks: {
              create: [
                { title: "Docker Basics" },
                { title: "CI/CD Pipelines" },
                { title: "Deploy to Vercel/AWS" },
              ],
            },
          },
        ],
      },
    },
    include: { microtasks: { include: { tasks: true } } },
  });

  const roadmap4 = await db.roadmap.create({
    data: {
      title: "DevOps Essentials Roadmap",
      description: "Learn the fundamentals of DevOps practices and tools.",
      isPublic: true,
      ownerId: alice.id,
      microtasks: {
        create: [
          {
            title: "Version Control",
            tasks: {
              create: [
                { title: "Git Basics" },
                { title: "Branching Strategies" },
              ],
            },
          },
          {
            title: "Containerization",
            tasks: {
              create: [
                { title: "Introduction to Docker" },
                { title: "Writing Dockerfiles" },
              ],
            },
          },
        ],
      },
    },
    include: { microtasks: { include: { tasks: true } } },
  });

  console.log("Roadmaps created.");

  // 3️⃣ Simulate user progress
  console.log("Simulating user progress...");

  const userTasksData = [
    // Alice completes tasks in her Frontend roadmap
    {
      userId: alice.id,
      taskId: roadmap1.microtasks[0].tasks[0].id,
      done: true,
    },
    {
      userId: alice.id,
      taskId: roadmap1.microtasks[0].tasks[1].id,
      done: true,
    },
    // Bob completes first task in Alice's roadmap
    { userId: bob.id, taskId: roadmap1.microtasks[0].tasks[0].id, done: true },
    // Charlie completes some tasks in his Full Stack roadmap
    {
      userId: charlie.id,
      taskId: roadmap3.microtasks[0].tasks[0].id,
      done: true,
    },
    {
      userId: charlie.id,
      taskId: roadmap3.microtasks[1].tasks[0].id,
      done: true,
    },
    {
      userId: charlie.id,
      taskId: roadmap3.microtasks[2].tasks[0].id,
      done: true,
    },
  ];

  await db.userTask.createMany({ data: userTasksData });

  console.log("User progress simulated.");

  // 4️⃣ Create cloned roadmaps
  console.log("Creating cloned roadmaps...");

  await db.clonedRoadmap.createMany({
    data: [
      { userId: bob.id, roadmapId: roadmap1.id }, // Bob clones Alice's public Frontend roadmap
      { userId: david.id, roadmapId: roadmap3.id }, // David clones Charlie's Full Stack roadmap
    ],
    skipDuplicates: true, // avoids conflicts if rerun
  });

  console.log("Cloned roadmaps created.");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("An error occurred while seeding the database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
