import React, { createContext, useContext, useState, useEffect } from "react";

export interface App {
  id: string;
  account_id: string;
  name: string;
  environment: "development" | "production" | "staging";
  api_key: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  templateCount: number;
  notificationsSent: number;
  apiKeyCount: number;
  organization_id: string;
}

interface AppContextType {
  selectedApp: App | null;
  setSelectedApp: (app: App | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  // Load selected app from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("selected_app");
    if (stored) {
      try {
        setSelectedApp(JSON.parse(stored));
      } catch {
        localStorage.removeItem("selected_app");
      }
    }
  }, []);

  // Save selected app to localStorage when it changes
  useEffect(() => {
    if (selectedApp) {
      localStorage.setItem("selected_app", JSON.stringify(selectedApp));
    } else {
      localStorage.removeItem("selected_app");
    }
  }, [selectedApp]);

  return (
    <AppContext.Provider value={{ selectedApp, setSelectedApp }}>
      {children}
    </AppContext.Provider>
  );
};
