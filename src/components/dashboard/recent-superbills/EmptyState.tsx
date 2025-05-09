
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmptyStateProps } from "./types";

export function EmptyState({ statusFilter, navigateToNew }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-10 border rounded-lg bg-white">
      <p className="text-xl font-medium text-gray-500 mb-2">No superbills found</p>
      {statusFilter !== "all" ? (
        <p className="text-gray-400 mb-6">No superbills with status: {statusFilter}</p>
      ) : (
        <p className="text-gray-400 mb-6">Let's create your first superbill</p>
      )}
      <Button onClick={navigateToNew}>
        <Plus className="mr-2 h-4 w-4" />
        Create Superbill
      </Button>
    </div>
  );
}
