import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { X, Upload, Plus, Trash2, Edit2, Save, RefreshCw } from 'lucide-react';
import { PRODUCTS, type Product } from '../constants';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AdminProductManagerProps {
  onClose: () => void;
}

const getDirectImageUrl = (url: string) => {
  if (!url) return '';

  if (url.includes('ibb.co/') && !url.includes('i.ibb.co')) {
    return url; 
  }

  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1]?.split('/')[0];
    return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
  }
  if (url.includes('drive.google.com/open?id=')) {
    const id = url.split('id=')[1]?.split('&')[0];
    return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
  }
  if (url.includes('drive.google.com/uc?id=')) {
    const id = url.split('id=')[1]?.split('&')[0];
    return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
  }
  return url;
};

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({ onClose }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    gujarati: '',
    hindi: '',
    category: 'pickles',
    price: 0,
    weight: '',
    badge: '',
    benefit: '',
    desc: '',
    imgColor: '#F5F5F0',
    image: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        // In the admin list, we show the RAW image for managing, but use repair for visual help
        return {
          id: doc.id,
          ...data,
          displayImage: getDirectImageUrl(data.image || '')
        };
      });
      setProducts(productsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, []);

  const syncWithDefaults = async () => {
    if (!window.confirm("This will update all existing products in your database with the latest details (images, descriptions, etc.) from the code defaults. Use this to apply the image updates you just requested. Continue?")) return;
    
    setUploading(true);
    let updatedCount = 0;
    let errorCount = 0;
    
    try {
      console.log("Starting sync with current products:", products.map(p => p.name));
      
      for (const defaultProduct of PRODUCTS) {
        const matchingProducts = products.filter(p => 
          p.name?.toLowerCase().trim() === defaultProduct.name.toLowerCase().trim()
        );
        
        if (matchingProducts.length > 0) {
          for (const existingProduct of matchingProducts) {
            console.log(`Updating ${defaultProduct.name} (DB ID: ${existingProduct.id})...`);
            const { id: _, ...rest } = defaultProduct;
            try {
              await updateDoc(doc(db, 'products', existingProduct.id), {
                ...rest,
                updatedAt: serverTimestamp()
              });
              updatedCount++;
            } catch (e) {
              console.error(`Failed to update ${defaultProduct.name}:`, e);
              errorCount++;
            }
          }
        } else {
          console.log(`Product "${defaultProduct.name}" not found in database, skipping sync.`);
        }
      }
      
      alert(`Sync finished!\n- Total database updates: ${updatedCount}\n- Errors: ${errorCount}\n- Unique defaults matched: ${PRODUCTS.length}`);
      
      if (updatedCount === 0) {
        alert("Warning: No matching products found. Try clicking 'Refresh Store' on the main page first, then try syncing again.");
      }
    } catch (error) {
      console.error("Critical sync error:", error);
      alert("A critical error occurred. Check browser console (F12) for details.");
    } finally {
      setUploading(false);
    }
  };

  const seedProducts = async () => {
    if (!window.confirm("This will add any default products that are missing from your database. Continue?")) return;
    
    setUploading(true);
    let addedCount = 0;
    let errorCount = 0;
    
    try {
      for (const p of PRODUCTS) {
        const exists = products.some(ep => 
          ep.name?.toLowerCase().trim() === p.name.toLowerCase().trim()
        );
        
        if (!exists) {
          console.log(`Adding missing product: ${p.name}...`);
          const { id: _, ...rest } = p;
          try {
            await addDoc(collection(db, 'products'), {
              ...rest,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            addedCount++;
          } catch (e) {
            console.error(`Failed to add ${p.name}:`, e);
            errorCount++;
          }
        }
      }
      alert(`Seed finished!\n- Added: ${addedCount} missing products\n- Errors: ${errorCount}`);
    } catch (error) {
      console.error("Critical seed error:", error);
      alert("A critical error occurred during seeding. Check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      console.log("Starting upload for file:", file.name, "size:", file.size);
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      console.log("Upload result:", uploadResult);
      const url = await getDownloadURL(storageRef);
      console.log("File available at:", url);
      setFormData({ ...formData, image: url });
    } catch (error: any) {
      console.error("Upload failed with error:", error);
      alert(`Image upload failed: ${error.message || 'Unknown error'}. \n\nPossible causes:\n1. Firebase Storage is not enabled.\n2. Storage Rules are blocking the upload.\n3. Network issue.`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const productData = {
        ...formData,
        image: getDirectImageUrl(formData.image),
        updatedAt: serverTimestamp()
      };
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
        setIsAdding(false);
      }
      setFormData({
        name: '', gujarati: '', hindi: '', category: 'pickles',
        price: 0, weight: '', badge: '', benefit: '',
        desc: '', imgColor: '#F5F5F0', image: ''
      });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, editingId ? `products/${editingId}` : 'products');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      gujarati: product.gujarati,
      hindi: product.hindi,
      category: product.category,
      price: product.price,
      weight: product.weight,
      badge: product.badge || '',
      benefit: product.benefit,
      desc: product.desc,
      imgColor: product.imgColor,
      image: product.image
    });
    setIsAdding(true);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gold/20 flex justify-between items-center bg-green text-white">
          <h2 className="text-2xl font-bold">Manage Products</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative">
          {uploading && (
            <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="animate-spin text-gold" size={48} />
              <p className="font-bold text-green">Processing... please wait.</p>
            </div>
          )}
          {!isAdding ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 p-4 bg-gold/5 rounded-xl border border-gold/20">
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 rounded-lg bg-green px-6 py-3 font-bold text-white hover:bg-green-dark shadow-md"
                >
                  <Plus size={20} /> Add New Product
                </button>
                <button 
                  onClick={syncWithDefaults}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-bold text-text hover:bg-gold/80 disabled:opacity-50 shadow-md"
                  title="Update existing products with newest code images/info"
                >
                  <RefreshCw size={20} className={uploading ? 'animate-spin' : ''} /> Force Sync Store (Image Update)
                </button>
                <button 
                  onClick={seedProducts}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-lg border-2 border-gold px-6 py-3 font-bold text-gold hover:bg-gold/10 disabled:opacity-50"
                  title="Add missing defaults"
                >
                  <Plus size={20} className={uploading ? 'animate-spin' : ''} /> Seed Missing Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="flex gap-4 p-4 border border-gold/20 rounded-xl bg-cream-dark">
                    <img 
                      src={p.displayImage || p.image} 
                      alt={p.name} 
                      className="h-20 w-20 object-cover rounded-lg bg-white" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const defaultProduct = PRODUCTS.find(dp => dp.name.toLowerCase().trim() === p.name.toLowerCase().trim());
                        if (defaultProduct && defaultProduct.image) {
                          const repairUrl = getDirectImageUrl(defaultProduct.image);
                          if (target.src !== repairUrl) {
                            target.src = repairUrl;
                            return;
                          }
                        }
                        target.classList.add('opacity-30'); // Keep visible but faded if truly broken
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-green">{p.name}</h4>
                      <p className="text-xs text-terra">{p.category} | ₹{p.price}</p>
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => startEdit(p)} className="p-1 text-gold hover:bg-gold/10 rounded"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-green mb-1">Product Name (English) *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-green mb-1">Gujarati Name *</label>
                    <input required type="text" value={formData.gujarati} onChange={e => setFormData({...formData, gujarati: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-green mb-1">Hindi Name</label>
                    <input type="text" value={formData.hindi} onChange={e => setFormData({...formData, hindi: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-gold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-green mb-1">Category *</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg">
                        <option value="pickles">Pickles</option>
                        <option value="drinks">Drinks</option>
                        <option value="masalas">Masalas</option>
                        <option value="wellness">Wellness</option>
                        <option value="grains">Grains</option>
                        <option value="religious">Religious</option>
                        <option value="eco">Eco</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green mb-1">Price (₹) *</label>
                      <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-green mb-1">Image URL (Direct Link) *</label>
                    <div className="flex gap-2">
                       <input 
                        type="text" 
                        placeholder="Paste image URL here..." 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                        className="flex-1 p-2 border rounded-lg outline-none focus:border-gold" 
                      />
                    </div>
                    <p className="text-[10px] text-text-muted mt-1 italic">Or use the upload button below</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-green mb-1">Image Upload (Alternative)</label>
                    <div className="flex items-center gap-4">
                      {formData.image && (
                        <div className="relative group">
                          <img 
                            src={formData.image} 
                            className="h-20 w-20 object-cover rounded-lg border shadow-sm" 
                            referrerPolicy="no-referrer"
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Invalid+URL'}
                          />
                          <button 
                            type="button" 
                            onClick={() => setFormData({...formData, image: ''})}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gold/40 rounded-lg p-4 cursor-pointer hover:bg-gold/5 transition-colors">
                        <Upload className="text-gold mb-2" />
                        <span className="text-xs text-text-muted font-medium">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-green mb-1">Weight (e.g. 500g) *</label>
                    <input required type="text" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-green mb-1">Badge (Optional)</label>
                    <input type="text" placeholder="Bestseller, Seasonal, etc." value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-green mb-1">Short Benefit *</label>
                <input required type="text" value={formData.benefit} onChange={e => setFormData({...formData, benefit: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-bold text-green mb-1">Full Description *</label>
                <textarea required rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-2 border rounded-lg"></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={uploading} className="flex-1 bg-green text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save size={20} /> {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={() => {setIsAdding(false); setEditingId(null);}} className="px-6 py-3 border border-gold text-gold rounded-lg font-bold">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
