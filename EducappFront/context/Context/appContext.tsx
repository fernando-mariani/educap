import { useContext } from "react";
import { Context } from "./context";

export function useAppContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useAppContext must be used within a ContextProvider");
  }

  return context;
}