export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  badge?: string;
  colors?: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  productId: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
