
import React, { createContext, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

export const PendingContext = createContext();

export const PendingProvider = ({ children, token, user }) => {
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch count from API
  const fetchPendingCount = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    try {
      const { data } = await axiosInstance.get(
        "/api/v1/admin/pending-students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingCount(data.length || 0);
    } catch {
      setPendingCount(0);
    }
  }, [token, user]);

  return (
    <PendingContext.Provider value={{ pendingCount, fetchPendingCount }}>
      {children}
    </PendingContext.Provider>
  );
};
