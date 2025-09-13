// context/AppContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Types
interface Sheet {
  id: string;
  name: string;
}

interface AppContextType {
  // Community sheets (backward compatibility)
  sheets: Sheet[];
  communitySheets: Sheet[];
  
  // Product sheets
  productSheets: Sheet[];
  
  // Loading states
  loading: {
    community: boolean;
    products: boolean;
  };
  
  // Error states
  errors: {
    community: string | null;
    products: string | null;
  };
  
  // Methods
  refreshSheets: (type?: 'community' | 'products' | 'all') => Promise<void>;
  
  // Utility methods
  isLoading: boolean;
  hasErrors: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [communitySheets, setCommunitySheets] = useState<Sheet[]>([]);
  const [productSheets, setProductSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState({
    community: true,
    products: true,
  });
  const [errors, setErrors] = useState({
    community: null as string | null,
    products: null as string | null,
  });

  const fetchCommunitySheets = async () => {
    try {
      setLoading(prev => ({ ...prev, community: true }));
      setErrors(prev => ({ ...prev, community: null }));
      
      const res = await fetch("/api/sheet-names?type=community");
      if (!res.ok) {
        throw new Error(`Failed to fetch community sheets: ${res.status}`);
      }
      
      const data = await res.json();
      setCommunitySheets(data.sheets || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load community sheets";
      setErrors(prev => ({ ...prev, community: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, community: false }));
    }
  };

  const fetchProductSheets = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setErrors(prev => ({ ...prev, products: null }));
      
      const res = await fetch("/api/sheet-names?type=products");
      if (!res.ok) {
        throw new Error(`Failed to fetch product sheets: ${res.status}`);
      }
      
      const data = await res.json();
      setProductSheets(data.sheets || []);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load product sheets";
      console.error("Failed to fetch product sheets:", err);
      setErrors(prev => ({ ...prev, products: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const refreshSheets = async (type: 'community' | 'products' | 'all' = 'all') => {
    const promises = [];
    
    if (type === 'community' || type === 'all') {
      promises.push(fetchCommunitySheets());
    }
    if (type === 'products' || type === 'all') {
      promises.push(fetchProductSheets());
    }
    
    await Promise.allSettled(promises);
  };

  // Initial fetch on mount
  useEffect(() => {
    refreshSheets('all');
  }, []);

  const contextValue: AppContextType = {
    // Backward compatibility - sheets points to community sheets
    sheets: communitySheets,
    communitySheets,
    productSheets,
    loading,
    errors,
    refreshSheets,
    
    // Utility computed values
    isLoading: loading.community || loading.products,
    hasErrors: Boolean(errors.community || errors.products),
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Main hook - throws error if used outside provider
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Backward compatibility - keeps your existing useSheets hook working
export function useSheets() {
  const { sheets, loading, errors } = useAppContext();
  return { 
    sheets,
    loading: loading.community,
    error: errors.community
  };
}

// Specific hooks for better organization
export function useCommunitySheets() {
  const { communitySheets, loading, errors, refreshSheets } = useAppContext();
  return {
    sheets: communitySheets,
    loading: loading.community,
    error: errors.community,
    refresh: () => refreshSheets('community'),
  };
}

export function useProductSheets() {
  const { productSheets, loading, errors, refreshSheets } = useAppContext();
  return {
    sheets: productSheets,
    loading: loading.products,
    error: errors.products,
    refresh: () => refreshSheets('products'),
  };
}

// Hook for getting both types
export function useAllSheets() {
  const { communitySheets, productSheets, loading, errors, refreshSheets, isLoading, hasErrors } = useAppContext();
  return {
    communitySheets,
    productSheets,
    loading,
    errors,
    isLoading,
    hasErrors,
    refresh: refreshSheets,
  };
}