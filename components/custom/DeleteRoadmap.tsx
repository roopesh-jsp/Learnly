import React, { Dispatch, SetStateAction } from "react";
import Dialog from "../wrappers/Dialog";
import { AlertTriangle, Trash2, X, CopyMinus } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteRoadmapProps = {
  close: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  onDelete: () => void;
  isCloned: boolean;
};

const DeleteRoadmap = ({
  close,
  isOpen,
  onDelete,
  isCloned,
}: DeleteRoadmapProps) => {
  return (
    <Dialog isOpen={isOpen} close={close}>
      <div className="p-6 space-y-6">
        {/* Warning message */}
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <span className="font-semibold">
            {isCloned ? "Unclone Roadmap" : "Delete Roadmap"}
          </span>
        </div>
        <p className="text-gray-700">
          {isCloned
            ? "Are you sure you want to remove this cloned roadmap from your account?"
            : "Are you sure you want to permanently delete this roadmap? This action cannot be undone."}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => close(false)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <X className="w-4 h-4" /> Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="flex items-center gap-2 cursor-pointer"
          >
            {isCloned ? (
              <>
                <CopyMinus className="w-4 h-4" /> Unclone
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteRoadmap;
