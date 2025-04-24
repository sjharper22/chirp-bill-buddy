
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LetterTemplateEditor } from "@/components/templates/LetterTemplateEditor";

interface LetterBuilderHeaderProps {
  isEditorOpen: boolean;
  setIsEditorOpen: (isOpen: boolean) => void;
  onEditorClose: () => void;
}

export function LetterBuilderHeader({ 
  isEditorOpen, 
  setIsEditorOpen, 
  onEditorClose 
}: LetterBuilderHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Letter Builder</h1>
        <p className="text-muted-foreground">
          Create, edit, and send letters for insurance claims and appeals
        </p>
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Letter
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Letter</DialogTitle>
          </DialogHeader>
          <LetterTemplateEditor onSave={onEditorClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
