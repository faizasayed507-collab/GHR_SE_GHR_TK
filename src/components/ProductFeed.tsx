import React, { useState } from 'react';
import { Product, Category } from '../types';
import { ShieldCheck, Star, Video, ShoppingBag, Heart, Eye, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ProductFeedProps {
  products: Product[];
  selectedCategory: Category;
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onDirectBuyEscrow: (product: Product) => void;
  onToggleSaved: (productId: string) => void;
  savedProductIds: string[];
}

export const ProductFeed: React.FC<ProductFeedProps> = ({
  products,
  selectedCategory,
  searchQuery,
  onSelectProduct,
  onAddToCart,
  onDirectBuyEscrow,
  onToggleSaved,
  savedProductIds,
}) => {
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(12000);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price <= maxPrice;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <section id="product-feed" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>Handmade Collection</span>
            <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              {sortedProducts.length} Items
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            100% authentic home-crafted products, protected by Ghar Se Ghar Tak Escrow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Price Range Quick Filter */}
          <div className="hidden md:flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 text-xs">
            <span className="text-stone-500 font-medium">Under:</span>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value={12000}>All Prices</option>
              <option value={3000}>Under Rs. 3,000</option>
              <option value={5000}>Under Rs. 5,000</option>
              <option value={8000}>Under Rs. 8,000</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 ? (
        <div className="py-16 text-center bento-card p-8">
          <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-[#4A3F35]">No products found</h3>
          <p className="text-xs text-[#8C7B6C] mt-1 max-w-md mx-auto">
            Try adjusting your search keywords or price filter to discover more creations from our homepreneurs.
          </p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const isSaved = savedProductIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="bento-card overflow-hidden flex flex-col justify-between group relative"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 sm:aspect-square bg-[#FBF7F4] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#4A3F35]/80 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
                      {product.category}
                    </span>
                    {product.videoUrl && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-white text-[10px] font-medium flex items-center gap-1 backdrop-blur-md">
                        <Video className="w-3 h-3" />
                        <span>Video Demo</span>
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onToggleSaved(product.id)}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
                      isSaved
                        ? 'bg-[#D4AF37] text-white'
                        : 'bg-white/80 text-[#8C7B6C] hover:bg-white hover:text-[#D4AF37]'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save Item'}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                  </button>

                  {/* Quick View Button on Hover */}
                  <div className="absolute inset-0 bg-[#4A3F35]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-4 py-2 bg-white text-[#4A3F35] font-semibold text-xs rounded-xl shadow-md hover:bg-[#FFF9F5] transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Seller Badge & City */}
                    <div className="flex items-center justify-between text-xs text-[#8C7B6C] mb-1.5">
                      <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[150px]">
                          Sold by {product.seller?.homeBusinessName || product.seller?.shopName || product.seller?.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#A69689]">
                        {product.seller.city}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif font-bold text-[#4A3F35] text-sm group-hover:text-[#D4AF37] transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {product.title}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <div className="flex items-center gap-1 bg-[#FFF9F5] text-[#4A3F35] px-1.5 py-0.5 rounded-full font-bold border border-[#D4AF37]/30">
                        <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-[#A69689] text-[11px]">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Price & Primary Escrow Action */}
                  <div className="mt-4 pt-3 border-t border-[#F2E8E1] flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-[#A69689] font-medium">PKR</div>
                      <div className="text-base font-bold font-serif text-[#D4AF37]">
                        Rs. {product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[11px] text-[#A69689] line-through">
                          Rs. {product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="p-2 text-[#4A3F35] bg-[#FBF7F4] hover:bg-[#FFF0F0] hover:text-[#D4AF37] rounded-xl transition-colors border border-[#F2E8E1]"
                        title="Add to Shopping Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDirectBuyEscrow(product)}
                        className="px-3.5 py-2 bg-[#4A3F35] hover:bg-[#382F27] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                      >
                        Quick Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
