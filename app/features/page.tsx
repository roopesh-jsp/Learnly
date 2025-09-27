import React from "react";
import { BookOpen, Target, Users, FileText, Share2, Bot } from "lucide-react";

const features = [
  {
    icon: <Target className="w-5 h-5 text-primary" />,
    title: "Create Learning Roadmaps",
    description:
      "Design clear, structured roadmaps for any technology, subject, or exam preparation. Roadmaps can be built manually or generated instantly with AI, ensuring you never miss a crucial topic.",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-primary" />,
    title: "Track Your Progress",
    description:
      "Stay motivated by keeping track of your learning journey. Check off completed steps, monitor your growth, and maintain consistency across your goals.",
  },
  {
    icon: <Bot className="w-5 h-5 text-primary" />,
    title: "AI-Powered Quizzes",
    description:
      "Test your knowledge with quizzes powered by AI. Questions adapt to your roadmap topics and help you reinforce what you’ve learned.",
  },
  {
    icon: <FileText className="w-5 h-5 text-primary" />,
    title: "Printable Worksheets",
    description:
      "Prefer offline learning? Download worksheets directly from your roadmap, making it easier for people who want to reduce screen time.",
  },
  {
    icon: <Share2 className="w-5 h-5 text-primary" />,
    title: "Clone & Share Roadmaps",
    description:
      "Share your roadmaps with friends, classmates, or colleagues. When you update your roadmap, changes automatically reflect in cloned versions, enabling seamless collaborative learning.",
  },
  {
    icon: <Users className="w-5 h-5 text-primary" />,
    title: "For Tutors & Instructors",
    description:
      "Educators can create exclusive roadmaps for their students, making Learnly a powerful teaching assistant for online courses and group studies.",
  },
];

const Features = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-primary mb-4">
          Why Choose Learnly?
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Learnly is more than just a study planner—it’s a complete ecosystem
          that brings structure, intelligence, and collaboration to the way you
          learn new technologies, subjects, or prepare for exams.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition"
          >
            <div className="flex gap-2 items-center mb-2">
              <div className="">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
            </div>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Use Cases Section */}
      <div className="mt-20 text-center">
        <h2 className="text-4xl font-bold text-primary mb-4">
          Use Cases & Scope
        </h2>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-12">
          Learnly can be used by anyone who wants to learn, teach, or organize
          knowledge. Its scope extends from individual learners to classrooms
          and organizations, providing flexible learning paths and collaboration
          features.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Self-Learners</h4>
            <p className="text-muted-foreground">
              Build personalized roadmaps, stay consistent with progress
              tracking, and test yourself with AI quizzes.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Students</h4>
            <p className="text-muted-foreground">
              Collaborate with friends by sharing and cloning roadmaps, or
              prepare together for exams with up-to-date study material.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Tutors & Instructors</h4>
            <p className="text-muted-foreground">
              Create exclusive learning paths for your students, keep them
              updated in real time, and make teaching more structured and
              engaging.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <h4 className="text-xl font-semibold mb-2">
              Working Professionals
            </h4>
            <p className="text-muted-foreground">
              Learn new technologies systematically, track your upskilling, and
              balance learning alongside work commitments.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Communities</h4>
            <p className="text-muted-foreground">
              Open-source groups or learning communities can build and share
              public roadmaps that everyone can benefit from and contribute to.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Future Scope</h4>
            <p className="text-muted-foreground">
              Learnly aims to expand into gamified learning, AI-based progress
              insights, integration with coding platforms, and group study
              sessions powered by real-time collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
