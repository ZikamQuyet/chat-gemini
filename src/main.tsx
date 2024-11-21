import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/app.ts";
import ChatDetail from "./pages/ChatDetail.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/chat/info" />,
      },
      {
        path: "/chat/info",
        element: <ChatDetail />,
      },
      {
        path: "/chat/:id",
        element: <ChatDetail />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>
);
