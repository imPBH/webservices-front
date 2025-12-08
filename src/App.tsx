import { AppRouter } from "./routes/AppRouter";
import { ToastContainer } from "./components/ui/Toast";
import { useToast } from "./hooks/useToast";
import { ToastContext } from "./contexts/ToastContext";

export function App() {
  const { toasts, removeToast, success, error, info } = useToast();

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      <AppRouter />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
