import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  ExternalLink,
  GraduationCap,
  Code,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component like in Shadcn/ui

const About = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 space-y-12">
        {/* --- Hero Section --- */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-foreground/80 bg-clip-text text-transparent">
            About Learnly
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            An AI-powered platform designed to make learning intuitive,
            personalized, and accessible for everyone.
          </p>
        </div>

        {/* --- About the Project Section --- */}
        <div className="p-8 border rounded-xl bg-card">
          <div className="flex items-center gap-4">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-semibold">Project Overview</h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            Learnly was built in **September 2025** as a part of my professional
            resume project. It showcases a modern full-stack application that
            leverages the power of AI to generate dynamic learning roadmaps and
            quizzes. The goal is to demonstrate practical skills in both web
            development and the fundamentals of AI engineering.
          </p>
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold text-foreground">
              A Note on Credits & Payments
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              As Learnly is a prototype, features like a payment gateway for
              purchasing credits have not been implemented. If you need more
              credits to fully explore the platform, please feel free to contact
              me directly. Hope you understand!
            </p>
          </div>
        </div>

        {/* --- Meet the Creator Section --- */}
        <div className="p-8 border rounded-xl bg-card">
          <div className="flex items-center gap-4">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-semibold">Meet the Creator</h2>
          </div>
          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-bold">Roopesh Kumar Jonnakuti</h3>
            <p className="text-muted-foreground">
              I am a passionate Full Stack Web Developer and a final-year
              student, set to graduate in **2026**. With a strong foundation in
              technologies like **Next.js, Java, and Python**, I am currently
              expanding my expertise into the exciting field of **AI
              Development**. This project is a testament to my dedication to
              building practical, AI-driven applications.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="https://roopeshkumar.vercel.app/"
              passHref
              legacyBehavior
            >
              <a target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  View My Portfolio
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </Link>
          </div>
        </div>

        {/* --- Contact Details Section --- */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="mt-2 text-muted-foreground">
            Have questions or want to connect? Feel free to reach out.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4">
            <a
              href="mailto:rupzkumar5@gmail.com"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              <Mail className="w-4 h-4" />
              rupzkumar5@gmail.com
            </a>
            <a
              href="tel:+917036311198"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              +91 7036311198
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
