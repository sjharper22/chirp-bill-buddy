
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Variable } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { $createVariableNode } from '../../nodes/VariableNode';
import { useCallback, useState } from 'react';
import { Input } from "@/components/ui/input";

interface VariableInsertPluginProps {
  variables: Array<{ label: string; variable: string; group?: string }>;
}

export function VariableInsertPlugin({ variables }: VariableInsertPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  // Group variables by their group property
  const groupedVariables = variables.reduce<Record<string, Array<{ label: string; variable: string }>>>(
    (groups, variable) => {
      const group = variable.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(variable);
      return groups;
    },
    {}
  );
  
  // Get all available groups
  const groups = Object.keys(groupedVariables);
  
  const insertVariable = useCallback((variable: string) => {
    // Focus the editor before inserting to ensure proper placement
    editor.focus();
    
    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        const variableNode = $createVariableNode(variable);
        selection.insertNodes([variableNode]);
        
        // Properly position the cursor after the variable node
        // Instead of using 'collapse', we'll set the selection to be just after the node
        selection.anchor.set(variableNode.getKey(), variableNode.getTextContent().length, 'text');
        selection.focus.set(variableNode.getKey(), variableNode.getTextContent().length, 'text');
      }
    });
    
    // Close the popover after insertion
    setIsOpen(false);
  }, [editor]);

  // Filter variables based on search query
  const filteredVariables = searchQuery 
    ? variables.filter(v => 
        v.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.variable.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : variables;

  if (variables.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Variable className="h-4 w-4 mr-1" />
            Insert Variable
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <h4 className="font-medium mb-2">Available Variables</h4>
          
          <Input
            placeholder="Search variables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          
          {searchQuery ? (
            <ScrollArea className="h-48">
              <div className="space-y-2 p-1">
                {filteredVariables.map((item) => (
                  <Badge
                    key={item.variable}
                    variant="outline"
                    className="cursor-pointer p-1.5 text-sm hover:bg-primary/10 mr-1 mb-1 inline-block"
                    onClick={() => {
                      insertVariable(item.variable);
                    }}
                  >
                    {item.label}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          ) : groups.length > 1 ? (
            <Tabs defaultValue={groups[0]}>
              <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${Math.min(groups.length, 4)}, 1fr)` }}>
                {groups.map(group => (
                  <TabsTrigger key={group} value={group} className="text-xs">{group}</TabsTrigger>
                ))}
              </TabsList>
              
              {groups.map(group => (
                <TabsContent key={group} value={group} className="mt-2">
                  <ScrollArea className="h-48">
                    <div className="space-y-2 p-1">
                      {groupedVariables[group].map((item) => (
                        <Badge
                          key={item.variable}
                          variant="outline"
                          className="cursor-pointer p-1.5 text-sm hover:bg-primary/10 mr-1 mb-1 inline-block"
                          onClick={() => {
                            insertVariable(item.variable);
                          }}
                        >
                          {item.label}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <ScrollArea className="h-48">
              <div className="space-y-2 p-1">
                {variables.map((item) => (
                  <Badge
                    key={item.variable}
                    variant="outline"
                    className="cursor-pointer p-1.5 text-sm hover:bg-primary/10 mr-1 mb-1 inline-block"
                    onClick={() => {
                      insertVariable(item.variable);
                    }}
                  >
                    {item.label}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
