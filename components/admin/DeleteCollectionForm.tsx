"use client";

import { deleteCollection } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export function DeleteCollectionForm({ 
  collectionId, 
  collectionName 
}: { 
  collectionId: string; 
  collectionName: string 
}) {
  return (
    <form 
      action={deleteCollection.bind(null, collectionId)}
      onSubmit={(e) => {
        if (!confirm(`Are you sure you want to delete the "${collectionName}" collection?`)) {
          e.preventDefault();
        }
      }}
    >
      <button 
        type="submit" 
        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/20 hover:text-red-400 bg-transparent border-none cursor-pointer"
        title="Delete collection"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}