import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const DEFAULT_USERS = [
  {
    id: "usr_admin",
    name: "Administrador Falstep",
    email: "admin@falstep.com",
    password: "admin",
    role: "admin",
    createdAt: "2026-10-01T12:00:00.000Z"
  },
  {
    id: "usr_edilson",
    name: "Edilson Cabinda",
    email: "edilson@falstep.com",
    password: "1234",
    role: "customer",
    createdAt: "2026-11-20T19:49:52.744Z"
  },
  {
    id: "usr_demo",
    name: "Cliente VIP",
    email: "cliente@falstep.com",
    password: "123",
    role: "customer",
    createdAt: "2026-10-15T15:30:00.000Z"
  }
];

export const DEFAULT_ORDERS = [
  {
    id: "FLS-849201",
    userId: "usr_edilson",
    customerName: "Edilson Cabinda",
    customerEmail: "edilson@falstep.com",
    items: [
      {
        id: "tee-feroz-black",
        title: "FEROZ SAVAGE OVERSIZED TEE",
        price: 65,
        size: "L",
        qty: 1,
        image: "/images/products/hero_david_feroz_black.jpg"
      },
      {
        id: "tee-dunk-white",
        title: "RETRO DUNK ARCHIVE TEE",
        price: 60,
        size: "XL",
        qty: 1,
        image: "/images/products/tee_dunk_white.png"
      }
    ],
    subtotal: 125,
    shippingCost: 0,
    total: 125,
    shippingAddress: {
      fullName: "Edilson Cabinda",
      address: "Avenida da Liberdade 120, 3º Esq",
      city: "Lisboa",
      postalCode: "1250-096",
      country: "Portugal"
    },
    status: "Em Trânsito",
    createdAt: "2026-10-25T14:30:00.000Z",
    trackingCode: "PT849201940",
    carrier: "CTT Express"
  }
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem("falstep_users_db");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  try {
    localStorage.setItem("falstep_users_db", JSON.stringify(DEFAULT_USERS));
  } catch {}
  return DEFAULT_USERS;
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem("falstep_users_db", JSON.stringify(users));
  } catch {}
}

function getStoredOrders() {
  try {
    const raw = localStorage.getItem("falstep_orders_db");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  try {
    localStorage.setItem("falstep_orders_db", JSON.stringify(DEFAULT_ORDERS));
  } catch {}
  return DEFAULT_ORDERS;
}

function saveStoredOrders(orders) {
  try {
    localStorage.setItem("falstep_orders_db", JSON.stringify(orders));
  } catch {}
}

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
    const isAdm = userToFetch.role === "admin";

    // 1. Try server API
    try {
      const url = isAdm ? "/api/orders?all=true" : `/api/orders?email=${encodeURIComponent(userToFetch.email)}`;
      const res = await fetch(url, {
        headers: {
          "x-user-email": userToFetch.email,
          "x-user-role": userToFetch.role || "customer",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
          setIsLoadingOrders(false);
          return;
        }
      }
    } catch {}

    // 2. Client-side database fallback
    const all = getStoredOrders();
    if (isAdm) {
      setOrders(all);
    } else {
      const filtered = all.filter(
        (o) =>
          o.userId === userToFetch.id ||
          o.customerEmail?.toLowerCase() === userToFetch.email?.toLowerCase()
      );
      setOrders(filtered);
    }
    setIsLoadingOrders(false);
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
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error("E-mail e senha são obrigatórios.");
    }

    // 1. Try backend API first (when running on server/local)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("falstep_token", data.token);
        setIsAuthModalOpen(false);
        return data.user;
      }

      // If server explicitly responded 401 or 400 with a validation error
      if (res.status === 401 || res.status === 400) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Credenciais inválidas.");
      }
    } catch (err) {
      // If error was explicit wrong credentials from server, re-throw
      if (err.message === "Credenciais inválidas." || err.message === "Email e senha são obrigatórios.") {
        throw err;
      }
      // If network failure / 404 / 405 (GitHub Pages static host), fall back to client database seamlessly!
    }

    // 2. Client-side authentication fallback (GitHub Pages / Static Host)
    const localUsers = getStoredUsers();
    const foundUser = localUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && String(u.password) === String(password)
    );

    if (!foundUser) {
      throw new Error("Credenciais inválidas. Verifique o seu e-mail e a senha.");
    }

    const safeUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      createdAt: foundUser.createdAt,
    };

    const dummyToken = "jwt_" + Math.random().toString(36).substring(2);
    setUser(safeUser);
    setToken(dummyToken);
    localStorage.setItem("falstep_token", dummyToken);
    setIsAuthModalOpen(false);
    return safeUser;
  };

  const register = async (name, email, password) => {
    const cleanEmail = email?.trim().toLowerCase();
    const cleanName = name?.trim();

    if (!cleanName || !cleanEmail || !password) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    // 1. Try backend API first
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("falstep_token", data.token);
        setIsAuthModalOpen(false);
        return data.user;
      }

      if (res.status === 400 || res.status === 409) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao criar conta.");
      }
    } catch (err) {
      if (err.message && (err.message.includes("já existe") || err.message.includes("obrigat"))) {
        throw err;
      }
    }

    // 2. Client-side registration fallback (GitHub Pages / Static Host)
    const localUsers = getStoredUsers();
    if (localUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("Já existe uma conta registada com este e-mail.");
    }

    const newUser = {
      id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    localUsers.push(newUser);
    saveStoredUsers(localUsers);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    const dummyToken = "jwt_" + Math.random().toString(36).substring(2);
    setUser(safeUser);
    setToken(dummyToken);
    localStorage.setItem("falstep_token", dummyToken);
    setIsAuthModalOpen(false);
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOrders([]);
    localStorage.removeItem("falstep_user");
    localStorage.removeItem("falstep_token");
  };

  // Save new order
  const saveOrder = async (orderPayload) => {
    const payload = {
      ...orderPayload,
      userId: user ? user.id : null,
      customerEmail: orderPayload.customerEmail || (user ? user.email : ""),
      customerName: orderPayload.customerName || (user ? user.name : "Cliente"),
    };

    // 1. Try server
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (user) fetchOrders(user);
        return data.order;
      }
    } catch {}

    // 2. Client storage fallback
    const all = getStoredOrders();
    all.unshift(payload);
    saveStoredOrders(all);

    if (user) {
      fetchOrders(user);
    }
    return payload;
  };

  // Admin update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    // 1. Try server
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
    } catch {}

    // 2. Client storage fallback
    const all = getStoredOrders();
    const idx = all.findIndex((o) => o.id === orderId);
    if (idx > -1) {
      all[idx].status = newStatus;
      saveStoredOrders(all);
      fetchOrders(user);
      return true;
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
