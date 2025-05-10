
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExtendedTemplateCategory } from '@/types/template';

interface TemplateHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  category: ExtendedTemplateCategory;
  setCategory: (category: ExtendedTemplateCategory) => void;
  isPreviewOpen: boolean;
  setIsPreviewOpen: (isOpen: boolean) => void;
  previewContent: string;
}

export function TemplateHeader({ 
  title,
  setTitle,
  category,
  setCategory,
  isPreviewOpen,
  setIsPreviewOpen,
  previewContent
}: TemplateHeaderProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Input
        placeholder="Template Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <Select value={category} onValueChange={(value: ExtendedTemplateCategory) => setCategory(value)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cover_letter">Cover Letter</SelectItem>
          <SelectItem value="reimbursement_instructions">Reimbursement Instructions</SelectItem>
          <SelectItem value="referral_letter">Referral Letter</SelectItem>
          <SelectItem value="thank_you_note">Thank You Note</SelectItem>
          <SelectItem value="reminder_message">Reminder Message</SelectItem>
          <SelectItem value="appeal_letter">Appeal Letter</SelectItem>
          <SelectItem value="general">General</SelectItem>
        </SelectContent>
      </Select>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Preview</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-white">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewContent }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
