import { getCollections, getProducts, deleteCollection } from "@/lib/actions";
import { Plus, Layout, Trash2, Edit3, Package } from "lucide-react";
import { CollectionFormWrapper } from "@/components/admin/CollectionFormWrapper";

export default async function CollectionsPage() {
  const collections = await getCollections();
  const products = await getProducts();

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
            Collections
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Manage your store's categories and product groups
          </p>
        </div>
        
        <CollectionFormWrapper products={products} />
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection: any) => {
          const collectionProducts = products.filter((p: any) => p.collection === collection.name);
          
          return (
            <div key={collection.id} className="p-8 bg-black border border-white/5 rounded-3xl shadow-2xl transition-all hover:border-white/10 group flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                    <Layout size={24} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                     <CollectionFormWrapper 
                        collection={collection} 
                        products={products} 
                        isEdit 
                      />
                      <form action={async () => {
                        "use server";
                        await deleteCollection(collection.id);
                      }}>
                        <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/20 hover:text-red-400 bg-transparent border-none cursor-pointer">
                            <Trash2 size={16} />
                        </button>
                      </form>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      {collection.name}
                    </h3>
                  </div>
                  <p className="text-xs text-white/40 font-medium leading-relaxed line-clamp-2">
                    {collection.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-white/20" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    {collectionProducts.length} Products
                  </span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
                  /{collection.handle}
                </div>
              </div>
            </div>
          );
        })}

        {collections.length === 0 && (
          <div className="col-span-full py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Layout size={48} className="text-white/5 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-white/20">
              No collections found in database
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
