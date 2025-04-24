
import React from 'react';
import { FileEdit } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  title: string;
  type: string;
  content: string;
  isDefault?: boolean;
  onEdit: () => void;
  onUse: () => void;
}

export function TemplateCard({ 
  title, 
  type, 
  content, 
  isDefault, 
  onEdit, 
  onUse 
}: TemplateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {type} {isDefault && "• Default"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">
          {typeof content === 'string' ? content.substring(0, 100) : ''}...
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEdit}
        >
          <FileEdit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button size="sm" onClick={onUse}>
          Use
        </Button>
      </CardFooter>
    </Card>
  );
}
