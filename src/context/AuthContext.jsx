import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("falstep_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("falstep_token") || null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch orders for current user or all orders for admin
  const fetchOrders = useCallback(async (userToFetch = user) => {
    if (!userToFetch) {
      setOrders([]);
      return;
    }

    setIsLoadingOrders(true);
    try {
      const isAdm = userToFetch.role === "admin";
      const url = isAdm ? "/api/orders?all=true" : `/api/orders?email=${encodeURIComponent(userToFetch.email)}`;
      const res = await fetch(url, {
        headers: {
          "x-user-email": userToFetch.email,
          "x-user-role": userToFetch.role || "customer",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user]);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("falstep_user", JSON.stringify(user));
      fetchOrders(user);
    } else {
      localStorage.removeItem("falstep_user");
      localStorage.removeItem("falstep_token");
      setOrders([]);
    }
  }, [user, fetchOrders]);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Erro ao iniciar sessão.");
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("falstep_token", data.token);
    setIsAuthModalOpen(false);
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Erro ao criar conta.");
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("falstep_token", data.token);
    setIsAuthModalOpen(false);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOrders([]);
    localStorage.removeItem("falstep_user");
    localStorage.removeItem("falstep_token");
  };

  // Save new order to server
  const saveOrder = async (orderPayload) => {
    try {
      const payload = {
        ...orderPayload,
        userId: user ? user.id : null,
        customerEmail: orderPayload.customerEmail || (user ? user.email : ""),
        customerName: orderPayload.customerName || (user ? user.name : "Cliente"),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh orders
        if (user) {
          fetchOrders(user);
        }
        return data.order;
      }
    } catch (err) {
      console.error("Failed to save order to server:", err);
    }
    return null;
  };

  // Admin update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders(user);
        return true;
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === "admin",
        orders,
        isLoadingOrders,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        register,
        logout,
        fetchOrders: () => fetchOrders(user),
        saveOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
