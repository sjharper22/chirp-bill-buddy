
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { ExtendedTemplateCategory, TemplateCategory } from '@/types/template';

interface UseTemplateSaveProps {
  title: string;
  category: ExtendedTemplateCategory;
  content: string;
  onSave?: () => void;
}

export function useTemplateSave({ title, category, content, onSave }: UseTemplateSaveProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveTemplate = async () => {
    try {
      if (!user) {
        throw new Error("You must be logged in to save templates");
      }

      // Convert the extended category to a database-compatible category if needed
      let dbCategory: TemplateCategory = "general";
      if (category === "cover_letter" || category === "appeal_letter" || category === "general") {
        dbCategory = category;
      }

      const { error } = await supabase
        .from('letter_templates')
        .insert({
          title,
          content: { text: content },
          category: dbCategory,
          created_by: user.id,
          is_default: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });

      if (onSave) onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleSaveTemplate };
}
