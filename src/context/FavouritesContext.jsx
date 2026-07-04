import { createContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

export const FavouritesContext = createContext(null);

function loadFavourites(username) {
  if (!username) return [];
  try {
    const saved = localStorage.getItem(`travel-planner-favourites-${username}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function FavouritesProvider({ children }) {
  const { username } = useAuth();
  const [favourites, setFavourites] = useState(() => loadFavourites(username));
  const skipSaveRef = useRef(true);

  useEffect(() => {
    skipSaveRef.current = true;
    setFavourites(loadFavourites(username));
  }, [username]);

  useEffect(() => {
    if (!username) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    localStorage.setItem(
      `travel-planner-favourites-${username}`,
      JSON.stringify(favourites)
    );
  }, [favourites, username]);

  const addToFavourites = (destination) => {
    if (favourites.some((item) => item._id === destination._id)) {
      toast.error("Already in saved trips");
      return;
    }
    setFavourites((prev) => [...prev, destination]);
    toast.success(`${destination.destination} added to saved trips`);
  };

  const removeFromFavourites = (id, silent = false) => {
    const item = favourites.find((f) => f._id === id);
    setFavourites((prev) => prev.filter((f) => f._id !== id));
    if (item && !silent) {
      toast.success(`${item.destination} removed from saved trips`);
    }
  };

  const isFavourite = (id) => favourites.some((item) => item._id === id);

  return (
    <FavouritesContext.Provider
      value={{ favourites, addToFavourites, removeFromFavourites, isFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}
