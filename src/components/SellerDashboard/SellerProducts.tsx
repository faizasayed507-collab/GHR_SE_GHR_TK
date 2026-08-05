import React, { useState } from 'react';
import { Product, Category, Seller } from '../../types';
import { Plus, Trash2, Edit3, Upload, X, AlertCircle, Camera, Check, Eye } from 'lucide-react';

interface SellerProductsProps {
  products: Product[];
  sellerId: string;
  seller?: Seller;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleStock: (productId: string) => void;
}

export const SellerProducts: React.FC<SellerProductsProps> = ({
  products,
  sellerId,
  seller,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStock,
}) => {
  const sellerProducts = products.filter((p) => p.sellerId === sellerId || p.seller?.id === sellerId);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Exclude<Category, 'All'>>('Clothing');
  const [price, setPrice] = useState<number | ''>(3500);
  const [description, setDescription] = useState<string>('');
  const [materials, setMaterials] = useState<string>('Pure Silk, Hand Stitch');
  const [craftTime, setCraftTime] = useState<string>('2-3 days handcrafting');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [formError, setFormError] = useState<string>('');

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('Clothing');
    setPrice(3500);
    setDescription('');
    setMaterials('Pure Silk, Hand Stitch');
    setCraftTime('2-3 days handcrafting');
    setPhotoUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800');
    setStockQuantity(10);
    setFormError('');
    setShowAddModal(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setCategory(prod.category);
    setPrice(prod.price);
    setDescription(prod.description);
    setMaterials(prod.materials?.join(', ') || 'Handmade');
    setCraftTime(prod.craftTime || '2-3 days handcrafting');
    setPhotoUrl(prod.images[0] || '');
    setStockQuantity(prod.stockQuantity || 10);
    setFormError('');
    setShowAddModal(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size should be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setFormError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a product title.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setFormError('Please enter a valid price in PKR.');
      return;
    }
    if (!photoUrl.trim()) {
      setFormError('Please upload or provide a real photo of your actual product.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a short description of your handcrafted product.');
      return;
    }

    const currentSellerInfo: Seller = seller || {
      id: sellerId,
      name: 'Fatima Zahra',
      homeBusinessName: 'Multani Dhaaga Crafts',
      shopName: 'Multani Dhaaga Crafts',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      city: 'Multan',
      verified: true,
      verificationStatus: 'Verified',
      bio: 'Authentic handmade creations from home.',
      rating: 5.0,
      totalSales: 12,
      joinedYear: '2026',
    };

    const materialsArray = materials.split(',').map((m) => m.trim()).filter(Boolean);

    if (editingProduct) {
      // Update existing
      const updated: Product = {
        ...editingProduct,
        title: title.trim(),
        category,
        price: Number(price),
        images: [photoUrl],
        description: description.trim(),
        materials: materialsArray.length > 0 ? materialsArray : ['Handmade'],
        craftTime,
        stockQuantity: Number(stockQuantity),
        seller: currentSellerInfo,
      };
      if (onUpdateProduct) {
        onUpdateProduct(updated);
      }
    } else {
      // Add new
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: title.trim(),
        category,
        price: Number(price),
        images: [photoUrl],
        sellerId,
        seller: currentSellerInfo,
        rating: 5.0,
        reviewCount: 0,
        description: description.trim(),
        materials: materialsArray.length > 0 ? materialsArray : ['Handmade'],
        craftTime,
        inStock: true,
        stockQuantity: Number(stockQuantity),
        reviews: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddProduct(newProd);
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900">
            My Home Business Products ({sellerProducts.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            List your handmade items with real photographs and set your prices in PKR.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#4A3F35] hover:bg-[#382F27] text-[#F2E8E1] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Product Grid */}
      {sellerProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F2] text-[#D4AF37] mx-auto flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-stone-800 text-base">No Products Listed Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click "+ Add New Product" above to list your first handcrafted product with real photos.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#4A3F35] text-white text-xs font-bold rounded-xl"
          >
            List First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                  {prod.category}
                </span>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                  <button
                    onClick={() => onToggleStock(prod.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-xs ${
                      prod.inStock
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {prod.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm line-clamp-1">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {prod.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#4A3F35] text-base">
                      Rs. {prod.price.toLocaleString()}
                    </span>
                    <span className="text-stone-500 font-medium">
                      Stock: <strong>{prod.stockQuantity}</strong>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">{prod.craftTime || 'Handcrafted'}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 text-stone-600 hover:text-[#4A3F35] hover:bg-stone-100 rounded-lg transition-colors"
                      title="Edit product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(prod.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#F2E8E1] flex flex-col max-h-[92vh]">
            <div className="bg-[#4A3F35] p-4 text-white flex items-center justify-between border-b border-[#D4AF37]/30">
              <h2 className="text-base font-serif font-bold text-[#F2E8E1] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>{editingProduct ? 'Edit Product' : 'Add New Handcrafted Product'}</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hand-embroidered Gota Pati Velvet Suit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#FAF6F2] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#F2E8E1] focus:outline-none focus:border-[#D4AF37] text-[#4A3F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#FAF6F2] px-3 py-2.5 text-xs rounded-xl border border-[#F2E8E1] focus:outline-none focus:border-[#D4AF37] font-medium text-[#4A3F35]"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Perfumes">Perfumes</option>
                    <option value="Gift Baskets">Gift Baskets</option>
                    <option value="Home Decor">Home Decor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full bg-[#FAF6F2] px-3 py-2.5 text-xs rounded-xl border border-[#F2E8E1] focus:outline-none focus:border-[#D4AF37] font-bold text-[#4A3F35]"
                  />
                </div>
              </div>

              {/* Real Product Image Upload Field with Notice Banner */}
              <div className="p-3.5 bg-[#FFF9F5] border border-[#D4AF37]/30 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider">
                  Product Image Upload *
                </label>

                {/* Important Notice Banner */}
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium flex items-start gap-2">
                  <Camera className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Photo Requirement:</strong> Please upload a real photo of your actual handcrafted product — no stock or internet images allowed.
                  </span>
                </div>

                {photoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#D4AF37] h-36 bg-black/5 flex items-center justify-center">
                    <img src={photoUrl} alt="Product Preview" className="h-full w-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] px-2 py-1 rounded-md font-bold shadow"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] bg-white rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                    <Upload className="w-6 h-6 text-[#D4AF37] mb-1" />
                    <span className="text-xs font-bold text-[#4A3F35]">Upload Real Product Photo</span>
                    <span className="text-[10px] text-[#8C7B6C] mt-0.5">Click or drag image file from your device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Optional Image URL fallback */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#8C7B6C] block mb-1 font-medium">Or enter Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 text-xs rounded-xl border border-[#F2E8E1] text-[#4A3F35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                  Short Description *
                </label>
                <textarea
                  placeholder="Describe your handstitching technique, fabric details, colors, and craftsmanship..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-[#FAF6F2] p-3 text-xs rounded-xl border border-[#F2E8E1] focus:outline-none focus:border-[#D4AF37] text-[#4A3F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                    Crafting Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 3 days to handcraft"
                    value={craftTime}
                    onChange={(e) => setCraftTime(e.target.value)}
                    className="w-full bg-[#FAF6F2] px-3 py-2 text-xs rounded-xl border border-[#F2E8E1] text-[#4A3F35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full bg-[#FAF6F2] px-3 py-2 text-xs rounded-xl border border-[#F2E8E1] font-bold text-[#4A3F35]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
