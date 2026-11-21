import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAuth, DEFAULT_USERS, DEFAULT_ORDERS } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import { HeroVideoBackground } from "../components/HeroVideoBackground";

const PRESET_IMAGES = [
  { name: "Feroz Savage (Estátua David Preta)", url: "/images/products/hero_david_feroz_black.jpg" },
  { name: "Diamond Diet (Estátua David Rosa)", url: "/images/products/hero_david_pink_diet.jpg" },
  { name: "Retro Dunk White Tee (Porsche)", url: "/images/products/tee_dunk_white.png" },
  { name: "Sevage Tiger Botanic Tee (Verde)", url: "/images/products/tee_savage_green.png" },
  { name: "Sevage Tiger Noir Tee (Preta)", url: "/images/products/tee_savage_black.png" },
  { name: "Capsule FS-24 Black Tee", url: "/images/products/tee_black_fs24.jpg" },
  { name: "Artwork FS-21 Studio Archive", url: "/images/products/graphic_fs21_main.jpg" },
];

export function AdminPage({ setActivePage }) {
  const { user, isAdmin, updateOrderStatus, logout } = useAuth();
  const {
    products,
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
    storeSettings,
    updateStoreSettings,
  } = useProducts();

  // Active Tab: dashboard | products | orders | hero_catalogs | coupons | users | settings
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem("falstep_admin_active_tab") || "dashboard";
    } catch (e) {
      return "dashboard";
    }
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem("falstep_admin_active_tab", tab);
    } catch (e) {}
  };
  const [heroCatalogSubTab, setHeroCatalogSubTab] = useState("hero"); // "hero" | "catalogs"

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [previewCollection, setPreviewCollection] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);

  // States for stats, orders, users
  const [stats, setStats] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Product Filtering & Sorting
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("TODAS");
  const [productStockFilter, setProductStockFilter] = useState("TODOS");
  const [productSort, setProductSort] = useState("NEWEST");

  // Order Filtering & Search
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("TODAS");

  // Drag and Drop & Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [dragActiveAdd, setDragActiveAdd] = useState(false);
  const [dragActiveEdit, setDragActiveEdit] = useState(false);
  const [dragActiveMain, setDragActiveMain] = useState(false);
  const [dragActiveHero, setDragActiveHero] = useState(false);
  const [dragActiveCol, setDragActiveCol] = useState(false);

  const fileInputAddRef = useRef(null);
  const fileInputEditRef = useRef(null);
  const fileInputMainRef = useRef(null);
  const fileInputHeroRef = useRef(null);
  const fileInputColRef = useRef(null);

  // Preview Device State (desktop vs mobile)
  const [previewDevice, setPreviewDevice] = useState("desktop");

  // Hero Live Edit State
  const [heroForm, setHeroForm] = useState({
    heroBadge: "DROP 07 // FEROZ SAVAGE CAPSULE",
    heroTitle: "FEROZ SAVAGE &\\nDIAMOND DIET",
    heroSubtitle: "Classical sculpture reimagined through contemporary underground brutalism. Heavyweight 320 GSM boxy proportions sculpted from bespoke Portuguese milled textiles.",
    heroCta1: "EXPLORAR COLEÇÃO",
    heroCta2: "VER DETALHES (320 GSM)",
    heroBgType: "video",
    heroBgImage: "/images/products/hero_david_feroz_black.jpg",
  });

  // Collection Form State
  const [collectionForm, setCollectionForm] = useState({
    name: "",
    tagline: "",
    badge: "NOVO LANÇAMENTO // EDIÇÃO LIMITADA",
    cover: PRESET_IMAGES[0].url,
    customCoverUrl: "",
    status: "active",
    productIds: [],
  });

  // New Product Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    category: "T-SHIRTS",
    color: "Pitch Black",
    edition: "LIMITED RUN // 150 PIECES",
    sizes: ["S", "M", "L", "XL"],
    stock: 25,
    inStock: true,
    image: PRESET_IMAGES[0].url,
    customImageUrl: "",
    description: "",
    weight: "320 GSM",
    origin: "Porto, Portugal",
    composition: "100% Algodão Orgânico",
    treatment: "Lavagem Enzimática a Frio",
  });

  // Edit Product Form State
  const [editFormData, setEditFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    category: "T-SHIRTS",
    color: "Pitch Black",
    edition: "LIMITED RUN // 150 PIECES",
    sizes: ["S", "M", "L", "XL"],
    stock: 25,
    inStock: true,
    image: PRESET_IMAGES[0].url,
    customImageUrl: "",
    description: "",
    weight: "320 GSM",
    origin: "Porto, Portugal",
    composition: "100% Algodão Orgânico",
    treatment: "Lavagem Enzimática a Frio",
  });

  // Coupon Creation Form
  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "percentage",
    value: 10,
    minSpend: 0,
    maxUsage: 100,
  });

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    heroBadge: "DROP 07 // FEROZ SAVAGE CAPSULE",
    heroTitle: "FEROZ SAVAGE &\\nDIAMOND DIET",
    heroSubtitle: "Classical sculpture reimagined through contemporary underground brutalism. Heavyweight 320 GSM boxy proportions sculpted from bespoke Portuguese milled textiles.",
    heroCta1: "EXPLORAR COLEÇÃO",
    heroCta2: "VER DETALHES (320 GSM)",
    heroBgType: "video",
    heroBgImage: "/images/products/hero_david_feroz_black.jpg",
    announcement: "PORTUGUESE HEAVYWEIGHT TEXTILES // ENVIOS PARA TODO O MUNDO // DROP 07 DISPONÍVEL",
    freeShippingThreshold: 100,
    contactEmail: "atelier@falstep.com",
    contactPhone: "+351 912 345 678",
    storeNotice: "Atelier aberto: entregas em 24h para Portugal Continental.",
  });

  // Sync settings into hero form and settings form
  useEffect(() => {
    if (storeSettings) {
      setSettingsForm((prev) => ({ ...prev, ...storeSettings }));
      setHeroForm((prev) => ({
        ...prev,
        heroBadge: storeSettings.heroBadge || prev.heroBadge,
        heroTitle: storeSettings.heroTitle || prev.heroTitle,
        heroSubtitle: storeSettings.heroSubtitle || prev.heroSubtitle,
        heroCta1: storeSettings.heroCta1 || prev.heroCta1,
        heroCta2: storeSettings.heroCta2 || prev.heroCta2,
        heroBgType: storeSettings.heroBgType || prev.heroBgType,
        heroBgImage: storeSettings.heroBgImage || prev.heroBgImage,
      }));
    }
  }, [storeSettings]);

  const fetchAdminStats = async () => {
    let usersList = [];
    let ordersList = [];
    let statsData = null;

    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        statsData = data;
        usersList = data.users || [];
      }
    } catch (e) {}

    try {
      setLoadingOrders(true);
      const ordersRes = await fetch("/api/orders?all=true", {
        headers: { "x-user-role": "admin" },
      });
      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        ordersList = oData.orders || [];
      }
    } catch (e) {}

    // Seamless Fallback for GitHub Pages / Static Hosting / Offline:
    if (!usersList || usersList.length === 0) {
      try {
        const raw = localStorage.getItem("falstep_users_db");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) usersList = parsed;
        }
      } catch (e) {}
      if (!usersList || usersList.length === 0) {
        usersList = DEFAULT_USERS;
      }
    }

    if (!ordersList || ordersList.length === 0) {
      try {
        const raw = localStorage.getItem("falstep_orders_db");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) ordersList = parsed;
        }
      } catch (e) {}
      if (!ordersList || ordersList.length === 0) {
        ordersList = DEFAULT_ORDERS;
      }
    }

    const safeUsers = usersList.map(({ password, ...u }) => u);
    setRegisteredUsers(safeUsers);
    setAllOrders(ordersList);

    if (statsData) {
      setStats(statsData);
    } else {
      const totalRev = ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      setStats({
        totalRevenue: totalRev,
        totalOrders: ordersList.length,
        totalUsers: safeUsers.length,
        totalProducts: products.length,
        recentOrders: [...ordersList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
        users: safeUsers,
      });
    }

    setLoadingOrders(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  // Derived Analytics Metrics
  const totalRevenue = useMemo(() => {
    return stats?.totalRevenue || allOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  }, [stats, allOrders]);

  const averageTicket = useMemo(() => {
    if (allOrders.length === 0) return 0;
    return totalRevenue / allOrders.length;
  }, [totalRevenue, allOrders]);

  const totalItemsSold = useMemo(() => {
    return allOrders.reduce((acc, o) => {
      const count = o.items ? o.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) : 1;
      return acc + count;
    }, 0);
  }, [allOrders]);

  const pendingOrdersCount = useMemo(() => {
    return allOrders.filter((o) => (o.status || "").toUpperCase() === "PENDENTE" || (o.status || "").toUpperCase() === "CONFIRMADO").length;
  }, [allOrders]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => Number(p.stock || 25) <= 5).length;
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
          p.id.toLowerCase().includes(productSearch.toLowerCase());
        const matchCategory = productCategoryFilter === "TODAS" || (p.category || "").toUpperCase() === productCategoryFilter;
        let matchStock = true;
        if (productStockFilter === "IN_STOCK") matchStock = p.inStock !== false && Number(p.stock || 25) > 0;
        if (productStockFilter === "LOW_STOCK") matchStock = Number(p.stock || 25) <= 5;
        return matchSearch && matchCategory && matchStock;
      })
      .sort((a, b) => {
        if (productSort === "PRICE_ASC") return Number(a.price) - Number(b.price);
        if (productSort === "PRICE_DESC") return Number(b.price) - Number(a.price);
        if (productSort === "NAME") return a.title.localeCompare(b.title);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [products, productSearch, productCategoryFilter, productStockFilter, productSort]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      const matchSearch =
        (o.id || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.customerName || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.customerEmail || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.trackingCode || "").toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === "TODAS" || (o.status || "").toUpperCase() === orderStatusFilter.toUpperCase();
      return matchSearch && matchStatus;
    });
  }, [allOrders, orderSearch, orderStatusFilter]);

  // Helper for processing images from local machine
  const processImageFile = async (file, targetType = "product_add") => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Por favor selecione um ficheiro de imagem válido (PNG, JPG, WEBP, etc.).");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImage(file);

      const cleanName = file.name
        .replace(/\\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\\b\\w/g, (c) => c.toUpperCase());

      if (targetType === "product_edit") {
        setEditFormData((prev) => ({
          ...prev,
          image: uploadedUrl,
          customImageUrl: uploadedUrl,
        }));
      } else if (targetType === "hero_bg") {
        setHeroForm((prev) => ({
          ...prev,
          heroBgType: "image",
          heroBgImage: uploadedUrl,
        }));
      } else if (targetType === "collection_cover") {
        setCollectionForm((prev) => ({
          ...prev,
          cover: uploadedUrl,
          customCoverUrl: uploadedUrl,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          image: uploadedUrl,
          customImageUrl: uploadedUrl,
          title: prev.title.trim() ? prev.title : cleanName,
        }));
      }

      setFeedbackMsg(`Ficheiro "${file.name}" importado com sucesso da sua máquina!`);
      setTimeout(() => setFeedbackMsg(""), 4500);
    } catch (err) {
      alert("Erro ao importar imagem: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMainDrop = async (e) => {
    e.preventDefault();
    setDragActiveMain(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setIsAddModalOpen(true);
      await processImageFile(files[0], "product_add");
    }
  };

  // Save Hero settings from Hero Editor with instant live application
  const handleSaveHeroSettings = async (e) => {
    e.preventDefault();
    try {
      await updateStoreSettings({
        heroBadge: heroForm.heroBadge,
        heroTitle: heroForm.heroTitle,
        heroSubtitle: heroForm.heroSubtitle,
        heroCta1: heroForm.heroCta1,
        heroCta2: heroForm.heroCta2,
        heroBgType: heroForm.heroBgType,
        heroBgImage: heroForm.heroBgImage,
      });
      setFeedbackMsg("Secção Hero atualizada e publicada na loja com sucesso!");
      setTimeout(() => setFeedbackMsg(""), 5000);
    } catch (err) {
      alert("Erro ao guardar Hero: " + err.message);
    }
  };

  // Save General Store Settings (Announcement, Shipping, Contacts)
  const handleSaveStoreSettings = async (e) => {
    e.preventDefault();
    try {
      await updateStoreSettings({
        announcement: settingsForm.announcement,
        freeShippingThreshold: Number(settingsForm.freeShippingThreshold) || 100,
        contactEmail: settingsForm.contactEmail,
        contactPhone: settingsForm.contactPhone,
      });
      setFeedbackMsg("Configurações gerais da loja atualizadas com sucesso!");
      setTimeout(() => setFeedbackMsg(""), 5000);
    } catch (err) {
      alert("Erro ao guardar configurações: " + err.message);
    }
  };

  // Collection Handlers
  const handleOpenCreateCollection = () => {
    setEditingCollection(null);
    setCollectionForm({
      name: "",
      tagline: "",
      badge: "NOVO LANÇAMENTO // EDIÇÃO LIMITADA",
      cover: PRESET_IMAGES[0].url,
      customCoverUrl: "",
      status: "active",
      productIds: products.slice(0, 3).map((p) => p.id),
    });
    setIsCollectionModalOpen(true);
  };

  const handleOpenEditCollection = (col) => {
    setEditingCollection(col);
    setCollectionForm({
      name: col.name || "",
      tagline: col.tagline || "",
      badge: col.badge || "EDIÇÃO LIMITADA",
      cover: col.cover || PRESET_IMAGES[0].url,
      customCoverUrl: col.cover && !PRESET_IMAGES.some((p) => p.url === col.cover) ? col.cover : "",
      status: col.status || "active",
      productIds: col.productIds || [],
    });
    setIsCollectionModalOpen(true);
  };

  const handleSaveCollection = async (e) => {
    e.preventDefault();
    try {
      const finalCover = collectionForm.customCoverUrl.trim() || collectionForm.cover;
      const payload = {
        name: collectionForm.name,
        tagline: collectionForm.tagline,
        badge: collectionForm.badge,
        cover: finalCover,
        status: collectionForm.status,
        productIds: collectionForm.productIds,
      };

      if (editingCollection) {
        await updateCollection(editingCollection.id, payload);
        setFeedbackMsg(`Catálogo "${collectionForm.name}" atualizado com sucesso!`);
      } else {
        await addCollection(payload);
        setFeedbackMsg(`Novo Catálogo "${collectionForm.name}" criado com sucesso!`);
      }

      setIsCollectionModalOpen(false);
      setEditingCollection(null);
      setTimeout(() => setFeedbackMsg(""), 5000);
    } catch (err) {
      alert("Erro ao guardar catálogo: " + err.message);
    }
  };

  const handleDeleteCollection = async (col) => {
    if (confirm(`Tem a certeza que deseja remover o catálogo "${col.name}"?`)) {
      try {
        await deleteCollection(col.id);
        setFeedbackMsg(`Catálogo "${col.name}" removido com sucesso.`);
        setTimeout(() => setFeedbackMsg(""), 4000);
      } catch (err) {
        alert("Erro ao remover: " + err.message);
      }
    }
  };

  const toggleCollectionProduct = (prodId) => {
    setCollectionForm((prev) => {
      const exists = prev.productIds.includes(prodId);
      return {
        ...prev,
        productIds: exists ? prev.productIds.filter((id) => id !== prodId) : [...prev.productIds, prodId],
      };
    });
  };

  // Product CRUD
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const finalImage = formData.customImageUrl.trim() || formData.image;
      const productPayload = {
        title: formData.title,
        subtitle: formData.subtitle || `${formData.weight} Heavyweight Silhouette`,
        price: Number(formData.price),
        category: formData.category,
        color: formData.color,
        edition: formData.edition,
        sizes: formData.sizes,
        stock: Number(formData.stock) || 25,
        inStock: formData.inStock,
        image: finalImage,
        gallery: [finalImage],
        description: formData.description || "Peça de edição limitada construída com corte oversized e serigrafia de arquivo.",
        specs: {
          weight: formData.weight,
          origin: formData.origin,
          composition: formData.composition,
          treatment: formData.treatment,
        },
      };

      await addProduct(productPayload);
      setIsAddModalOpen(false);
      setFeedbackMsg(`Produto "${formData.title}" adicionado com sucesso ao catálogo.`);
      setTimeout(() => setFeedbackMsg(""), 5000);
      fetchAdminStats();
    } catch (err) {
      alert("Erro ao adicionar produto: " + err.message);
    }
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setEditFormData({
      title: prod.title || "",
      subtitle: prod.subtitle || "",
      price: prod.price || "",
      category: prod.category || "T-SHIRTS",
      color: prod.color || "Pitch Black",
      edition: prod.edition || "LIMITED RUN // 150 PIECES",
      sizes: prod.sizes || ["S", "M", "L", "XL"],
      stock: prod.stock !== undefined ? prod.stock : 25,
      inStock: prod.inStock !== false,
      image: prod.image || PRESET_IMAGES[0].url,
      customImageUrl: prod.image && !PRESET_IMAGES.some((p) => p.url === prod.image) ? prod.image : "",
      description: prod.description || "",
      weight: prod.specs?.weight || "320 GSM",
      origin: prod.specs?.origin || "Porto, Portugal",
      composition: prod.specs?.composition || "100% Algodão Orgânico",
      treatment: prod.specs?.treatment || "Lavagem Enzimática a Frio",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const finalImage = editFormData.customImageUrl.trim() || editFormData.image;
      const updatedFields = {
        title: editFormData.title,
        subtitle: editFormData.subtitle,
        price: Number(editFormData.price),
        category: editFormData.category,
        color: editFormData.color,
        edition: editFormData.edition,
        sizes: editFormData.sizes,
        stock: Number(editFormData.stock) || 0,
        inStock: editFormData.inStock,
        image: finalImage,
        gallery: [finalImage],
        description: editFormData.description,
        specs: {
          weight: editFormData.weight,
          origin: editFormData.origin,
          composition: editFormData.composition,
          treatment: editFormData.treatment,
        },
      };

      await updateProduct(editingProduct.id, updatedFields);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setFeedbackMsg(`Produto "${editFormData.title}" atualizado com sucesso!`);
      setTimeout(() => setFeedbackMsg(""), 5000);
      fetchAdminStats();
    } catch (err) {
      alert("Erro ao atualizar produto: " + err.message);
    }
  };

  const handleQuickStockToggle = async (prod) => {
    const newInStock = !(prod.inStock !== false);
    try {
      await updateProduct(prod.id, { inStock: newInStock });
      setFeedbackMsg(`Estado de stock de "${prod.title}" atualizado para: ${newInStock ? "Em Stock" : "Esgotado"}`);
      setTimeout(() => setFeedbackMsg(""), 4000);
    } catch (err) {
      alert("Erro ao atualizar stock: " + err.message);
    }
  };

  const handleQuickStockChange = async (prod, delta) => {
    const current = Number(prod.stock || 25);
    const updated = Math.max(0, current + delta);
    try {
      await updateProduct(prod.id, { stock: updated, inStock: updated > 0 });
      setFeedbackMsg(`Stock de "${prod.title}" ajustado para ${updated} un.`);
      setTimeout(() => setFeedbackMsg(""), 3500);
    } catch (err) {
      alert("Erro ao ajustar stock: " + err.message);
    }
  };

  const handleCloneProduct = async (id, title) => {
    try {
      await cloneProduct(id);
      setFeedbackMsg(`Produto "${title}" duplicado com sucesso!`);
      setTimeout(() => setFeedbackMsg(""), 5000);
      fetchAdminStats();
    } catch (err) {
      alert("Erro ao duplicar produto: " + err.message);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (confirm(`Tem a certeza que deseja remover o produto "${title}" da loja?`)) {
      try {
        await deleteProduct(id);
        setFeedbackMsg(`Produto "${title}" removido com sucesso.`);
        setTimeout(() => setFeedbackMsg(""), 5000);
        fetchAdminStats();
      } catch (err) {
        alert("Erro ao remover: " + err.message);
      }
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.role === "admin" || targetUser.email.toLowerCase() === "admin@falstep.com") {
      alert("A conta de administrador principal não pode ser removida.");
      return;
    }

    if (confirm(`ATENÇÃO: Deseja remover permanentemente o cliente "${targetUser.name}" (${targetUser.email})?`)) {
      try {
        await fetch(`/api/users/${targetUser.id}`, {
          method: "DELETE",
          headers: { "x-user-role": "admin" },
        });
      } catch (e) {}

      setRegisteredUsers((prev) => {
        const updated = prev.filter((u) => u.id !== targetUser.id);
        try {
          localStorage.setItem("falstep_users_db", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      setFeedbackMsg(`Cliente ${targetUser.name} (${targetUser.email}) removido com sucesso.`);
      setTimeout(() => setFeedbackMsg(""), 5000);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    const ok = await updateOrderStatus(orderId, newStatus);
    if (ok) {
      setAllOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      setFeedbackMsg(`Estado da encomenda #${orderId.slice(-6)} atualizado para: ${newStatus}`);
      setTimeout(() => setFeedbackMsg(""), 4000);
    }
  };

  const handleSaveOrderTracking = async (orderId, trackingCode, carrier) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode, carrier }),
      });
    } catch (err) {}

    setAllOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, trackingCode, carrier } : o));
      try {
        localStorage.setItem("falstep_orders_db", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setFeedbackMsg(`Código de rastreio ${trackingCode} guardado na encomenda #${orderId.slice(-6)}.`);
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  const handleExportCSV = () => {
    if (allOrders.length === 0) {
      alert("Não existem encomendas para exportar.");
      return;
    }
    const headers = ["ID Encomenda", "Data", "Cliente", "Email", "Total (EUR)", "Estado", "Rastreio", "Transportadora", "Artigos"];
    const rows = allOrders.map((o) => [
      o.id,
      new Date(o.createdAt).toISOString(),
      `"${(o.customerName || "Cliente").replace(/"/g, '""')}"`,
      o.customerEmail || "",
      Number(o.total).toFixed(2),
      o.status || "CONFIRMADO",
      o.trackingCode || "N/A",
      o.carrier || "CTT Express",
      `"${(o.items || []).map((i) => `${i.quantity}x ${i.title} (${i.size})`).join("; ")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `falstep_vendas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await addCoupon(couponForm);
      setIsCouponModalOpen(false);
      setCouponForm({ code: "", type: "percentage", value: 10, minSpend: 0, maxUsage: 100 });
      setFeedbackMsg(`Cupom "${couponForm.code.toUpperCase()}" criado com sucesso!`);
      setTimeout(() => setFeedbackMsg(""), 4500);
    } catch (err) {
      alert("Erro ao criar cupom: " + err.message);
    }
  };

  const handleToggleCoupon = async (coupon) => {
    try {
      await updateCoupon(coupon.id, { active: !coupon.active });
      setFeedbackMsg(`Cupom "${coupon.code}" ${!coupon.active ? "ativado" : "desativado"}.`);
      setTimeout(() => setFeedbackMsg(""), 3500);
    } catch (err) {
      alert("Erro ao atualizar cupom: " + err.message);
    }
  };

  const handleDeleteCoupon = async (coupon) => {
    if (confirm(`Deseja remover o cupom "${coupon.code}"?`)) {
      try {
        await deleteCoupon(coupon.id);
        setFeedbackMsg(`Cupom "${coupon.code}" removido com sucesso.`);
        setTimeout(() => setFeedbackMsg(""), 3500);
      } catch (err) {
        alert("Erro ao remover cupom: " + err.message);
      }
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-12 pt-28 pb-24 font-['Hanken_Grotesk',sans-serif]">
      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#20151115] mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#75584a] font-bold">
              MODO ADMINISTRADOR // CONSOLA DE GESTÃO INTEGRAL FALSTEP
            </span>
          </div>
          <h1 className="font-['Anton'] text-3xl sm:text-4xl uppercase tracking-wider text-[#201511] mt-1">
            Painel Central de Gestão da Loja
          </h1>
          <p className="text-xs font-mono text-[#4e4541] mt-1">
            Editor visual da Hero, criador de novos catálogos, controlo de stock e expedição em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] text-xs uppercase tracking-widest transition flex items-center gap-2 shadow active:scale-95"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Adicionar Produto</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 border border-[#20151125] hover:border-[#201511] bg-white text-[#201511] font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Exportar Vendas</span>
          </button>

          <button
            onClick={() => setActivePage("home")}
            className="px-4 py-2.5 border border-[#20151125] hover:border-[#201511] bg-white text-[#201511] font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Ver Loja ao Vivo &rarr;</span>
          </button>

          <button
            onClick={() => {
              logout();
              setActivePage("home");
            }}
            className="px-4 py-2.5 border border-red-200 hover:border-red-600 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Terminar Sessão"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Terminar Sessão</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-2 animate-[fadeIn_0.2s]">
          <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white border border-[#20151115] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#75584a]">FATURAMENTO TOTAL</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg">payments</span>
          </div>
          <span className="font-['Anton'] text-3xl text-[#201511] block mt-1">
            €{totalRevenue.toFixed(2)}
          </span>
          <span className="text-[11px] text-[#4e4541] font-mono block mt-1">
            Ticket médio: <strong>€{averageTicket.toFixed(2)}</strong>
          </span>
        </div>

        <div className="p-5 bg-white border border-[#20151115] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#75584a]">ENCOMENDAS REALIZADAS</span>
            <span className="material-symbols-outlined text-blue-600 text-lg">inventory_2</span>
          </div>
          <span className="font-['Anton'] text-3xl text-[#201511] block mt-1">
            {allOrders.length}
          </span>
          <span className="text-[11px] text-[#4e4541] font-mono block mt-1">
            {pendingOrdersCount} encomendas por expedir
          </span>
        </div>

        <div className="p-5 bg-white border border-[#20151115] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#75584a]">PRODUTOS &amp; CATÁLOGOS</span>
            <span className="material-symbols-outlined text-amber-600 text-lg">view_quilt</span>
          </div>
          <span className="font-['Anton'] text-3xl text-[#201511] block mt-1">
            {products.length} <span className="text-lg text-[#75584a]">/ {collections.length}</span>
          </span>
          <span className="text-[11px] text-[#4e4541] font-mono block mt-1">
            {collections.length} coleções ativas na loja
          </span>
        </div>

        <div className="p-5 bg-white border border-[#20151115] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#75584a]">CLIENTES &amp; CUPONS</span>
            <span className="material-symbols-outlined text-purple-600 text-lg">loyalty</span>
          </div>
          <span className="font-['Anton'] text-3xl text-[#201511] block mt-1">
            {registeredUsers.length} <span className="text-lg text-[#75584a]">/ {coupons.length}</span>
          </span>
          <span className="text-[11px] text-[#4e4541] font-mono block mt-1">
            {totalItemsSold} peças vendidas no total
          </span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap border-b border-[#20151115] mb-8 bg-white px-2">
        <button
          onClick={() => handleTabChange("dashboard")}
          className={`py-4 px-5 text-xs font-['Anton'] uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "dashboard"
              ? "border-[#201511] text-[#201511]"
              : "border-transparent text-[#75584a] hover:text-[#201511]"
          }`}
        >
          <span className="material-symbols-outlined text-base">monitoring</span>
          <span>Visão Geral</span>
        </button>

        <button
          onClick={() => handleTabChange("hero_catalogs")}
          className={`py-4 px-5 text-xs font-['Anton'] uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "hero_catalogs"
              ? "border-[#201511] text-[#201511]"
              : "border-transparent text-[#75584a] hover:text-[#201511]"
          }`}
        >
          <span className="material-symbols-outlined text-base">preview</span>
          <span>Hero &amp; Catálogos (Com Preview)</span>
        </button>

        <button
          onClick={() => handleTabChange("products")}
          className={`py-4 px-5 text-xs font-['Anton'] uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "products"
              ? "border-[#201511] text-[#201511]"
              : "border-transparent text-[#75584a] hover:text-[#201511]"
          }`}
        >
          <span className="material-symbols-outlined text-base">app_registration</span>
          <span>Catálogo &amp; Stock ({products.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("orders")}
          className={`py-4 px-5 text-xs font-['Anton'] uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "orders"
              ? "border-[#201511] text-[#201511]"
              : "border-transparent text-[#75584a] hover:text-[#201511]"
          }`}
        >
          <span className="material-symbols-outlined text-base">local_shipping</span>
          <span>Encomendas &amp; Envios ({allOrders.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("coupons")}
          className={`py-4 px-5 text-xs font-['Anton'] uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "coupons"
              ? "border-[#201511] text-[#201511]"
              : "border-transparent text-[#75584a] hover:text-[#201511]"
          }`}
        >
          <span className="material-symbols-outlined text-base">confirmation_number</span>
          <span>Cupons &amp; Descontos ({coupons.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("users")}
          className={`py-4 px-5 text-xs font-['Anton'] uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "users"
              ? "border-[#201511] text-[#201511]"
              : "border-transparent text-[#75584a] hover:text-[#201511]"
          }`}
        >
          <span className="material-symbols-outlined text-base">group</span>
          <span>Clientes ({registeredUsers.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("settings")}
          className={`py-4 px-5 text-xs font-['Anton'] uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "settings"
              ? "border-[#201511] text-[#201511]"
              : "border-transparent text-[#75584a] hover:text-[#201511]"
          }`}
        >
          <span className="material-symbols-outlined text-base">tune</span>
          <span>Definições</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB: HERO & CATÁLOGOS COM PRÉ-VISUALIZAÇÃO AO VIVO */}
      {/* ======================================================== */}
      {activeTab === "hero_catalogs" && (
        <div className="space-y-8">
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-3 bg-white p-2 border border-[#20151115]">
            <button
              onClick={() => setHeroCatalogSubTab("hero")}
              className={`px-5 py-2.5 text-xs font-['Anton'] uppercase tracking-wider transition flex items-center gap-2 ${
                heroCatalogSubTab === "hero"
                  ? "bg-[#201511] text-white shadow"
                  : "bg-transparent text-[#75584a] hover:text-[#201511]"
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_carousel</span>
              <span>1. Editor da Hero &amp; Live Preview</span>
            </button>

            <button
              onClick={() => setHeroCatalogSubTab("catalogs")}
              className={`px-5 py-2.5 text-xs font-['Anton'] uppercase tracking-wider transition flex items-center gap-2 ${
                heroCatalogSubTab === "catalogs"
                  ? "bg-[#201511] text-white shadow"
                  : "bg-transparent text-[#75584a] hover:text-[#201511]"
              }`}
            >
              <span className="material-symbols-outlined text-sm">collections_bookmark</span>
              <span>2. Criar e Gerir Catálogos ({collections.length})</span>
            </button>
          </div>

          {/* SUB-SECTION 1: HERO EDITOR + LIVE INTERACTIVE PREVIEW */}
          {heroCatalogSubTab === "hero" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT FORM (5 COLS) */}
              <div className="lg:col-span-5 bg-white border border-[#20151115] p-6 shadow-sm space-y-5">
                <div className="border-b border-[#20151115] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#75584a] font-bold">
                    CUSTOMIZAÇÃO DA SECÇÃO DE ABERTURA
                  </span>
                  <h3 className="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">
                    Editor Visual da Hero
                  </h3>
                  <p className="text-xs font-mono text-[#4e4541] mt-0.5">
                    Os textos e opções editados aqui são refletidos em tempo real na tela de pré-visualização ao lado.
                  </p>
                </div>

                <form onSubmit={handleSaveHeroSettings} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block uppercase font-bold text-[#201511] mb-1">
                      Etiqueta / Badge Superior
                    </label>
                    <input
                      type="text"
                      value={heroForm.heroBadge}
                      onChange={(e) => setHeroForm({ ...heroForm, heroBadge: e.target.value })}
                      placeholder="Ex: DROP 07 // FEROZ SAVAGE CAPSULE"
                      className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-[#fbf9f5]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-[#201511] mb-1">
                      Título Principal da Hero
                    </label>
                    <textarea
                      rows={2}
                      value={heroForm.heroTitle}
                      onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                      placeholder="Use quebra de linha normal para partir o título"
                      className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-[#fbf9f5]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-[#201511] mb-1">
                      Subtítulo / Manifesto
                    </label>
                    <textarea
                      rows={3}
                      value={heroForm.heroSubtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                      placeholder="Descrição da estética têxtil..."
                      className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-[#fbf9f5]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase font-bold text-[#201511] mb-1">
                        Texto Botão 1
                      </label>
                      <input
                        type="text"
                        value={heroForm.heroCta1}
                        onChange={(e) => setHeroForm({ ...heroForm, heroCta1: e.target.value })}
                        className="w-full border border-[#20151130] p-2 text-xs font-mono bg-[#fbf9f5]"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-bold text-[#201511] mb-1">
                        Texto Botão 2
                      </label>
                      <input
                        type="text"
                        value={heroForm.heroCta2}
                        onChange={(e) => setHeroForm({ ...heroForm, heroCta2: e.target.value })}
                        className="w-full border border-[#20151130] p-2 text-xs font-mono bg-[#fbf9f5]"
                      />
                    </div>
                  </div>

                  {/* Fundo da Hero: Vídeo ou Imagem */}
                  <div>
                    <label className="block uppercase font-bold text-[#201511] mb-1.5">
                      Estilo do Fundo da Hero
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setHeroForm({ ...heroForm, heroBgType: "video" })}
                        className={`p-2.5 border text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                          heroForm.heroBgType === "video"
                            ? "bg-[#201511] text-white border-[#201511]"
                            : "bg-[#fbf9f5] text-[#201511] border-[#20151120]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">videocam</span>
                        <span>Vídeo Contínuo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroForm({ ...heroForm, heroBgType: "image" })}
                        className={`p-2.5 border text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                          heroForm.heroBgType === "image"
                            ? "bg-[#201511] text-white border-[#201511]"
                            : "bg-[#fbf9f5] text-[#201511] border-[#20151120]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">image</span>
                        <span>Foto / Banner</span>
                      </button>
                    </div>

                    {heroForm.heroBgType === "image" && (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragActiveHero(true);
                        }}
                        onDragLeave={() => setDragActiveHero(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragActiveHero(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            processImageFile(e.dataTransfer.files[0], "hero_bg");
                          }
                        }}
                        onClick={() => fileInputHeroRef.current?.click()}
                        className={`border-2 border-dashed p-4 text-center cursor-pointer transition rounded-sm ${
                          dragActiveHero ? "border-[#201511] bg-amber-500/10" : "border-[#20151125] bg-[#fbf9f5]"
                        }`}
                      >
                        <input
                          ref={fileInputHeroRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              processImageFile(e.target.files[0], "hero_bg");
                            }
                          }}
                        />
                        <span className="material-symbols-outlined text-xl text-[#201511] mb-1">add_photo_alternate</span>
                        <p className="text-[11px] font-bold text-[#201511]">Arraste nova foto de capa da sua máquina</p>
                        <span className="text-[10px] text-[#75584a]">ou clique para selecionar</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-widest transition shadow-xl mt-4 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">publish</span>
                    <span>Publicar Hero na Loja &rarr;</span>
                  </button>
                </form>
              </div>

              {/* RIGHT LIVE PREVIEW CANVAS (7 COLS) */}
              <div className="lg:col-span-7 bg-[#141414] border border-[#252525] p-5 shadow-2xl rounded-sm">
                {/* PREVIEW TOP BAR */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2 text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono uppercase tracking-widest text-[#e5ded8] font-bold">
                      PRÉ-VISUALIZAÇÃO AO VIVO (WYSIWYG)
                    </span>
                  </div>

                  {/* Device Switcher */}
                  <div className="flex items-center gap-1 bg-white/10 p-1 rounded-sm">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={`px-3 py-1 text-xs font-mono font-bold uppercase transition flex items-center gap-1 ${
                        previewDevice === "desktop" ? "bg-white text-black" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
                      <span>Desktop</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={`px-3 py-1 text-xs font-mono font-bold uppercase transition flex items-center gap-1 ${
                        previewDevice === "mobile" ? "bg-white text-black" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">smartphone</span>
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* SIMULATED VIEWPORT */}
                <div className="flex justify-center bg-black/50 p-2 overflow-hidden rounded">
                  <div
                    className={`transition-all duration-300 relative overflow-hidden bg-black ${
                      previewDevice === "desktop"
                        ? "w-full min-h-[480px] rounded"
                        : "w-[360px] min-h-[580px] rounded-3xl border-4 border-zinc-700 shadow-2xl"
                    }`}
                  >
                    {/* Background rendering in preview */}
                    {heroForm.heroBgType === "video" ? (
                      <HeroVideoBackground totalFrames={190} fps={24} />
                    ) : (
                      <div className="absolute inset-0 bg-black">
                        <img
                          src={heroForm.heroBgImage}
                          alt=""
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    )}

                    {/* Gradient scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                    {/* Simulated Header Bar */}
                    <div className="relative z-10 px-5 pt-4 flex items-center justify-between text-white/90 text-xs font-mono">
                      <span className="font-['Anton'] tracking-wider text-base">FALSTEP</span>
                      <div className="flex gap-3 text-[10px]">
                        <span>COLEÇÃO</span>
                        <span>EUR €</span>
                        <span>BAG (1)</span>
                      </div>
                    </div>

                    {/* Simulated Hero Content */}
                    <div className={`relative z-10 px-5 pb-8 flex flex-col justify-end ${previewDevice === "desktop" ? "min-h-[420px]" : "min-h-[500px]"}`}>
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 bg-[#f3efe8] rounded-full animate-ping" />
                          <span className="text-[10px] font-mono font-bold uppercase text-[#f3efe8] tracking-widest truncate">
                            {heroForm.heroBadge}
                          </span>
                        </div>
                        <h1 className="font-['Anton'] text-3xl sm:text-4xl uppercase tracking-tighter text-white leading-none drop-shadow-md whitespace-pre-line">
                          {heroForm.heroTitle}
                        </h1>
                        <p className="text-[11px] sm:text-xs text-[#e5ded8] pt-2 max-w-md leading-relaxed drop-shadow line-clamp-3">
                          {heroForm.heroSubtitle}
                        </p>

                        <div className="flex gap-2 pt-4">
                          <div className="px-4 py-2 bg-white text-black font-['Anton'] text-[11px] uppercase tracking-wider text-center">
                            {heroForm.heroCta1}
                          </div>
                          <div className="px-4 py-2 bg-black/60 border border-white text-white font-['Anton'] text-[11px] uppercase tracking-wider text-center">
                            {heroForm.heroCta2}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-center text-[11px] font-mono text-zinc-400">
                  <span>As alterações são pré-visualizadas instantaneamente antes de clicar em "Publicar Hero na Loja".</span>
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION 2: COLLECTIONS / CATALOGS CREATOR & MANAGER */}
          {heroCatalogSubTab === "catalogs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 border border-[#20151115] shadow-sm">
                <div>
                  <h3 className="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">
                    Catálogos e Coleções da Loja
                  </h3>
                  <p className="text-xs font-mono text-[#75584a] mt-0.5">
                    Crie coleções temáticas (ex: "DROP 08 // OBSIDIAN", "CORE ARCHIVE 2025") que aparecem no catálogo da loja para os clientes navegarem.
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateCollection}
                  className="px-5 py-3 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] text-xs uppercase tracking-widest transition flex items-center gap-2 shadow"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>+ Criar Novo Catálogo</span>
                </button>
              </div>

              {/* Collections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((col) => {
                  const assignedProducts = products.filter((p) => col.productIds?.includes(p.id));

                  return (
                    <div
                      key={col.id}
                      className="bg-white border border-[#20151115] hover:border-[#201511] transition flex flex-col justify-between shadow-sm overflow-hidden group"
                    >
                      <div>
                        <div className="aspect-[16/9] bg-zinc-900 overflow-hidden relative border-b border-[#20151110]">
                          <img
                            src={col.cover}
                            alt={col.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                          />
                          <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                            {col.badge || "COLEÇÃO ATIVA"}
                          </div>
                          <div className="absolute bottom-2 right-2 bg-white/90 text-black px-2 py-0.5 text-[10px] font-mono font-bold">
                            {col.productIds?.length || 0} Peças
                          </div>
                        </div>

                        <div className="p-5">
                          <h4 className="font-['Anton'] text-lg uppercase tracking-wider text-[#201511]">
                            {col.name}
                          </h4>
                          <p className="text-xs font-mono text-[#75584a] mt-1 line-clamp-2">
                            {col.tagline || "Sem manifesto definido."}
                          </p>

                          {/* Mini thumbnails of assigned products */}
                          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#20151110]">
                            {assignedProducts.slice(0, 4).map((p) => (
                              <img
                                key={p.id}
                                src={p.image}
                                alt=""
                                title={p.title}
                                className="w-8 h-8 object-contain bg-[#fbf9f5] border border-[#20151115] p-0.5 rounded-sm"
                              />
                            ))}
                            {assignedProducts.length > 4 && (
                              <span className="text-[10px] font-mono text-[#75584a]">
                                +{assignedProducts.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#fbf9f5] border-t border-[#20151110] flex items-center justify-between">
                        <button
                          onClick={() => setPreviewCollection(col)}
                          className="px-3 py-1.5 bg-white border border-[#20151125] text-xs font-mono font-bold uppercase text-[#201511] hover:bg-[#201511] hover:text-white transition flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          <span>Pré-visualizar</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditCollection(col)}
                            className="p-1.5 border border-[#20151125] hover:border-[#201511] text-[#201511] rounded"
                            title="Editar Catálogo"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCollection(col)}
                            className="p-1.5 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded"
                            title="Remover Catálogo"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 0: DASHBOARD & ANALYTICS OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#20151115] p-6 shadow-sm">
              <h3 className="font-['Anton'] text-lg uppercase tracking-wider text-[#201511] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">donut_large</span>
                <span>Estado das Encomendas</span>
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {["CONFIRMADO", "PAGO", "EM PREPARAÇÃO", "ENVIADO", "ENTREGUE"].map((st) => {
                  const count = allOrders.filter((o) => (o.status || "").toUpperCase() === st).length;
                  const pct = allOrders.length > 0 ? (count / allOrders.length) * 100 : 0;
                  return (
                    <div key={st}>
                      <div className="flex justify-between text-[#201511] mb-1">
                        <span>{st}</span>
                        <span className="font-bold">{count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-[#f0ede6] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#201511] h-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-[#20151115] p-6 shadow-sm">
              <h3 className="font-['Anton'] text-lg uppercase tracking-wider text-[#201511] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">warning</span>
                <span>Alertas de Inventário</span>
              </h3>
              {lowStockCount === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-emerald-700">
                  <span className="material-symbols-outlined text-3xl mb-1">check_circle</span>
                  <p>Todos os produtos estão com níveis saudáveis de stock.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {products
                    .filter((p) => Number(p.stock || 25) <= 5)
                    .map((p) => (
                      <div key={p.id} className="p-2.5 bg-red-50 border border-red-200 text-xs font-mono flex items-center justify-between">
                        <div>
                          <strong className="text-red-900 block">{p.title}</strong>
                          <span className="text-red-700 text-[10px]">Stock Restante: {p.stock || 0} un.</span>
                        </div>
                        <button
                          onClick={() => handleQuickStockChange(p, 10)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase font-bold rounded"
                        >
                          +10 Stock
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-[#20151115] p-6 shadow-sm">
              <h3 className="font-['Anton'] text-lg uppercase tracking-wider text-[#201511] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">bolt</span>
                <span>Ações Rápidas do Administrador</span>
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full p-2.5 bg-[#fbf9f5] hover:bg-[#201511] hover:text-white border border-[#20151120] text-left transition flex items-center justify-between"
                >
                  <span>+ Criar Novo Produto</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button
                  onClick={() => {
                    handleTabChange("hero_catalogs");
                    setHeroCatalogSubTab("catalogs");
                  }}
                  className="w-full p-2.5 bg-[#fbf9f5] hover:bg-[#201511] hover:text-white border border-[#20151120] text-left transition flex items-center justify-between"
                >
                  <span>+ Criar Novo Catálogo / Coleção</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full p-2.5 bg-[#fbf9f5] hover:bg-[#201511] hover:text-white border border-[#20151120] text-left transition flex items-center justify-between"
                >
                  <span>Descarregar Relatório de Vendas (CSV)</span>
                  <span className="material-symbols-outlined text-sm">download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="bg-white border border-[#20151115] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#20151115] mb-4">
              <h3 className="font-['Anton'] text-lg uppercase tracking-wider text-[#201511]">
                Últimas Encomendas Registadas
              </h3>
              <button
                onClick={() => handleTabChange("orders")}
                className="text-xs font-mono uppercase font-bold text-[#201511] hover:underline"
              >
                Ver Todas ({allOrders.length}) &rarr;
              </button>
            </div>

            {allOrders.length === 0 ? (
              <p className="py-6 text-center font-mono text-xs text-[#75584a]">
                Ainda não foram realizadas compras na loja.
              </p>
            ) : (
              <div className="divide-y divide-[#20151110]">
                {allOrders.slice(0, 5).map((o) => (
                  <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
                    <div>
                      <span className="font-bold text-[#201511]">#{o.id.slice(-8).toUpperCase()}</span>
                      <span className="text-[#75584a] ml-2">
                        {o.customerName || "Cliente"} ({o.customerEmail})
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#201511]">€{Number(o.total).toFixed(2)}</span>
                      <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 text-[10px] font-bold uppercase rounded">
                        {o.status || "CONFIRMADO"}
                      </span>
                      <span className="text-[10px] text-[#a89b91]">
                        {new Date(o.createdAt).toLocaleDateString("pt-PT")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: PRODUCTS & INVENTORY MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* DRAG AND DROP IMPORT AREA */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActiveMain(true);
            }}
            onDragLeave={() => setDragActiveMain(false)}
            onDrop={handleMainDrop}
            className={`border-2 border-dashed p-6 transition-all duration-200 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${
              dragActiveMain
                ? "border-[#201511] bg-amber-500/10 scale-[1.005]"
                : "border-[#20151125] bg-white hover:border-[#201511]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#201511] text-white flex items-center justify-center rounded-sm shrink-0">
                <span className="material-symbols-outlined text-2xl">drive_folder_upload</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#75584a]">
                    ÁREA DE IMPORTAÇÃO RÁPIDA // DRAG &amp; DROP
                  </span>
                </div>
                <h3 className="font-['Anton'] text-lg uppercase tracking-wider text-[#201511]">
                  Arraste Novos Produtos ou Importe da sua Máquina
                </h3>
                <p className="text-xs font-mono text-[#4e4541] mt-0.5">
                  Solte fotos diretamente aqui a partir da sua pasta/ambiente de trabalho para adicionar ao catálogo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <input
                ref={fileInputMainRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setIsAddModalOpen(true);
                    processImageFile(e.target.files[0], "product_add");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputMainRef.current?.click()}
                className="px-4 py-2.5 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] text-xs uppercase tracking-widest transition flex items-center gap-2 shadow"
              >
                <span className="material-symbols-outlined text-base">upload_file</span>
                <span>Importar do Computador</span>
              </button>
            </div>
          </div>

          {/* FILTER & SEARCH BAR */}
          <div className="bg-white border border-[#20151115] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
              <span className="material-symbols-outlined text-base text-[#75584a]">search</span>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Pesquisar produto por nome, ID ou SKU..."
                className="w-full bg-transparent text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="text-xs font-mono border border-[#20151120] px-2.5 py-1.5 bg-white focus:outline-none"
              >
                <option value="TODAS">Todas as Categorias</option>
                <option value="T-SHIRTS">T-SHIRTS</option>
                <option value="HOODIES">HOODIES</option>
                <option value="CALÇAS">CALÇAS</option>
                <option value="ACESSÓRIOS">ACESSÓRIOS</option>
              </select>

              <select
                value={productStockFilter}
                onChange={(e) => setProductStockFilter(e.target.value)}
                className="text-xs font-mono border border-[#20151120] px-2.5 py-1.5 bg-white focus:outline-none"
              >
                <option value="TODOS">Todos os Stocks</option>
                <option value="IN_STOCK">Apenas Em Stock</option>
                <option value="LOW_STOCK">Baixo Stock (&le; 5)</option>
              </select>

              <select
                value={productSort}
                onChange={(e) => setProductSort(e.target.value)}
                className="text-xs font-mono border border-[#20151120] px-2.5 py-1.5 bg-white focus:outline-none"
              >
                <option value="NEWEST">Mais Recentes</option>
                <option value="PRICE_ASC">Preço: Menor &rarr; Maior</option>
                <option value="PRICE_DESC">Preço: Maior &rarr; Menor</option>
                <option value="NAME">Nome A-Z</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS GRID WITH STOCK & ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const isLowStock = Number(prod.stock || 25) <= 5;
              const isOutOfStock = prod.inStock === false || Number(prod.stock || 25) <= 0;

              return (
                <div
                  key={prod.id}
                  className="bg-white border border-[#20151115] hover:border-[#201511] transition flex flex-col justify-between p-4 shadow-sm group"
                >
                  <div>
                    <div className="aspect-[4/5] bg-[#fbf9f5] overflow-hidden relative mb-3 flex items-center justify-center border border-[#20151110]">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/images/products/hero_david_feroz_black.jpg";
                        }}
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="bg-black/80 text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                          {prod.category}
                        </span>
                        {isOutOfStock ? (
                          <span className="bg-red-600 text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                            ESGOTADO
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-amber-600 text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase animate-pulse">
                            BAIXO STOCK
                          </span>
                        ) : null}
                      </div>

                      <div className="absolute top-2 right-2">
                        <span className="bg-white/90 border border-[#20151120] text-[#201511] px-1.5 py-0.5 text-[9px] font-mono font-bold">
                          {prod.sku || `FS-${prod.id.slice(0, 5).toUpperCase()}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-['Anton'] text-base uppercase text-[#201511]">
                        {prod.title}
                      </h3>
                      <span className="font-mono text-sm font-bold text-[#201511]">
                        €{Number(prod.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-[#75584a] font-mono line-clamp-1 mt-0.5">
                      {prod.subtitle}
                    </p>

                    <div className="mt-3 p-2.5 bg-[#fbf9f5] border border-[#20151110] flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[#75584a] uppercase block">INVENTÁRIO ATUAL</span>
                        <strong className={isLowStock ? "text-red-700" : "text-[#201511]"}>
                          {prod.stock !== undefined ? prod.stock : 25} unidades
                        </strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickStockChange(prod, -1)}
                          className="w-6 h-6 border border-[#20151125] bg-white hover:bg-black hover:text-white font-bold text-center leading-none flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStockChange(prod, 1)}
                          className="w-6 h-6 border border-[#20151125] bg-white hover:bg-black hover:text-white font-bold text-center leading-none flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStockToggle(prod)}
                          className={`ml-1 px-2 py-1 text-[9px] font-mono uppercase font-bold rounded ${
                            prod.inStock !== false ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {prod.inStock !== false ? "Ativo" : "Pausado"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#20151115] flex flex-wrap justify-between items-center gap-2">
                    <span className="text-[10px] font-mono text-[#75584a] uppercase">
                      ID: {prod.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCloneProduct(prod.id, prod.title)}
                        className="px-2.5 py-1.5 border border-[#20151125] hover:border-[#201511] text-[#201511] font-mono text-[11px] uppercase flex items-center gap-1"
                        title="Duplicar este produto"
                      >
                        <span className="material-symbols-outlined text-[13px]">content_copy</span>
                        <span>Duplicar</span>
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="px-2.5 py-1.5 border border-[#20151130] hover:border-[#201511] text-[#201511] hover:bg-[#201511] hover:text-white transition font-mono text-[11px] uppercase flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">edit</span>
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.title)}
                        className="px-2.5 py-1.5 border border-[#ba1a1a]/40 text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white transition font-mono text-[11px] uppercase flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ORDERS & FULFILLMENT MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#20151115] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
              <span className="material-symbols-outlined text-base text-[#75584a]">search</span>
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Pesquisar por ID, cliente, email ou código de rastreio..."
                className="w-full bg-transparent text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#75584a]">Estado:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs font-mono border border-[#20151120] px-2.5 py-1.5 bg-white focus:outline-none"
              >
                <option value="TODAS">Todas ({allOrders.length})</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="PAGO">Pago</option>
                <option value="EM PREPARAÇÃO">Em Preparação</option>
                <option value="ENVIADO">Enviado</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#20151115]">
              <span className="material-symbols-outlined text-4xl text-[#75584a] mb-2">local_shipping</span>
              <p className="font-mono text-xs text-[#75584a]">Nenhuma encomenda encontrada com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white border border-[#20151115] p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#20151110]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-['Anton'] text-lg text-[#201511]">
                          ENCOMENDA #{order.id?.slice(-8).toUpperCase()}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                            order.status === "ENTREGUE"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "ENVIADO"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "PAGO"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status || "CONFIRMADO"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#75584a]">
                        Cliente: <strong className="text-[#201511]">{order.customerName || "Cliente"}</strong> ({order.customerEmail}) &bull; Data: {new Date(order.createdAt).toLocaleDateString("pt-PT")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase text-[#75584a]">Alterar Estado:</span>
                      <select
                        value={order.status || "CONFIRMADO"}
                        onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                        className="border border-[#20151125] text-xs font-mono py-1 px-2.5 bg-white focus:outline-none"
                      >
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="PAGO">PAGO</option>
                        <option value="EM PREPARAÇÃO">EM PREPARAÇÃO</option>
                        <option value="ENVIADO">ENVIADO</option>
                        <option value="ENTREGUE">ENTREGUE</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                    </div>
                  </div>

                  <div className="divide-y divide-[#20151108]">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "/images/products/hero_david_feroz_black.jpg"}
                            alt=""
                            className="w-10 h-10 object-contain bg-[#fbf9f5] border border-[#20151110] p-0.5"
                          />
                          <div>
                            <span className="font-bold text-[#201511]">{item.title}</span>
                            <span className="text-[#75584a] block text-[11px]">
                              Tamanho: {item.size || "M"} &bull; Qtd: {item.quantity || 1}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-[#201511]">
                          €{(Number(item.price) * (Number(item.quantity) || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#fbf9f5] border border-[#20151110] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                      <span className="font-bold uppercase text-[#201511]">Expedição &amp; Rastreio:</span>
                      <select
                        id={`carrier-${order.id}`}
                        defaultValue={order.carrier || "CTT Express"}
                        className="border border-[#20151125] py-1 px-2 bg-white text-xs font-mono"
                      >
                        <option value="CTT Express">CTT Express</option>
                        <option value="DHL Express">DHL Express</option>
                        <option value="FedEx">FedEx</option>
                        <option value="DPD Portugal">DPD Portugal</option>
                      </select>
                      <input
                        id={`tracking-${order.id}`}
                        type="text"
                        defaultValue={order.trackingCode || ""}
                        placeholder="Ex: PT8923419082"
                        className="border border-[#20151125] py-1 px-2.5 bg-white text-xs font-mono focus:outline-none flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const code = document.getElementById(`tracking-${order.id}`)?.value || "";
                          const carrier = document.getElementById(`carrier-${order.id}`)?.value || "CTT Express";
                          handleSaveOrderTracking(order.id, code, carrier);
                        }}
                        className="px-3 py-1 bg-[#201511] text-white font-mono text-xs uppercase font-bold hover:bg-[#4a3226]"
                      >
                        Salvar Rastreio
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#75584a] block uppercase">TOTAL PAGO</span>
                      <span className="font-['Anton'] text-xl text-[#201511]">
                        €{Number(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: COUPONS & DISCOUNT PROMOTIONS */}
      {/* ======================================================== */}
      {activeTab === "coupons" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Anton'] text-xl uppercase tracking-wider text-[#201511]">
                Gestão de Campanhas e Cupons de Desconto
              </h2>
              <p className="text-xs font-mono text-[#75584a] mt-0.5">
                Crie códigos promocionais válidos no checkout da loja (por percentagem ou valor fixo).
              </p>
            </div>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Criar Novo Cupom</span>
            </button>
          </div>

          <div className="bg-white border border-[#20151115] shadow-sm divide-y divide-[#20151115]">
            {coupons.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#75584a]">
                Nenhum cupom ativo no momento.
              </div>
            ) : (
              coupons.map((c) => (
                <div key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf9f6] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded flex items-center justify-center font-bold text-lg font-mono">
                      %
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Anton'] text-base uppercase tracking-wider text-[#201511]">
                          {c.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${
                            c.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {c.active ? "ATIVO" : "DESATIVADO"}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#75584a] mt-0.5">
                        Desconto: <strong>{c.type === "percentage" ? `${c.value}%` : `€${c.value}`}</strong> &bull; Compra mínima: €{c.minSpend || 0}
                      </p>
                      <span className="text-[10px] font-mono text-[#a89b91]">
                        Utilizações: {c.usageCount || 0} de {c.maxUsage || 100} limite
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCoupon(c)}
                      className={`px-3 py-1.5 border text-xs font-mono uppercase font-bold transition ${
                        c.active
                          ? "border-amber-400 text-amber-900 hover:bg-amber-100"
                          : "border-emerald-400 text-emerald-900 hover:bg-emerald-100"
                      }`}
                    >
                      {c.active ? "Desativar" : "Ativar"}
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(c)}
                      className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white text-xs font-mono uppercase transition flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CLIENTS CRM */}
      {/* ======================================================== */}
      {activeTab === "users" && (
        <div className="bg-white border border-[#20151115] shadow-sm">
          <div className="p-6 border-b border-[#20151115] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-['Anton'] text-xl uppercase tracking-wider text-[#201511]">
                Gestão de Utilizadores e Clientes
              </h2>
              <p className="text-xs font-mono text-[#75584a] mt-0.5">
                Controlo de contas de utilizador. Pode remover clientes ou gerir permissões.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-[#f7f5f0] border border-[#20151115] font-bold">
              Total: {registeredUsers.length} contas
            </span>
          </div>

          <div className="divide-y divide-[#20151115]">
            {registeredUsers.length === 0 ? (
              <div className="p-12 text-center text-[#75584a] font-mono">
                <span className="material-symbols-outlined text-4xl text-[#75584a]/40 mb-2">group_off</span>
                <p className="text-sm">Nenhum cliente carregado de momento.</p>
                <button
                  onClick={fetchAdminStats}
                  className="mt-3 px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-[#201511] transition"
                >
                  Recarregar Lista de Clientes
                </button>
              </div>
            ) : (
              registeredUsers.map((u) => {
                const isUserAdmin = u.role === "admin" || u.email.toLowerCase() === "admin@falstep.com";
                const userOrders = allOrders.filter((o) => o.customerEmail?.toLowerCase() === u.email.toLowerCase());
                const userSpend = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
                const isCurrentlyOnline = user?.email?.toLowerCase() === u.email?.toLowerCase();

                return (
                  <div key={u.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf9f6] transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isUserAdmin ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                      }`}>
                        {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#201511]">{u.name}</span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${
                              isUserAdmin
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {isUserAdmin ? "ADMINISTRADOR" : "CLIENTE"}
                          </span>
                          {isCurrentlyOnline && (
                            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-green-100 text-green-800 border border-green-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                              ONLINE AGORA (VOCÊ)
                            </span>
                          )}
                          {!isUserAdmin && userSpend > 150 && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-mono font-bold uppercase rounded">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-[#75584a] mt-0.5">{u.email}</p>
                      <span className="text-[10px] font-mono text-[#a89b91]">
                        Registo: {u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-PT") : "Data original"} &bull; {userOrders.length} compras feitas (€{userSpend.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {isUserAdmin ? (
                      <span className="text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded">
                        Conta Raiz Protegida
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="px-3.5 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 rounded shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_remove</span>
                        <span>Remover Cliente</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: STORE POLICIES & BRANDING SETTINGS */}
      {/* ======================================================== */}
      {activeTab === "settings" && (
        <div className="bg-white border border-[#20151115] shadow-sm p-6 md:p-8">
          <div className="border-b border-[#20151115] pb-4 mb-6">
            <h2 className="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">
              Personalização e Configurações da Loja
            </h2>
            <p className="text-xs font-mono text-[#75584a] mt-1">
              Altere as faixas promocionais, o limite de portes grátis e os contactos de suporte sem tocar em código.
            </p>
          </div>

          <form onSubmit={handleSaveStoreSettings} className="space-y-6 max-w-3xl">
            <div className="p-4 bg-[#fbf9f5] border border-[#20151115] space-y-4">
              <span className="font-['Anton'] text-sm uppercase tracking-wider text-[#201511] block">
                Faixa Promocional / Marquee Ticker
              </span>
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#201511] mb-1">
                  Texto da Faixa de Destaque
                </label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-[#fbf9f5] border border-[#20151115] space-y-4">
              <span className="font-['Anton'] text-sm uppercase tracking-wider text-[#201511] block">
                Políticas Comerciais &amp; Contactos
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#201511] mb-1">
                    Portes Grátis a Partir de (€)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: e.target.value })}
                    className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#201511] mb-1">
                    E-mail de Apoio
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#201511] mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="py-4 px-8 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-widest transition shadow-xl"
            >
              Guardar Todas as Configurações &rarr;
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT COLLECTION */}
      {/* ======================================================== */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsCollectionModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl bg-white border border-[#201511] p-6 md:p-8 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#20151115]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#75584a]">
                  CATÁLOGOS E LOOKBOOKS FALSTEP
                </span>
                <h3 className="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">
                  {editingCollection ? "Editar Catálogo / Coleção" : "Criar Novo Catálogo"}
                </h3>
              </div>
              <button onClick={() => setIsCollectionModalOpen(false)} className="p-1 hover:bg-[#f7f5f0] rounded">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="py-6 space-y-5 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-[#201511] mb-1">
                    Nome do Catálogo / Coleção *
                  </label>
                  <input
                    type="text"
                    required
                    value={collectionForm.name}
                    onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                    placeholder="Ex: DROP 08 // OBSIDIAN NOIR"
                    className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#201511] mb-1">
                    Etiqueta / Badge Superior
                  </label>
                  <input
                    type="text"
                    value={collectionForm.badge}
                    onChange={(e) => setCollectionForm({ ...collectionForm, badge: e.target.value })}
                    placeholder="Ex: EDIÇÃO LIMITADA // 100 PEÇAS"
                    className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold text-[#201511] mb-1">
                  Manifesto / Descrição do Catálogo
                </label>
                <textarea
                  rows={2}
                  value={collectionForm.tagline}
                  onChange={(e) => setCollectionForm({ ...collectionForm, tagline: e.target.value })}
                  placeholder="Conceito criativo, cortes e características deste drop..."
                  className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none"
                />
              </div>

              {/* Cover Image with Drag & Drop */}
              <div>
                <label className="block uppercase font-bold text-[#201511] mb-1">
                  Foto de Capa do Catálogo
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActiveCol(true);
                  }}
                  onDragLeave={() => setDragActiveCol(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveCol(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processImageFile(e.dataTransfer.files[0], "collection_cover");
                    }
                  }}
                  onClick={() => fileInputColRef.current?.click()}
                  className={`border-2 border-dashed p-4 text-center cursor-pointer transition rounded-sm mb-2 ${
                    dragActiveCol ? "border-[#201511] bg-amber-500/10" : "border-[#20151125] bg-[#fbf9f5]"
                  }`}
                >
                  <input
                    ref={fileInputColRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processImageFile(e.target.files[0], "collection_cover");
                      }
                    }}
                  />
                  {collectionForm.customCoverUrl ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={collectionForm.customCoverUrl} alt="" className="w-16 h-10 object-cover border" />
                      <span className="font-bold text-emerald-800">Capa Carregada do Computador</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[#201511]">Arraste uma foto da sua máquina ou clique para escolher</p>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.slice(0, 4).map((img) => (
                    <div
                      key={img.url}
                      onClick={() => setCollectionForm({ ...collectionForm, cover: img.url, customCoverUrl: "" })}
                      className={`p-1 border cursor-pointer ${
                        collectionForm.cover === img.url && !collectionForm.customCoverUrl
                          ? "border-[#201511] ring-2 ring-[#201511]"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-10 object-contain bg-[#fbf9f5]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Assign Products to Collection */}
              <div>
                <label className="block uppercase font-bold text-[#201511] mb-2">
                  Selecione as Peças Deste Catálogo ({collectionForm.productIds.length} selecionadas):
                </label>
                <div className="max-h-48 overflow-y-auto border border-[#20151120] p-2 space-y-1.5 bg-[#fbf9f5]">
                  {products.map((p) => {
                    const isChecked = collectionForm.productIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleCollectionProduct(p.id)}
                        className={`p-2 border cursor-pointer flex items-center justify-between transition ${
                          isChecked ? "bg-white border-[#201511] shadow-sm" : "bg-transparent border-transparent hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt="" className="w-8 h-8 object-contain bg-white border p-0.5" />
                          <div>
                            <span className="font-bold text-[#201511] block">{p.title}</span>
                            <span className="text-[10px] text-[#75584a]">€{Number(p.price).toFixed(2)} &bull; {p.category}</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 accent-[#201511]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#20151115] flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-widest transition shadow-xl"
                >
                  Guardar Catálogo &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-6 py-4 border border-[#20151120] text-[#201511] uppercase font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PREVIEW COLLECTION */}
      {/* ======================================================== */}
      {previewCollection && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setPreviewCollection(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-4xl bg-white border border-[#201511] p-6 md:p-8 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#20151115] mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#75584a] font-bold">
                  PRÉ-VISUALIZAÇÃO DE COMO O CLIENTE VERÁ ESTE CATÁLOGO
                </span>
                <h3 className="font-['Anton'] text-2xl uppercase tracking-wider text-[#201511]">
                  {previewCollection.name}
                </h3>
              </div>
              <button onClick={() => setPreviewCollection(null)} className="p-1 hover:bg-[#f7f5f0] rounded">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Banner preview */}
            <div className="relative aspect-[21/9] bg-black overflow-hidden mb-6 border border-[#20151120] rounded-sm">
              <img src={previewCollection.cover} alt="" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white max-w-lg">
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-widest mb-2 inline-block">
                  {previewCollection.badge}
                </span>
                <h2 className="font-['Anton'] text-3xl uppercase tracking-wider">{previewCollection.name}</h2>
                <p className="text-xs text-white/80 font-mono mt-1">{previewCollection.tagline}</p>
              </div>
            </div>

            <h4 className="font-['Anton'] text-base uppercase text-[#201511] mb-3">
              Peças Integradas Neste Catálogo ({previewCollection.productIds?.length || 0}):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {products
                .filter((p) => previewCollection.productIds?.includes(p.id))
                .map((p) => (
                  <div key={p.id} className="border border-[#20151115] p-2 bg-[#fbf9f5]">
                    <img src={p.image} alt="" className="w-full aspect-[4/5] object-contain bg-white mb-2" />
                    <h5 className="font-['Anton'] text-xs uppercase truncate text-[#201511]">{p.title}</h5>
                    <span className="text-[11px] font-mono font-bold text-[#201511]">€{Number(p.price).toFixed(2)}</span>
                  </div>
                ))}
            </div>

            <div className="pt-6 mt-6 border-t border-[#20151115] text-right">
              <button
                onClick={() => setPreviewCollection(null)}
                className="px-6 py-2.5 bg-[#201511] text-white font-['Anton'] text-xs uppercase tracking-wider"
              >
                Fechar Pré-visualização
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ======================================================== */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsEditModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-3xl bg-white border-2 border-[#201511] p-6 md:p-8 z-10 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#20151115]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#75584a] font-bold">
                  EDIÇÃO DE PRODUTO // ID: {editingProduct.id}
                </span>
                <h3 className="font-['Anton'] text-3xl uppercase tracking-wider text-[#201511] mt-0.5">
                  Editar Produto
                </h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="w-9 h-9 rounded-full hover:bg-[#f7f5f0] border border-transparent hover:border-[#20151120] flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-xl text-[#201511]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="py-6 space-y-6">
              {/* Row 1: Title & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:ring-1 focus:ring-[#201511] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Preço (€ EUR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:ring-1 focus:ring-[#201511] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Category, Color, Edition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  >
                    <option value="T-SHIRTS">T-SHIRTS</option>
                    <option value="HOODIES">HOODIES</option>
                    <option value="CALÇAS">CALÇAS</option>
                    <option value="ACESSÓRIOS">ACESSÓRIOS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Cor
                  </label>
                  <input
                    type="text"
                    value={editFormData.color}
                    onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Edição / Tiragem
                  </label>
                  <input
                    type="text"
                    value={editFormData.edition}
                    onChange={(e) => setEditFormData({ ...editFormData, edition: e.target.value })}
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Sizes & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-2">
                    Tamanhos Disponíveis
                  </label>
                  <div className="flex gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const exists = editFormData.sizes.includes(sz);
                          setEditFormData({
                            ...editFormData,
                            sizes: exists ? editFormData.sizes.filter((s) => s !== sz) : [...editFormData.sizes, sz],
                          });
                        }}
                        className={`flex-1 py-2 border text-xs font-mono font-bold transition active:scale-95 ${
                          editFormData.sizes.includes(sz)
                            ? "bg-[#201511] text-white border-[#201511] shadow-inner"
                            : "border-[#20151125] text-[#201511] hover:border-[#201511]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                      Stock (un.)
                    </label>
                    <input
                      type="number"
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({ ...editFormData, stock: Number(e.target.value) })}
                      className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                      Disponibilidade
                    </label>
                    <select
                      value={editFormData.inStock ? "true" : "false"}
                      onChange={(e) => setEditFormData({ ...editFormData, inStock: e.target.value === "true" })}
                      className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white font-bold"
                    >
                      <option value="true">✓ Em Stock</option>
                      <option value="false">✗ Esgotado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: PRIMARY DRAG & DROP / LOCAL MACHINE UPLOAD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono font-bold uppercase text-[#201511] flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#75584a]">upload_file</span>
                    Área para Arrastar Nova Foto // Importar da sua Máquina
                  </label>
                  <span className="text-[10px] font-mono text-[#75584a] font-bold">
                    PNG, JPG, WEBP • ARRASTE DIRETO
                  </span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActiveEdit(true);
                  }}
                  onDragLeave={() => setDragActiveEdit(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveEdit(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processImageFile(e.dataTransfer.files[0], "product_edit");
                    }
                  }}
                  onClick={() => fileInputEditRef.current?.click()}
                  className={`relative border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 rounded-sm ${
                    dragActiveEdit 
                      ? "border-[#201511] bg-amber-500/15 scale-[1.01]" 
                      : editFormData.customImageUrl 
                        ? "border-emerald-600 bg-emerald-50/50" 
                        : "border-[#20151130] hover:border-[#201511] bg-[#fbf9f5]"
                  }`}
                >
                  <input
                    ref={fileInputEditRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processImageFile(e.target.files[0], "product_edit");
                      }
                    }}
                  />

                  {editFormData.customImageUrl ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <div className="w-20 h-20 bg-white border border-emerald-500 rounded p-1 shadow-md overflow-hidden flex items-center justify-center">
                        <img 
                          src={editFormData.customImageUrl} 
                          alt="Uploaded product" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="text-left">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Foto Atualizada da Sua Máquina
                        </span>
                        <p className="text-[11px] font-mono text-[#4e4541] mt-1">
                          Clique ou arraste outro ficheiro para trocar de imagem.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <span className="material-symbols-outlined text-4xl text-[#75584a] mb-2 animate-bounce">
                        cloud_upload
                      </span>
                      <p className="text-xs font-mono font-bold uppercase text-[#201511]">
                        Arraste uma foto aqui ou clique para procurar no computador
                      </p>
                      <p className="text-[11px] font-mono text-[#75584a] mt-1">
                        Substitua a imagem do produto importando qualquer ficheiro da sua máquina.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 5: CHOOSE FROM EXISTING PRESETS */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-2">
                  Escolha uma Imagem da Coleção (Ou use a foto importada acima)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_IMAGES.map((img) => {
                    const isSelected = !editFormData.customImageUrl && editFormData.image === img.url;
                    return (
                      <div
                        key={img.url}
                        onClick={() => setEditFormData({ ...editFormData, image: img.url, customImageUrl: "" })}
                        className={`cursor-pointer border p-2 transition rounded-sm flex flex-col items-center text-center ${
                          isSelected
                            ? "border-[#201511] bg-[#f3efe8] ring-2 ring-[#201511] shadow-md"
                            : "border-[#20151120] bg-white hover:border-[#201511] opacity-75 hover:opacity-100"
                        }`}
                      >
                        <div className="w-16 h-16 bg-[#fbf9f5] flex items-center justify-center overflow-hidden mb-1.5 border border-[#20151110]">
                          <img src={img.url} alt={img.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="text-[10px] font-mono leading-tight line-clamp-1 font-bold text-[#201511]">
                          {img.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: EXTERNAL IMAGE URL */}
              <div>
                <input
                  type="text"
                  value={editFormData.customImageUrl || (!PRESET_IMAGES.some(p => p.url === editFormData.image) ? editFormData.image : "")}
                  onChange={(e) => setEditFormData({ ...editFormData, customImageUrl: e.target.value, image: e.target.value })}
                  placeholder="Ou cole aqui uma URL de imagem externa..."
                  className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none"
                />
              </div>

              {/* Row 7: Description */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                  Descrição do Produto
                </label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="Detalhes de caimento, sensação táctil, serigrafia de alta densidade..."
                  className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:outline-none"
                />
              </div>

              {/* Row 8: TECHNICAL SPECIFICATIONS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fbf9f5] p-3 border border-[#20151115]">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#75584a] mb-1">
                    Gramagem
                  </label>
                  <input
                    type="text"
                    value={editFormData.weight || "320 GSM"}
                    onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                    placeholder="320 GSM"
                    className="w-full border border-[#20151130] p-2 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#75584a] mb-1">
                    Origem
                  </label>
                  <input
                    type="text"
                    value={editFormData.origin || "Porto, Portugal"}
                    onChange={(e) => setEditFormData({ ...editFormData, origin: e.target.value })}
                    placeholder="Porto, Portugal"
                    className="w-full border border-[#20151130] p-2 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#75584a] mb-1">
                    Composição
                  </label>
                  <input
                    type="text"
                    value={editFormData.composition || "100% Algodão Orgânico"}
                    onChange={(e) => setEditFormData({ ...editFormData, composition: e.target.value })}
                    placeholder="100% Algodão Orgânico"
                    className="w-full border border-[#20151130] p-2 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#75584a] mb-1">
                    Tratamento
                  </label>
                  <input
                    type="text"
                    value={editFormData.treatment || "Lavagem Enzimática"}
                    onChange={(e) => setEditFormData({ ...editFormData, treatment: e.target.value })}
                    placeholder="Lavagem Enzimática"
                    className="w-full border border-[#20151130] p-2 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#20151115] flex gap-3">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-4 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-widest transition shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      A GUARDAR...
                    </>
                  ) : (
                    "GUARDAR ALTERAÇÕES →"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-4 border border-[#20151130] hover:border-[#201511] text-[#201511] uppercase font-bold text-xs tracking-wider"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD PRODUCT */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-3xl bg-white border-2 border-[#201511] p-6 md:p-8 z-10 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#20151115]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#75584a] font-bold">
                  FALSTEP ARCHIVE // NOVO LANÇAMENTO
                </span>
                <h3 className="font-['Anton'] text-3xl uppercase tracking-wider text-[#201511] mt-0.5">
                  Adicionar Novo Produto
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="w-9 h-9 rounded-full hover:bg-[#f7f5f0] border border-transparent hover:border-[#20151120] flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-xl text-[#201511]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="py-6 space-y-6">
              {/* Row 1: Title & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Savagery 911 Tee"
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:ring-1 focus:ring-[#201511] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Preço (€ EUR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="65.00"
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:ring-1 focus:ring-[#201511] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Category, Color, Edition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  >
                    <option value="T-SHIRTS">T-SHIRTS</option>
                    <option value="HOODIES">HOODIES</option>
                    <option value="CALÇAS">CALÇAS</option>
                    <option value="ACESSÓRIOS">ACESSÓRIOS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Cor
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Ex: Pitch Black"
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                    Edição / Tiragem
                  </label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    placeholder="LIMITED RUN // 150 PIECES"
                    className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Sizes & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-2">
                    Tamanhos Disponíveis
                  </label>
                  <div className="flex gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const exists = formData.sizes.includes(sz);
                          setFormData({
                            ...formData,
                            sizes: exists ? formData.sizes.filter((s) => s !== sz) : [...formData.sizes, sz],
                          });
                        }}
                        className={`flex-1 py-2 border text-xs font-mono font-bold transition active:scale-95 ${
                          formData.sizes.includes(sz)
                            ? "bg-[#201511] text-white border-[#201511] shadow-inner"
                            : "border-[#20151125] text-[#201511] hover:border-[#201511]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                      Stock (un.)
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                      Disponibilidade
                    </label>
                    <select
                      value={formData.inStock ? "true" : "false"}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.value === "true" })}
                      className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white font-bold"
                    >
                      <option value="true">✓ Em Stock</option>
                      <option value="false">✗ Esgotado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: PRIMARY DRAG & DROP / LOCAL MACHINE UPLOAD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono font-bold uppercase text-[#201511] flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#75584a]">upload_file</span>
                    Área para Arrastar Novos Produtos // Importar da sua Máquina
                  </label>
                  <span className="text-[10px] font-mono text-[#75584a] font-bold">
                    PNG, JPG, WEBP • ARRASTE DIRETO
                  </span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActiveAdd(true);
                  }}
                  onDragLeave={() => setDragActiveAdd(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveAdd(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processImageFile(e.dataTransfer.files[0], "product_add");
                    }
                  }}
                  onClick={() => fileInputAddRef.current?.click()}
                  className={`relative border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 rounded-sm ${
                    dragActiveAdd 
                      ? "border-[#201511] bg-amber-500/15 scale-[1.01]" 
                      : formData.customImageUrl 
                        ? "border-emerald-600 bg-emerald-50/50" 
                        : "border-[#20151130] hover:border-[#201511] bg-[#fbf9f5]"
                  }`}
                >
                  <input
                    ref={fileInputAddRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processImageFile(e.target.files[0], "product_add");
                      }
                    }}
                  />

                  {formData.customImageUrl ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <div className="w-20 h-20 bg-white border border-emerald-500 rounded p-1 shadow-md overflow-hidden flex items-center justify-center">
                        <img 
                          src={formData.customImageUrl} 
                          alt="Uploaded product" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="text-left">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Foto Importada com Sucesso da Sua Máquina
                        </span>
                        <p className="text-[11px] font-mono text-[#4e4541] mt-1">
                          Clique ou arraste outro ficheiro para substituir.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <span className="material-symbols-outlined text-4xl text-[#75584a] mb-2 animate-bounce">
                        cloud_upload
                      </span>
                      <p className="text-xs font-mono font-bold uppercase text-[#201511]">
                        Arraste uma foto aqui ou clique para procurar no computador
                      </p>
                      <p className="text-[11px] font-mono text-[#75584a] mt-1">
                        A foto selecionada será enviada e vinculada automaticamente ao novo produto.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 5: CHOOSE FROM EXISTING PRESETS */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-2">
                  Escolha uma Imagem da Coleção (Ou use o arquivo importado acima)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_IMAGES.map((img) => {
                    const isSelected = !formData.customImageUrl && formData.image === img.url;
                    return (
                      <div
                        key={img.url}
                        onClick={() => setFormData({ ...formData, image: img.url, customImageUrl: "" })}
                        className={`cursor-pointer border p-2 transition rounded-sm flex flex-col items-center text-center ${
                          isSelected
                            ? "border-[#201511] bg-[#f3efe8] ring-2 ring-[#201511] shadow-md"
                            : "border-[#20151120] bg-white hover:border-[#201511] opacity-75 hover:opacity-100"
                        }`}
                      >
                        <div className="w-16 h-16 bg-[#fbf9f5] flex items-center justify-center overflow-hidden mb-1.5 border border-[#20151110]">
                          <img src={img.url} alt={img.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="text-[10px] font-mono leading-tight line-clamp-1 font-bold text-[#201511]">
                          {img.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: EXTERNAL IMAGE URL */}
              <div>
                <input
                  type="text"
                  value={formData.customImageUrl || (!PRESET_IMAGES.some(p => p.url === formData.image) ? formData.image : "")}
                  onChange={(e) => setFormData({ ...formData, customImageUrl: e.target.value, image: e.target.value })}
                  placeholder="Ou cole aqui uma URL de imagem externa..."
                  className="w-full border border-[#20151130] p-2.5 text-xs font-mono focus:border-[#201511] focus:outline-none"
                />
              </div>

              {/* Row 7: Description */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#201511] mb-1.5">
                  Descrição do Produto
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes de caimento, sensação táctil, serigrafia de alta densidade..."
                  className="w-full border border-[#20151130] p-3 text-xs font-mono focus:border-[#201511] focus:outline-none"
                />
              </div>

              {/* Row 8: TECHNICAL SPECIFICATIONS (Gramagem, Origem, Composição, Tratamento) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fbf9f5] p-3 border border-[#20151115]">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#75584a] mb-1">
                    Gramagem
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="320 GSM"
                    className="w-full border border-[#20151130] p-2 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#75584a] mb-1">
                    Origem
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="Porto, Portugal"
                    className="w-full border border-[#20151130] p-2 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#75584a] mb-1">
                    Composição
                  </label>
                  <input
                    type="text"
                    value={formData.composition}
                    onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                    placeholder="100% Algodão Orgânico"
                    className="w-full border border-[#20151130] p-2 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#75584a] mb-1">
                    Tratamento
                  </label>
                  <input
                    type="text"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    placeholder="Lavagem Enzimática"
                    className="w-full border border-[#20151130] p-2 text-xs font-mono focus:border-[#201511] focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#20151115] flex gap-3">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-4 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-sm tracking-widest transition shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      A PROCESSAR...
                    </>
                  ) : (
                    "PUBLICAR PRODUTO NA LOJA →"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-4 border border-[#20151130] hover:border-[#201511] text-[#201511] uppercase font-bold text-xs tracking-wider"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE COUPON */}
      {/* ======================================================== */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsCouponModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-md bg-white border border-[#201511] p-6 z-10 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-[#20151115]">
              <h3 className="font-['Anton'] text-xl uppercase tracking-wider text-[#201511]">Criar Novo Cupom</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="p-1 hover:bg-[#f7f5f0] rounded">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="py-5 space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase font-bold text-[#201511] mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: VERÃO15 ou VIPDROP"
                  className="w-full border border-[#20151130] p-2.5 uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold text-[#201511] mb-1">Tipo</label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}
                    className="w-full border border-[#20151130] p-2.5 bg-white focus:outline-none"
                  >
                    <option value="percentage">Percentual (%)</option>
                    <option value="fixed">Valor Fixo (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#201511] mb-1">Valor *</label>
                  <input
                    type="number"
                    required
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                    className="w-full border border-[#20151130] p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold text-[#201511] mb-1">Gasto Mínimo (€)</label>
                  <input
                    type="number"
                    value={couponForm.minSpend}
                    onChange={(e) => setCouponForm({ ...couponForm, minSpend: Number(e.target.value) })}
                    className="w-full border border-[#20151130] p-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#201511] mb-1">Limite Usos</label>
                  <input
                    type="number"
                    value={couponForm.maxUsage}
                    onChange={(e) => setCouponForm({ ...couponForm, maxUsage: Number(e.target.value) })}
                    className="w-full border border-[#20151130] p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#20151115] flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#201511] hover:bg-[#4a3226] text-white font-['Anton'] uppercase text-xs tracking-wider"
                >
                  Criar Cupom &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-3 border border-[#20151120] text-[#201511] uppercase font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
