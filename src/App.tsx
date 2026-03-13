import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
};

export default App;
