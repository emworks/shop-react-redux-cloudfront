import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  count: number;
};

export type CartResponseItem = {
  id: string;
  count: number;
};

export type CartResponse = {
  data: {
    id: string;
    items: CartResponseItem[];
  };
};
