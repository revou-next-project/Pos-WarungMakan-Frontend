/**
 * API client for interacting with the backend
 */

import { UserData } from "@/app/models/UserData";
import { getTokenFromCookies } from "./utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URLL || "http://localhost:8000";


// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Try to get error message from response
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.error|| `API error: ${response.status}`;
      
    } catch (e) {
      errorMessage = `API error: ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Products API
export const productsAPI = {
  getAll: (category?: string) => {
    const query = category ? `?category=${category}` : "";
    return fetchAPI<Product[]>(`/products${query}`);
  },

  getById: (id: number) => {
    return fetchAPI<Product>(`/products/${id}`);
  },

  create: (product: ProductCreate) => {
    return fetchAPI<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  update: (id: number, product: Partial<ProductCreate>) => {
    return fetchAPI<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },

  delete: (id: number) => {
    return fetchAPI<void>(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return fetchAPI<Order[]>(`/orders${query}`);
  },

  getById: (id: string) => {
    return fetchAPI<Order>(`/orders/${id}`);
  },

  create: (order: OrderCreate) => {
    return fetchAPI<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    });
  },

  updateStatus: (id: string, status: string) => {
    return fetchAPI<Order>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: (params?: { category?: string; lowStock?: boolean }) => {
    const queryParams = [];
    if (params?.category) queryParams.push(`category=${params.category}`);
    if (params?.lowStock) queryParams.push("low_stock=true");

    const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    return fetchAPI<InventoryItem[]>(`/inventory${query}`);
  },

  getById: (id: number) => {
    return fetchAPI<InventoryItem>(`/inventory/${id}`);
  },

  create: (item: InventoryItemCreate) => {
    return fetchAPI<InventoryItem>("/inventory", {
      method: "POST",
      body: JSON.stringify(item),
    });
  },

  update: (id: number, item: Partial<InventoryItemCreate>) => {
    return fetchAPI<InventoryItem>(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    });
  },
};

// Auth API
export const authAPI = {
  login: (username: string, password: string) => {
    return fetchAPI<{
      access_token: any; token: string 
}>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
};

export const usersAPI = {
  getAll: () => {
    const token = getTokenFromCookies();
    return fetchAPI<UserData[]>(`/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateUser: (id: number, user: Partial<UserData>) => {
    const token = getTokenFromCookies();
    return fetchAPI<UserData>(`/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
  },
  createUser: (user: UserData) => {
    return fetchAPI<UserData>("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  deleteUser: (id: number) => {
    const token = getTokenFromCookies();
    return fetchAPI<void>(`/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};

// Type definitions
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  is_package: boolean;
  image?: string;
}

export type ProductCreate = Omit<Product, "id">;

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderItemCreate {
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  order_number: string;
  timestamp: string;
  status: "waiting" | "cooking" | "completed" | "canceled";
  order_type: "Dine In" | "GoFood" | "Grab" | "Shopee" | "Other";
  total_amount: number;
  items: OrderItem[];
}

export interface OrderCreate {
  order_number: string;
  timestamp: string;
  status: "waiting" | "cooking" | "completed" | "canceled";
  order_type: "Dine In" | "GoFood" | "Grab" | "Shopee" | "Other";
  total_amount: number;
  items: OrderItemCreate[];
}

export interface InventoryItem {
  id: number;
  name: string;
  current_stock: number;
  unit: string;
  min_threshold: number;
  last_updated: string;
  category: string;
}

export type InventoryItemCreate = Omit<InventoryItem, "id" | "last_updated">;

export interface Users {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export type UserLogin = Omit<Users, "name" | "password">;