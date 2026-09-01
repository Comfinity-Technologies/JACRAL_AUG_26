import { useEffect, useState, useCallback, useMemo } from "react";
import { apiClient } from "../api/client";
import { useAuth } from "./useAuth";

export type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  // Merged fields for frontend rendering
  name?: string;
  category?: string;
  image?: string;
};

export type CartState = {
  id?: number;
  items: CartItem[];
  total: number;
};

export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  // Helper to fetch product details since backend cart only returns product_id
  const enrichCartItems = async (items: CartItem[]) => {
    const enriched = [...items];
    for (let i = 0; i < enriched.length; i++) {
      try {
        const res = await apiClient.get(`/api/v1/products/${enriched[i].product_id}`);
        const p = res.data;
        enriched[i].name = p.name;
        enriched[i].category = typeof p.category === "string" ? p.category : p.category?.name;
        enriched[i].image = p.image_url;
      } catch (err) {
        console.error("Failed to fetch product for cart item", err);
      }
    }
    return enriched;
  };

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.get("/api/v1/cart");
      const enrichedItems = await enrichCartItems(res.data.items || []);
      setCart({
        id: res.data.id,
        items: enrichedItems,
        total: parseFloat(res.data.total),
      });
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!user) {
      // If not logged in, they can't use the backend cart. 
      // The flow requires logging in first according to the reqs.
      window.location.href = "/login";
      return;
    }
    try {
      await apiClient.post("/api/v1/cart/items", { product_id: productId, quantity });
      await fetchCart();
    } catch (err) {
      console.error("Add to cart failed", err);
      throw err;
    }
  };

  const increaseQuantity = async (itemId: number) => {
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return;
    try {
      await apiClient.patch(`/api/v1/cart/items/${itemId}`, { quantity: item.quantity + 1 });
      await fetchCart();
    } catch (err) {
      console.error("Increase qty failed", err);
    }
  };

  const decreaseQuantity = async (itemId: number) => {
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return;
    if (item.quantity <= 1) {
      return removeFromCart(itemId);
    }
    try {
      await apiClient.patch(`/api/v1/cart/items/${itemId}`, { quantity: item.quantity - 1 });
      await fetchCart();
    } catch (err) {
      console.error("Decrease qty failed", err);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await apiClient.delete(`/api/v1/cart/items/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete("/api/v1/cart");
      await fetchCart();
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  };

  const itemCount = useMemo(
    () => cart.items.reduce((total, item) => total + item.quantity, 0),
    [cart.items]
  );

  const subtotal = cart.total;
  const delivery = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 50;
  const total = subtotal + delivery;

  return {
    items: cart.items,
    itemCount,
    subtotal,
    delivery,
    total,
    loading,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };
}