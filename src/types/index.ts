export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  contact: string;
  logo?: string;
  logoPublicId?: string;
  adminId: string;
  theme?: string;
}

export interface RestaurantAdmin {
  _id: string;
  username: string;
  password: string;
  restaurantId: string;
  restaurantName: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  image?: string;
  imagePublicId?: string;
  restaurantId: string;
  order: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  imagePublicId?: string;
  categoryId: string;
  restaurantId: string;
  available: boolean;
}

export interface Offer {
  _id: string;
  title: string;
  description: string;
  discount: number;
  tags: string[];
  restaurantId: string;
  validUntil: string;
  active: boolean;
}