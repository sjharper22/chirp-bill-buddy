
import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MultiTagInputProps {
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: { value: string; label: string }[];
}

export function MultiTagInput({ placeholder, tags, onChange, suggestions = [] }: MultiTagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      const filtered = suggestions.filter(
        suggestion => 
          suggestion.value.toLowerCase().includes(value.toLowerCase()) || 
          suggestion.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-1 focus-within:ring-primary bg-background">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="gap-1 pl-2">
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-grow border-0 p-0 pl-1 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-background border rounded-md shadow-md">
          {filteredSuggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion.value)}
            >
              {suggestion.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
