
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, UserPlus } from "lucide-react";

interface EmptyStateProps {
  type?: 'patients' | 'superbills' | 'generic';
  message?: string;
  subMessage?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

export function EmptyState({ 
  type = 'generic', 
  message = "No items found",
  subMessage = "Try adjusting your search or filters",
  buttonText,
  buttonAction
}: EmptyStateProps) {
  const navigate = useNavigate();
  
  const defaultButtonAction = () => {
    switch(type) {
      case 'patients':
        navigate("/patients");
        break;
      case 'superbills':
        navigate("/new");
        break;
      default:
        navigate("/");
    }
  };
  
  const handleButtonClick = buttonAction || defaultButtonAction;
  
  const getIcon = () => {
    switch(type) {
      case 'patients':
        return <UserPlus className="h-12 w-12 mx-auto text-muted-foreground" />;
      case 'superbills':
        return <FileText className="h-12 w-12 mx-auto text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  const getDefaultButtonText = () => {
    switch(type) {
      case 'patients':
        return "Manage Patients";
      case 'superbills':
        return "Create Superbill";
      default:
        return "Go Back";
    }
  };
  
  const icon = getIcon();
  const finalButtonText = buttonText || getDefaultButtonText();
  
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      {icon}
      <p className="text-lg font-medium mb-2 mt-4">{message}</p>
      <p className="text-muted-foreground mb-6">
        {subMessage}
      </p>
      <Button onClick={handleButtonClick}>
        {finalButtonText}
      </Button>
    </div>
  );
}
