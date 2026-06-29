import { createContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

export const OrdersContext = createContext(null);

function loadOrders(username) {
  if (!username) return [];
  try {
    const saved = localStorage.getItem(`travel-planner-orders-${username}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function OrdersProvider({ children }) {
  const { username } = useAuth();
  const [orders, setOrders] = useState(() => loadOrders(username));
  const skipSaveRef = useRef(true);

  useEffect(() => {
    skipSaveRef.current = true;
    setOrders(loadOrders(username));
  }, [username]);

  useEffect(() => {
    if (!username) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    localStorage.setItem(
      `travel-planner-orders-${username}`,
      JSON.stringify(orders)
    );
  }, [orders, username]);

  const addOrder = (destination) => {
    const order = {
      ...destination,
      orderId: `order-${Date.now()}`,
      orderedAt: new Date().toLocaleString(),
    };
    setOrders((prev) => [...prev, order]);
    toast.success(`Booked ${destination.destination} for ₹${destination.budget.estimated}`);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}
