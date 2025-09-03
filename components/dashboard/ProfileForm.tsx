"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import Dialog from "../wrappers/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfileForm = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: Dispatch<SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    console.log("Saved name:", name);
    close(false); // close modal after saving
    setName("");
  };

  return (
    <Dialog isOpen={isOpen} close={close}>
      {/* Heading */}
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Edit Profile
      </h2>

      {/* Form */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={() => close(false)}>
          Cancel
        </Button>
        <Button
          className="bg-primary text-primary-foreground"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Dialog>
  );
};

export default ProfileForm;
