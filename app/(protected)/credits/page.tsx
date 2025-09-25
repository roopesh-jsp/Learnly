"use client";
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
    <div>
      <h1 className="text-3xl text-center text-red-400">Credits page</h1>

      <div>
        <span>Credits : {credits}</span>
      </div>
    </div>
  );
};

export default Credits;
