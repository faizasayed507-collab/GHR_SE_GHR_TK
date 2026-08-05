import React, { useState } from 'react';
import { Product, Review } from '../types';
import { ShieldCheck, Star, Clock, X, ShoppingBag, Heart, MessageSquare, CheckCircle2, Video, Play, Sparkles, MapPin, Share2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onDirectBuyEscrow: (product: Product) => void;
  onOpenArtisanChat: (sellerId: string, sellerName: string) => void;
  onAddReview: (productId: string, newReview: Omit<Review, 'id' | 'date'>) => void;
  onOpenEscrowModal: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectBuyEscrow,
  onOpenArtisanChat,
  onAddReview,
  onOpenEscrowModal,
}) => {
  if (!product) return null;

  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [showAddReview, setShowAddReview] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !reviewerName.trim()) return;

    onAddReview(product.id, {
      userName: reviewerName,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rating: newRating,
      comment: newComment,
      verifiedBuyer: true,
    });

    setNewComment('');
    setReviewerName('');
    setShowAddReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#4A3F35]/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/30 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="p-4 border-b border-[#F2E8E1] flex items-center justify-between bg-[#FBF7F4]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4A3F35]">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9F5] border border-[#D4AF37]/30 text-[#D4AF37]">
              {product.category}
            </span>
            <span className="text-[#A69689]">•</span>
            <span className="text-[#8C7B6C]">Item ID: #{product.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8C7B6C] hover:text-[#4A3F35] rounded-full hover:bg-[#F2E8E1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-3">
              {/* Main Preview Container */}
              <div className="relative aspect-square rounded-2xl bg-[#FBF7F4] overflow-hidden border border-[#F2E8E1]">
                {isPlayingVideo && product.videoUrl ? (
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={product.images[activeMediaIndex] || product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Video Overlay Tag */}
                {product.videoUrl && activeMediaIndex === 0 && !isPlayingVideo && (
                  <button
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 bg-[#4A3F35]/40 hover:bg-[#4A3F35]/50 transition-colors flex flex-col items-center justify-center text-white gap-2"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Watch Artisan Video Demo
                    </span>
                  </button>
                )}
              </div>

              {/* Thumbnails list */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsPlayingVideo(false);
                      setActiveMediaIndex(idx);
                    }}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeMediaIndex === idx && !isPlayingVideo
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                        : 'border-[#F2E8E1] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}

                {product.videoUrl && (
                  <button
                    onClick={() => setIsPlayingVideo(true)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#4A3F35] flex flex-col items-center justify-center text-[#D4AF37] ${
                      isPlayingVideo
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                        : 'border-[#F2E8E1] opacity-80'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span className="text-[9px] font-bold uppercase mt-0.5">Video</span>
                  </button>
                )}
              </div>
            </div>

            {/* Product Info Column */}
            <div className="md:col-span-6 space-y-4">
              {/* Seller Header */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#F2E8E1]">
                <div className="flex items-center gap-2.5">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3F35]">
                      <span>{product.seller.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                    </div>
                    <div className="text-[11px] text-[#8C7B6C] font-medium flex items-center gap-1">
                      <span>{product.seller.homeBusinessName || product.seller.shopName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#A69689]" />
                        {product.seller.city}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenArtisanChat(product.seller.id, product.seller.name)}
                  className="px-3 py-1.5 bg-white hover:bg-[#FBF7F4] border border-[#F2E8E1] text-[#4A3F35] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Chat</span>
                </button>
              </div>

              {/* Title & Rating */}
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A3F35]">
                  {product.title}
                </h2>

                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 bg-[#FFF9F5] text-[#4A3F35] px-2 py-0.5 rounded-full font-bold border border-[#D4AF37]/30">
                    <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                    <span>{product.rating} Rating</span>
                  </div>
                  <span className="text-[#A69689]">•</span>
                  <span className="text-[#8C7B6C] font-medium">
                    {product.reviews.length} Verified Buyer Reviews
                  </span>
                </div>
              </div>

              {/* Price & Craft Time */}
              <div className="flex items-baseline justify-between py-3 border-y border-[#F2E8E1]">
                <div>
                  <span className="text-xs text-[#A69689] block font-medium">Price in PKR</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-serif font-bold text-[#D4AF37]">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#A69689] line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#8C7B6C] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{product.craftTime}</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">
                    In Stock ({product.stockQuantity} items left)
                  </span>
                </div>
              </div>

              {/* Seller Verification Block */}
              <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4A3F35] uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Verified Homepreneur Protection</span>
                  </div>
                  <button
                    onClick={onOpenEscrowModal}
                    className="text-[11px] font-semibold text-[#D4AF37] underline hover:text-[#AA820A]"
                  >
                    Learn More
                  </button>
                </div>
                <ul className="grid grid-cols-2 gap-2 text-[11px] text-[#8C7B6C]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>CNIC & Address Checked</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Handmade Inspection</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Escrow Payment Lock</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>48h Return Guarantee</span>
                  </li>
                </ul>
              </div>

              {/* Materials */}
              <div>
                <span className="text-xs font-bold text-[#4A3F35] uppercase tracking-wider block mb-1.5">
                  Artisan Materials
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-[#FFF9F5] text-[#8C7B6C] text-xs font-medium border border-[#F2E8E1]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-xs font-bold text-[#4A3F35] uppercase tracking-wider block mb-1">
                  Craft Description
                </span>
                <p className="text-xs sm:text-sm text-[#8C7B6C] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-[#F2E8E1] rounded-xl overflow-hidden bg-[#FBF7F4]">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-[#4A3F35] hover:bg-[#F2E8E1] text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-[#4A3F35]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                      className="px-3 py-2 text-[#4A3F35] hover:bg-[#F2E8E1] text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                    }}
                    className="flex-1 py-3 bg-[#FBF7F4] hover:bg-[#F2E8E1] text-[#4A3F35] font-semibold text-xs sm:text-sm rounded-xl transition-colors border border-[#F2E8E1] flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onDirectBuyEscrow(product);
                  }}
                  className="w-full py-3.5 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  <span>Buy via Safe Escrow Protection (Rs. {(product.price * quantity).toLocaleString()})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Verified Reviews Section */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                  <span>Verified Buyer Reviews</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-sans font-bold">
                    ✓ 100% Real Purchases
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Reviews are exclusively recorded after escrow payment release.
                </p>
              </div>

              <button
                onClick={() => setShowAddReview(!showAddReview)}
                className="px-3 py-1.5 text-xs font-bold text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
              >
                {showAddReview ? 'Cancel' : '+ Write Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {showAddReview && (
              <form onSubmit={handleReviewSubmit} className="mb-6 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase text-stone-800">Add Your Verified Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="w-full bg-white px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 font-medium">Rating:</span>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="bg-white px-3 py-2 text-xs rounded-lg border border-stone-200 font-bold"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                </div>
                <textarea
                  placeholder="Share your experience with this handmade creation..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-white p-3 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-900 text-white text-xs font-bold rounded-lg hover:bg-rose-800"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {product.reviews.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No reviews yet for this newly added item.</p>
            ) : (
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-7 h-7 rounded-full object-cover border border-stone-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">{rev.userName}</span>
                          {rev.verifiedBuyer && (
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                              ✓ Verified Escrow Buyer
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-stone-400">
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-500" />
                          ))}
                        </div>
                        <span className="ml-1 text-[11px]">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed pl-9">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
