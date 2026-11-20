import React, { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { SpotlightCursor } from "./components/SpotlightCursor";
import { AuthModal } from "./components/AuthModal";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";
import { SalesPage } from "./pages/SalesPage";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { PRODUCTS } from "./data/products";

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [activePage, setActivePage] = useState("home"); // "home" | "catalog" | "product" | "sales" | "account" | "admin"
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);

  const handleBuyNow = (product, size = "L") => {
    setDirectCheckoutItem({ product, size, qty: 1 });
    setActivePage("sales");
    try { window.scrollTo(0, 0); } catch (e) {}
  };

  // STRICT SECURITY GUARD: If activePage is "admin" but user is not admin, instantly redirect to "home"
  useEffect(() => {
    if (activePage === "admin" && !isAdmin) {
      setActivePage("home");
    }
  }, [activePage, isAdmin]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActivePage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckout = () => {
    setDirectCheckoutItem(null); // checkout full cart
    setActivePage("sales");
    try { window.scrollTo(0, 0); } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#1a1c1c] flex flex-col font-['Hanken_Grotesk',sans-serif]">
      <SpotlightCursor />
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1">
        {activePage === "home" && (
          <HomePage
            setActivePage={setActivePage}
            onSelectProduct={handleSelectProduct}
            onCheckout={handleCheckout}
            onBuyNow={handleBuyNow}
          />
        )}

        {activePage === "catalog" && (
          <CatalogPage
            onSelectProduct={handleSelectProduct}
            onCheckout={handleCheckout}
            onBuyNow={handleBuyNow}
          />
        )}

        {activePage === "product" && (
          <ProductPage
            product={selectedProduct}
            onBack={() => setActivePage("catalog")}
            onCheckout={handleCheckout}
            onBuyNow={handleBuyNow}
          />
        )}

        {activePage === "sales" && (
          <SalesPage
            setActivePage={setActivePage}
            directCheckoutItem={directCheckoutItem}
          />
        )}

        {activePage === "account" && (
          <AccountPage
            setActivePage={setActivePage}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Admin panel rendered ONLY for verified admin. Kept mounted so all tabs, edits, and state persist seamlessly when checking the live store */}
        {isAdmin && (
          <div className={activePage === "admin" ? "block" : "hidden"}>
            <AdminPage setActivePage={setActivePage} />
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer onCheckout={handleCheckout} />
      <AuthModal
        onLoginSuccess={(u) => {
          if (u.role === "admin") {
            setActivePage("admin");
          } else {
            setActivePage("account");
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
