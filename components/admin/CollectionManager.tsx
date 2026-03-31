"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { getCollections, upsertCollection, deleteCollection } from "@/lib/actions";

export function CollectionManager() {
  const [collections, setCollections] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (err: any) {
      console.error("Failed to fetch collections:", err);
      setError(err.message || "Failed to load collections.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (collection: any = null) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({
        name: collection.name,
        handle: collection.handle,
        description: collection.description || "",
        image: collection.image || "",
      });
    } else {
      setEditingCollection(null);
      setFormData({
        name: "",
        handle: "",
        description: "",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
    setFormData({
      name: "",
      handle: "",
      description: "",
      image: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        id: editingCollection?.id,
        name: formData.name,
        handle: formData.handle,
        description: formData.description,
        image: formData.image,
      };
      await upsertCollection(payload);
      fetchCollections(); // Re-fetch collections to get the latest data
      closeModal();
    } catch (err: any) {
      console.error("Error saving collection:", err);
      setError(err.message || "Error saving collection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await deleteCollection(id);
      fetchCollections(); // Re-fetch collections
    } catch (err: any) {
      console.error("Error deleting collection:", err);
      setError(err.message || "Error deleting collection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
            Collection Management
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            {collections.length} collections currently active
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all"
        >
          <Plus size={16} />
          Add New Collection
        </button>
      </div>

      {isLoading ? (
        <p className="text-white/40 text-center py-8">Loading collections...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8">Error: {error}</p>
      ) : (
        <div className="space-y-4">
          {collections.length === 0 ? (
            <p className="text-white/40 text-center py-8">No collections found. Add a new one!</p>
          ) : (
            collections.map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-4 bg-black border border-white/5 rounded-lg group hover:border-white/20 transition-all">
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{collection.name}</h3>
                  <p className="text-xs text-white/40">{collection.handle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openModal(collection)}
                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(collection.id)}
                    className="p-2 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                {editingCollection ? "Edit Collection" : "New Collection"}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-white/40 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Collection Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Collection Handle</label>
                <input required value={formData.handle} onChange={e => setFormData({...formData, handle: e.target.value})} placeholder="e.g. summer-collection" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white min-h-[80px] focus:outline-none focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Image URL</label>
                <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="e.g. /assets/collection-banner.jpg" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent" />
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 disabled:opacity-50 transition-all">
                  {isSubmitting ? "Saving..." : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
