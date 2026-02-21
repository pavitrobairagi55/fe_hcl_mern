import { useState, useEffect } from "react";

// Simple pub-sub so toast can be triggered from anywhere
const listeners = new Set();
let nextId = 0;

export function toast(message, type = "error") {
  const id = ++nextId;
  listeners.forEach((fn) => fn({ id, message, type }));
  setTimeout(() => listeners.forEach((fn) => fn({ id, remove: true })), 3500);
}

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      if (t.remove) {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      } else {
        setToasts((prev) => [...prev, t]);
      }
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  return toasts;
}