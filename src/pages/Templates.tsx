
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MultiTagInput } from "@/components/MultiTagInput";
import { Textarea } from "@/components/ui/textarea";
import { LayoutTemplate, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Template mock data
const initialTemplates = [
  {
    id: "1",
    name: "Prenatal Care",
    description: "Standard prenatal care visit with common codes",
    icdCodes: ["O20.0", "Z34.90", "Z3A.20"],
    cptCodes: ["99213", "76801"],
    fee: 150.00,
    notes: "Routine prenatal checkup with ultrasound."
  },
  {
    id: "2",
    name: "Lower Back Pain",
    description: "Common codes for lower back pain evaluation",
    icdCodes: ["M54.5", "M51.2", "M99.03"],
    cptCodes: ["99202", "97110", "97140"],
    fee: 125.00,
    notes: "Initial assessment with therapeutic exercises and manual therapy."
  }
];

interface Template {
  id: string;
  name: string;
  description: string;
  icdCodes: string[];
  cptCodes: string[];
  fee: number;
  notes: string;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template>({
    id: "",
    name: "",
    description: "",
    icdCodes: [],
    cptCodes: [],
    fee: 0,
    notes: ""
  });
  
  const handleCreateOrEdit = () => {
    if (isEditing) {
      // Update existing template
      setTemplates(prev => prev.map(t => t.id === currentTemplate.id ? currentTemplate : t));
      toast({
        title: "Template Updated",
        description: `${currentTemplate.name} has been updated successfully.`
      });
    } else {
      // Create new template
      const newTemplate = {
        ...currentTemplate,
        id: crypto.randomUUID()
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast({
        title: "Template Created",
        description: `${newTemplate.name} has been created successfully.`
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleEdit = (template: Template) => {
    setIsEditing(true);
    setCurrentTemplate(template);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Template Deleted",
      description: "The template has been deleted successfully."
    });
  };
  
  const resetForm = () => {
    setCurrentTemplate({
      id: "",
      name: "",
      description: "",
      icdCodes: [],
      cptCodes: [],
      fee: 0,
      notes: ""
    });
    setIsEditing(false);
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable code bundles for common visit types
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Template" : "Create New Template"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Update your template details below." : "Create a reusable template for common visits."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Template Name</Label>
                <Input 
                  id="name" 
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                  placeholder="E.g., Prenatal Visit, Lower Back Pain"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={currentTemplate.description}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, description: e.target.value})}
                  placeholder="Brief description of when to use this template"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="icdCodes">ICD-10 Codes</Label>
                <MultiTagInput
                  placeholder="Add ICD-10 codes..."
                  value={currentTemplate.icdCodes}
                  onChange={(codes) => setCurrentTemplate({...currentTemplate, icdCodes: codes})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cptCodes">CPT Codes</Label>
                <MultiTagInput
                  placeholder="Add CPT codes..."
                  value={currentTemplate.cptCodes}
                  onChange={(codes) => setCurrentTemplate({...currentTemplate, cptCodes: codes})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fee">Default Fee</Label>
                <Input 
                  id="fee" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentTemplate.fee || ""}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, fee: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Template Notes</Label>
                <Textarea 
                  id="notes" 
                  value={currentTemplate.notes}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, notes: e.target.value})}
                  placeholder="Additional notes or instructions for this template..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrEdit}>
                {isEditing ? "Save Changes" : "Create Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="p-0 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <LayoutTemplate className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">ICD-10 Codes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.icdCodes.map((code) => (
                        <div key={code} className="bg-muted px-2 py-1 rounded text-xs">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">CPT Codes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.cptCodes.map((code) => (
                        <div key={code} className="bg-muted px-2 py-1 rounded text-xs">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Default Fee</p>
                    <p className="text-sm">${template.fee.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {templates.length === 0 && (
            <div className="text-center py-16 bg-white border rounded-lg shadow-sm">
              <div className="max-w-md mx-auto">
                <LayoutTemplate className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No templates found</h3>
                <p className="mt-1 text-gray-500">
                  Create your first template to save time with common visit types
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Template
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent" className="p-0 mt-4">
          <div className="text-center py-16 bg-white border rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900">No recent usage</h3>
              <p className="mt-1 text-gray-500">
                Recently used templates will appear here
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
