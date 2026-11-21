import { supabase } from './supabase';
import { Product, Seller } from '../types';

const AVATAR =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400';

export const rowToProduct = (r: any, seller: Seller): Product => ({
  id: r.id,
  title: r.title,
  category: r.category,
  price: Number(r.price),
  originalPrice: r.original_price ? Number(r.original_price) : undefined,
  images: r.images && r.images.length ? r.images : [],
  videoUrl: r.video_url || undefined,
  sellerId: r.seller_id,
  seller,
  rating: 0,
  reviewCount: 0,
  description: r.description || '',
  materials: r.materials || undefined,
  craftTime: r.craft_time || undefined,
  inStock: r.in_stock,
  stockQuantity: r.stock_quantity,
  featured: r.featured,
  reviews: [],
  createdAt: r.created_at,
});

export const sellerFromProfile = (p: any): Seller => ({
  id: p.id,
  name: p.name,
  homeBusinessName: p.home_business_name || p.name,
  shopName: p.home_business_name || p.name,
  avatar: p.avatar || AVATAR,
  city: p.city || '',
  verified: p.verification_status === 'Verified',
  verificationStatus: p.verification_status,
  bio: p.bio || '',
  rating: 0,
  totalSales: 0,
  joinedYear: p.created_at ? String(new Date(p.created_at).getFullYear()) : '2026',
});

export async function fetchAllProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data: rows, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !rows) {
    console.warn('fetch products failed:', error?.message);
    return [];
  }
  const ids = [...new Set(rows.map((r: any) => r.seller_id))];
  if (ids.length === 0) return [];
  const { data: sellers } = await supabase
    .from('seller_public')
    .select('*')
    .in('id', ids);
  const map = new Map<string, Seller>();
  (sellers || []).forEach((s: any) => map.set(s.id, sellerFromProfile(s)));
  return rows
    .filter((r: any) => map.has(r.seller_id))
    .map((r: any) => rowToProduct(r, map.get(r.seller_id)!));
}

export async function insertProduct(p: Product): Promise<Product | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: p.sellerId,
      title: p.title,
      category: p.category,
      price: p.price,
      original_price: p.originalPrice ?? null,
      images: p.images,
      video_url: p.videoUrl ?? null,
      description: p.description,
      materials: p.materials ?? null,
      craft_time: p.craftTime ?? null,
      in_stock: p.inStock,
      stock_quantity: p.stockQuantity,
    })
    .select('*')
    .single();
  if (error || !data) {
    alert('Product save failed: ' + (error?.message || 'unknown error'));
    return null;
  }
  return rowToProduct(data, p.seller);
}

export async function updateProductRow(p: Product): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('products')
    .update({
      title: p.title,
      category: p.category,
      price: p.price,
      original_price: p.originalPrice ?? null,
      images: p.images,
      video_url: p.videoUrl ?? null,
      description: p.description,
      materials: p.materials ?? null,
      craft_time: p.craftTime ?? null,
      in_stock: p.inStock,
      stock_quantity: p.stockQuantity,
    })
    .eq('id', p.id);
  if (error) alert('Update failed: ' + error.message);
  return !error;
}

export async function deleteProductRow(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) alert('Delete failed: ' + error.message);
  return !error;
}