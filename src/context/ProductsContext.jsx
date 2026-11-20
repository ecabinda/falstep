import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS as initialProducts } from "../data/products";

const ProductsContext = createContext();

const DEFAULT_SETTINGS = {
  announcement: "PORTUGUESE HEAVYWEIGHT TEXTILES // ENVIOS PARA TODO O MUNDO // DROP 07 DISPONÍVEL",
  heroBadge: "DROP 07 // FEROZ SAVAGE CAPSULE",
  heroTitle: "FEROZ SAVAGE &\nDIAMOND DIET",
  heroSubtitle: "Classical sculpture reimagined through contemporary underground brutalism. Heavyweight 320 GSM boxy proportions sculpted from bespoke Portuguese milled textiles.",
  freeShippingThreshold: 100,
  contactEmail: "atelier@falstep.com",
  contactPhone: "+351 912 345 678",
};

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);
  const [coupons, setCoupons] = useState([]);
  const [collections, setCollections] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.warn("Could not fetch products from API, using fallback data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch("/api/collections");
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } catch (err) {
      console.warn("Could not fetch collections:", err);
    }
  }, []);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.warn("Could not fetch coupons:", err);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setStoreSettings(data.settings);
        }
      }
    } catch (err) {
      console.warn("Could not fetch settings from API:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    fetchCoupons();
    fetchCollections();
  }, [fetchProducts, fetchSettings, fetchCoupons, fetchCollections]);

  const addProduct = async (productData) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao adicionar produto.");
      }

      await fetchProducts();
      return data.product;
    } catch (err) {
      console.error("Error adding product:", err);
      throw err;
    }
  };

  const updateProduct = async (productId, updatedFields) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao atualizar produto.");
      }

      await fetchProducts();
      return data.product;
    } catch (err) {
      console.error("Error updating product:", err);
      throw err;
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              base64: reader.result,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Erro no upload da imagem");
          resolve(data.url);
        } catch (err) {
          console.warn("Upload fallback to dataUrl:", err);
          resolve(reader.result);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const cloneProduct = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}/clone`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao duplicar produto.");
      await fetchProducts();
      return data.product;
    } catch (err) {
      console.error("Error cloning product:", err);
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao remover produto.");
      }

      await fetchProducts();
      return true;
    } catch (err) {
      console.error("Error deleting product:", err);
      throw err;
    }
  };

  const addCollection = async (collectionData) => {
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar coleção.");
    await fetchCollections();
    return data.collection;
  };

  const updateCollection = async (id, updatedFields) => {
    const res = await fetch(`/api/collections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao atualizar coleção.");
    await fetchCollections();
    return data.collection;
  };

  const deleteCollection = async (id) => {
    const res = await fetch(`/api/collections/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao remover coleção.");
    await fetchCollections();
    return true;
  };

  const addCoupon = async (couponData) => {
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(couponData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar cupom.");
    await fetchCoupons();
    return data.coupon;
  };

  const updateCoupon = async (id, updatedFields) => {
    const res = await fetch(`/api/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao atualizar cupom.");
    await fetchCoupons();
    return data.coupon;
  };

  const deleteCoupon = async (id) => {
    const res = await fetch(`/api/coupons/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao remover cupom.");
    await fetchCoupons();
    return true;
  };

  const updateStoreSettings = async (newSettings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao guardar configurações.");
      }

      setStoreSettings(data.settings);
      return data.settings;
    } catch (err) {
      console.error("Error updating store settings:", err);
      throw err;
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        storeSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        cloneProduct,
        uploadImage,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        refetchCollections: fetchCollections,
        refetchCoupons: fetchCoupons,
        updateStoreSettings,
        refetchProducts: fetchProducts,
        refetchSettings: fetchSettings,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
