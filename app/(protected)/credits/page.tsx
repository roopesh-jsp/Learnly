"use client";
import { Coins, Info, Mail, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Credits = () => {
  const [credits, setCredits] = useState(0);
  const getCredits = async () => {
    try {
      const res = await fetch("/api/credits", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data.credits);

      setCredits(data.credits);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCredits();
  }, []);
  return (
    <div className="bg-background text-foreground min-h-screen w-full p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            Manage Your Credits
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your current credit balance and how to get
            more.
          </p>
        </div>

        {/* Credits Display Card */}
        <div className="border rounded-xl bg-card shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Your Current Balance
            </p>
            <p className="text-5xl font-bold text-foreground mt-1">{credits}</p>
          </div>
          <Coins className="w-16 h-16 text-primary/70" />
        </div>

        {/* Information & Contact Card */}
        <div className="border rounded-xl bg-muted/50 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                Need More Credits?
              </h2>
              <p className="text-muted-foreground mt-2">
                If you need more credits, please contact the site owner, Roopesh
                Kumar. We currently do not have a feature to purchase credits
                since this is a prototype and a small project related to web
                development and AI engineering.
              </p>
              <p className="text-muted-foreground mt-2">
                We hope you understand. Best regards.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-3 text-sm">
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
      </div>
    </div>
  );
};

export default Credits;
