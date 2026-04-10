"use client";

import { useState, useCallback, useRef } from "react";
import { 
  X, 
  Plus, 
  Image as ImageIcon, 
  Video, 
  Loader2, 
  GripVertical,
  Trash2,
  Play
} from "lucide-react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { API_URL } from "@/lib/api";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
}

interface MediaUploadProps {
  value: string | string[]; // Single URL or array of URLs
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  maxFiles?: number;
  minWidth?: number;
  minHeight?: number;
}

// Sub-componente para cada item da galeria (Sortable)
function SortableMediaItem({ 
  item, 
  onRemove, 
  isMain,
  disabled
}: { 
  item: MediaItem; 
  onRemove: (id: string) => void;
  isMain?: boolean;
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isVideo = item.type === "video" || item.url.match(/\.(mp4|webm|mov|avif)$/i);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-square ${
        isDragging ? "opacity-50" : ""
      } ${isMain ? "ring-2 ring-accent ring-offset-2 ring-offset-black" : ""}`}
    >
      {/* Media Preview */}
      {isVideo ? (
        <div className="w-full h-full flex items-center justify-center bg-black/40">
           <Video size={24} className="text-white/20" />
           <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <Play size={20} className="text-white/60" />
           </div>
        </div>
      ) : (
        <img 
          src={item.url} 
          alt="Preview" 
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlays & Controls */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-grab active:cursor-grabbing text-white"
          title="Reorder"
        >
          <GripVertical size={16} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="p-2 bg-rose-500/80 hover:bg-rose-500 rounded-lg text-white transition-colors"
          title="Remove"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isMain && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-black text-[8px] font-black uppercase tracking-widest rounded-full">
          Featured
        </div>
      )}
    </div>
  );
}

export function MediaUpload({ 
  value, 
  onChange, 
  multiple = false, 
  label,
  maxFiles = 10,
  minWidth,
  minHeight
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalizar valor para array de MediaItems
  const urls = Array.isArray(value) ? value : (value ? [value] : []);
  const items: MediaItem[] = urls.map((url) => ({
    id: url, // Usamos a própria URL como ID estável
    url,
    type: url.match(/\.(mp4|webm|mov|avif)$/i) ? "video" : "image"
  }));

  // Sensores para Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper para validar dimensões de imagem
  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!minWidth && !minHeight) return resolve(true);
      if (!file.type.startsWith('image/')) return resolve(true); // Pular se for vídeo

      const img = new Image();
      img.onload = () => {
        const isValid = (!minWidth || img.width >= minWidth) && 
                      (!minHeight || img.height >= minHeight);
        
        if (!isValid) {
          alert(`Qualidade insuficiente: A imagem "${file.name}" precisa ter no mínimo ${minWidth || 0}x${minHeight || 0}px. (Atual: ${img.width}x${img.height}px)`);
        }
        resolve(isValid);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    // Respeitar limite de arquivos
    const currentCount = items.length;
    const remainingCount = maxFiles - currentCount;
    const allFiles = Array.from(files).slice(0, remainingCount);

    // Validar dimensões antes de tudo
    const validFiles: File[] = [];
    for (const file of allFiles) {
      if (file.type.startsWith('image/')) {
        const isValid = await validateImage(file);
        if (isValid) validFiles.push(file);
      } else {
        validFiles.push(file); // Vídeos passam direto pela validação de pixels por enquanto
      }
    }

    if (validFiles.length === 0) {
      setUploading(false);
      return;
    }

    validFiles.forEach(file => formData.append("files", file));
    formData.append("folder", "products");

    try {
      const auth = await import("next-auth/react");
      const session = await auth.getSession();
      const token = (session?.user as any)?.token || "";

      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const { urls: newUrls } = await res.json();
      
      if (multiple) {
        onChange([...urls, ...newUrls]);
      } else {
        onChange(newUrls[0]);
      }
    } catch (error) {
      console.error("Gallery Upload Error:", error);
      alert("Falha ao subir arquivos para o R2.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [items, multiple, onChange, maxFiles, urls]);

  const handleRemove = (url: string) => {
    if (multiple) {
      onChange(urls.filter(u => u !== url));
    } else {
      onChange("");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = urls.indexOf(active.id as string);
      const newIndex = urls.indexOf(over.id as string);
      onChange(arrayMove(urls, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
          {label} {multiple && `(${urls.length}/${maxFiles})`}
        </label>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Gallery Items */}
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={rectSortingStrategy}
          >
            {items.map((item, index) => (
              <SortableMediaItem 
                key={item.id} 
                item={item} 
                onRemove={handleRemove}
                isMain={index === 0 && multiple} // A primeira foto é a principal no modo galeria
                disabled={!multiple} // Desabilitar arraste se for plano individual
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Upload Button Placeholder */}
        {urls.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 transition-all aspect-square group"
          >
            {uploading ? (
              <Loader2 size={24} className="text-accent animate-spin" />
            ) : (
              <>
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-accent group-hover:text-black transition-all mb-3 text-white/40">
                  {multiple ? <Plus size={20} /> : <ImageIcon size={20} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                  {multiple ? "Add Media" : "Upload File"}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleUpload}
        multiple={multiple}
        accept="image/*,video/*"
        className="hidden"
      />

      {multiple && urls.length > 1 && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-accent/5 border border-accent/10">
           <div className="p-1 rounded bg-accent/20 text-accent mt-0.5">
              <Plus size={10} className="rotate-45" />
           </div>
           <p className="text-[9px] text-accent/60 uppercase font-black tracking-widest leading-relaxed">
             Drag to reorder. The first item will be used as the featured product image.
           </p>
        </div>
      )}
    </div>
  );
}
