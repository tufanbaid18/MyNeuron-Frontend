import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "jotai";
import { appStore } from "./store/auth.store";

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={appStore}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
