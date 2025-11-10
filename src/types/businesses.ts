// types/api.ts

// Public-safe user for embedding into business items
export interface UserPublic {
  id: number;
  name: string;
  phone?: string | null;
  // add email here only if your resource exposes it
  // email?: string;
}

// Normalized images block coming from BusinessResource
export interface BusinessImages {
  thumb: string | null;
  card: string | null;
  original: string | null;
}

// Business DTO returned by BusinessResource
export interface Business {
  id: number;
  name: string;
  type: string;
  description: string | null;
  images: BusinessImages;
  // Backend returns `owner` in BusinessResource
  owner?: UserPublic | null;
}

// Order item as returned in "myRequests" (normalized in controller)
export interface Order {
  id: number | string; // if it's int in DB, prefer number
  name: string;
  description: string;
  date: string;
  phone: string;
  is_read: boolean;
  business_id: number;
  business_name: string;
  business_image: string | null; // can be null if no image
  // created_at?: string; // add if you use it on UI
}

// Flat pagination block returned by the backend
export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  has_more: boolean;
}

// Full response of GET /api/businesses (flat shape)
export interface BusinessResponse {
  businesses: Business[];   // <-- array, not a single Business
  pagination: Pagination;
  types: string[];          // required if backend always returns it
  unreadCount: number;
  myRequests: Order[];
  myProjects: boolean;      // use boolean, not number
}
