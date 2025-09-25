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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <Card className="bg-background w-full max-w-lg sm:max-w-xl relative p-4 max-h-[90vh] h-fit overflow-y-auto rounded-lg">
            {/* Close Button */}
            <div
              className="absolute top-4 right-4 text-primary cursor-pointer hover:bg-primary/10 p-2 rounded-full transition"
              onClick={() => close(false)}
            >
              <X size={17} />
            </div>

            {/* Content */}
            <div className="p-6 mt-3">{children}</div>
          </Card>
        </div>
      ) : null}
    </>
  );
};

export default Dialog;
