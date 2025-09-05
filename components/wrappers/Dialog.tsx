"use client";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Card } from "../ui/card";

const Dialog = ({
  isOpen,
  children,
  close,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  close: Dispatch<SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 bg-black/50 flex justify-center  ">
          <Card className="bg-background min-w-xl relative p-4 max-h-[550px] h-fit overflow-y-auto rounded-lg mt-[100px]">
            <div
              className="absolute top-4 right-4 text-primary cursor-pointer hover:bg-primary/10 p-2 rounded-full transition"
              onClick={() => close(false)}
            >
              <X size={17} />
            </div>
            <div className="p-6 mt-3">{children}</div>
          </Card>
        </div>
      ) : null}
    </>
  );
};

export default Dialog;
