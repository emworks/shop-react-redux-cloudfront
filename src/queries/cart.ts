import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem, CartResponse } from "~/models/CartItem";
import { AvailableProduct } from "~/models/Product";

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const cartRes = await axios.get<CartResponse>(
      `${API_PATHS.cart}/profile/cart`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );

    const productRes = await axios.get<AvailableProduct[]>(
      `${API_PATHS.bff}/products`
    );

    return cartRes.data.data.items.map(({ id, count }) => {
      const product = productRes.data.find((product) => product.id == id);
      return {
        product: {
          id,
          title: product?.title ?? id,
          description: product?.description ?? id,
          price: product?.price ?? Number(id),
        },
        count,
      };
    });
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put<CartItem[]>(`${API_PATHS.cart}/profile/cart`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
