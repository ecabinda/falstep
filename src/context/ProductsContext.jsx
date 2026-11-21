import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS as initialProducts, INITIAL_COLLECTIONS, INITIAL_COUPONS } from "../data/products";

const ProductsContext = createContext();

export const DEFAULT_SETTINGS = {
  announcement: "PORTUGUESE HEAVYWEIGHT TEXTILES // ENVIOS PARA TODO O MUNDO // DROP 07 DISPONÍVEL",
  heroBadge: "DROP 07 // FEROZ SAVAGE CAPSULE",
  heroTitle: "FEROZ SAVAGE &\nDIAMOND DIET",
  heroSubtitle: "Classical sculpture reimagined through contemporary underground brutalism. Heavyweight 320 GSM boxy proportions sculpted from bespoke Portuguese milled textiles.",
  heroCta1: "EXPLORAR COLEÇÃO",
  heroCta2: "VER DETALHES (320 GSM)",
  heroBgType: "video",
  heroBgImage: "/images/products/hero_david_feroz_black.jpg",
  freeShippingThreshold: 100,
  contactEmail: "atelier@falstep.com",
  contactPhone: "+351 912 345 678",
};

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) return parsed;
    }
  } catch (e) {}
  return fallback;
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => getStored("falstep_products_db", initialProducts));
  const [isLoading, setIsLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState(() => getStored("falstep_settings_db", DEFAULT_SETTINGS));
  const [coupons, setCoupons] = useState(() => getStored("falstep_coupons_db", INITIAL_COUPONS));
  const [collections, setCollections] = useState(() => getStored("falstep_collections_db", INITIAL_COLLECTIONS));

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          setStored("falstep_products_db", data.products);
          return;
        }
      }
    } catch (err) {}
    // Fallback to localStorage or initial
    const stored = getStored("falstep_products_db", initialProducts);
    setProducts(stored);
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch("/api/collections");
      if (res.ok) {
        const data = await res.json();
        if (data.collections) {
          setCollections(data.collections);
          setStored("falstep_collections_db", data.collections);
          return;
        }
      }
    } catch (err) {}
    setCollections(getStored("falstep_collections_db", INITIAL_COLLECTIONS));
  }, []);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) {
        const data = await res.json();
        if (data.coupons) {
          setCoupons(data.coupons);
          setStored("falstep_coupons_db", data.coupons);
          return;
        }
      }
    } catch (err) {}
    setCoupons(getStored("falstep_coupons_db", INITIAL_COUPONS));
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setStoreSettings(data.settings);
          setStored("falstep_settings_db", data.settings);
          return;
        }
      }
    } catch (err) {}
    setStoreSettings(getStored("falstep_settings_db", DEFAULT_SETTINGS));
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    fetchCoupons();
    fetchCollections();
  }, [fetchProducts, fetchSettings, fetchCoupons, fetchCollections]);

  // ADD PRODUCT
  const addProduct = async (productData) => {
    const newProduct = {
      ...productData,
      id: productData.id || "prod_" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          newProduct.id = data.product.id;
        }
      }
    } catch (e) {}

    setProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
      setStored("falstep_products_db", updated);
      return updated;
    });

    return newProduct;
  };

  // UPDATE PRODUCT
  const updateProduct = async (productId, updatedFields) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (e) {}

    let updatedProd = null;
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          updatedProd = { ...p, ...updatedFields };
          return updatedProd;
        }
        return p;
      });
      setStored("falstep_products_db", updated);
      return updated;
    });

    return updatedProd;
  };

  // UPLOAD IMAGE
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
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              resolve(data.url);
              return;
            }
          }
        } catch (err) {}
        // Fallback to dataUrl directly (works 100% offline and on GitHub Pages)
        resolve(reader.result);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // CLONE PRODUCT
  const cloneProduct = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}/clone`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProducts((prev) => {
            const updated = [data.product, ...prev];
            setStored("falstep_products_db", updated);
            return updated;
          });
          return data.product;
        }
      }
    } catch (e) {}

    let cloned = null;
    setProducts((prev) => {
      const original = prev.find((p) => p.id === productId);
      if (!original) return prev;
      cloned = {
        ...original,
        id: "prod_clone_" + Date.now(),
        title: original.title + " (Cópia)",
        createdAt: new Date().toISOString(),
      };
      const updated = [cloned, ...prev];
      setStored("falstep_products_db", updated);
      return updated;
    });

    return cloned;
  };

  // DELETE PRODUCT
  const deleteProduct = async (productId) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
    } catch (e) {}

    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      setStored("falstep_products_db", updated);
      return updated;
    });

    return true;
  };

  // COLLECTIONS
  const addCollection = async (collectionData) => {
    const newCol = {
      ...collectionData,
      id: collectionData.id || "col_" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectionData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.collection) newCol.id = data.collection.id;
      }
    } catch (e) {}

    setCollections((prev) => {
      const updated = [newCol, ...prev.filter((c) => c.id !== newCol.id)];
      setStored("falstep_collections_db", updated);
      return updated;
    });

    return newCol;
  };

  const updateCollection = async (id, updatedFields) => {
    try {
      await fetch(`/api/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (e) {}

    let updatedCol = null;
    setCollections((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          updatedCol = { ...c, ...updatedFields };
          return updatedCol;
        }
        return c;
      });
      setStored("falstep_collections_db", updated);
      return updated;
    });

    return updatedCol;
  };

  const deleteCollection = async (id) => {
    try {
      await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      });
    } catch (e) {}

    setCollections((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      setStored("falstep_collections_db", updated);
      return updated;
    });

    return true;
  };

  // COUPONS
  const addCoupon = async (couponData) => {
    const newCoupon = {
      ...couponData,
      id: couponData.id || "cpn_" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.coupon) newCoupon.id = data.coupon.id;
      }
    } catch (e) {}

    setCoupons((prev) => {
      const updated = [newCoupon, ...prev.filter((c) => c.id !== newCoupon.id)];
      setStored("falstep_coupons_db", updated);
      return updated;
    });

    return newCoupon;
  };

  const updateCoupon = async (id, updatedFields) => {
    try {
      await fetch(`/api/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (e) {}

    let updatedCpn = null;
    setCoupons((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          updatedCpn = { ...c, ...updatedFields };
          return updatedCpn;
        }
        return c;
      });
      setStored("falstep_coupons_db", updated);
      return updated;
    });

    return updatedCpn;
  };

  const deleteCoupon = async (id) => {
    try {
      await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
      });
    } catch (e) {}

    setCoupons((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      setStored("falstep_coupons_db", updated);
      return updated;
    });

    return true;
  };

  // SETTINGS
  const updateStoreSettings = async (newSettings) => {
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch (e) {}

    let merged = null;
    setStoreSettings((prev) => {
      merged = { ...prev, ...newSettings };
      setStored("falstep_settings_db", merged);
      return merged;
    });

    return merged;
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
