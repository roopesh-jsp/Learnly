import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Dialog from "../wrappers/Dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertiesData } from "@/app/(protected)/my-learning/[myMapId]/page";

type EditPropertiesProps = {
  close: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  initialData: {
    title: string;
    description: string;
    isPublic: boolean;
  };
  onSave: (data: PropertiesData) => void;
};

const EditProperties = ({
  close,
  isOpen,
  initialData,
  onSave,
}: EditPropertiesProps) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [isPublic, setIsPublic] = useState(initialData.isPublic);

  // When dialog opens, reset fields with latest data
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setIsPublic(initialData.isPublic);
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    onSave({ title, description, isPublic });
    close(false);
  };

  return (
    <Dialog close={close} isOpen={isOpen}>
      <div className="space-y-6 p-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Roadmap Properties
        </h2>

        {/* Title */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Roadmap title"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Roadmap description"
          />
        </div>

        {/* Public Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isPublic}
            onCheckedChange={(val) => setIsPublic(!!val)}
          />
          <label className="text-sm text-gray-700">Make roadmap public</label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[var(--primary)] text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProperties;
