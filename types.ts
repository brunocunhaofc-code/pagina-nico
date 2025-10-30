export interface Product {
  id?: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  images: string[];
  isBestSeller: boolean;
  isMale: boolean;
  isFemale: boolean;
  created_at?: string;
}
