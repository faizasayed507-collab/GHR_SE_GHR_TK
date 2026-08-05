export type Category = 'All' | 'Clothing' | 'Jewellery' | 'Perfumes' | 'Gift Baskets' | 'Home Decor';

export type OrderStatus = 'Pending' | 'In Escrow' | 'Shipped' | 'Delivered' | 'Payment Released';

export type VerificationStatus = 'Pending Admin Review' | 'Verified' | 'Rejected' | 'Pending CNIC Verification' | 'Unverified';

export interface Seller {
  id: string;
  name: string;
  homeBusinessName: string;
  shopName?: string; // Legacy alias for homeBusinessName
  avatar: string;
  coverImage?: string;
  city: string;
  verified: boolean;
  verificationStatus?: VerificationStatus;
  verificationDate?: string;
  bio: string;
  story?: string;
  rating: number;
  totalSales: number;
  craftSpecialty?: string;
  joinedYear: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  photos?: string[];
}

export interface Product {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  price: number; // in PKR
  originalPrice?: number;
  images: string[];
  videoUrl?: string;
  sellerId: string;
  seller: Seller;
  rating: number;
  reviewCount: number;
  description: string;
  materials?: string[];
  craftTime?: string; // e.g., "3 days to craft"
  inStock: boolean;
  stockQuantity: number;
  featured?: boolean;
  isHomepreneurOfWeek?: boolean;
  reviews: Review[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | 'Card Escrow';
  escrowReleaseDate?: string;
  trackingNumber?: string;
  courierName?: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'escrow_hold' | 'escrow_release' | 'withdrawal';
  status: 'Completed' | 'Pending' | 'In Escrow';
  method?: string;
}

export type UserRole = 'buyer' | 'seller';

export interface UserAccount {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  emailOrPhone: string;
  password?: string;
  role: UserRole;
  cnicNumber?: string;
  cnicImage?: string;
  address?: string;
  city?: string;
  homeBusinessName?: string;
  shopName?: string; // Legacy alias
  bio?: string;
  verificationStatus?: VerificationStatus;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  avatar?: string;
  createdAt?: string;
}


