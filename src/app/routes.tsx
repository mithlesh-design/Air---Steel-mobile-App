import { createBrowserRouter, Outlet, ScrollRestoration, useLocation } from "react-router";
import { Splash } from "./screens/Splash";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { Home } from "./screens/Home";
import { Archives } from "./screens/Archives";
import { Cockpit } from "./screens/Cockpit";
import { Profile } from "./screens/Profile";
import { Reader } from "./screens/Reader";
import { Cart } from "./screens/Cart";
import { MenuProvider } from "./context/MenuContext";
import { ReaderProvider } from "./context/ReaderContext";
import { MobileWrapper } from "./components/layout/MobileWrapper";
import { MenuOverlay } from "./components/layout/MenuOverlay";
import { ReaderOverlay } from "./components/layout/ReaderOverlay";
import { FloatingNav } from "./components/layout/FloatingNav";
import { AnimatePresence } from "motion/react";

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Outlet key={location.pathname} />
    </AnimatePresence>
  );
}

function RootLayout() {
  return (
    <MenuProvider>
      <ReaderProvider>
        <MobileWrapper>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <AnimatedOutlet />
          </div>
          <FloatingNav />
          <MenuOverlay />
          <ReaderOverlay />
          <ScrollRestoration />
        </MobileWrapper>
      </ReaderProvider>
    </MenuProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Splash },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "home", Component: Home },
      { path: "archives", Component: Archives },
      { path: "cockpit", Component: Cockpit },
      { path: "library", Component: Cockpit }, // legacy redirect
      { path: "profile", Component: Profile },
      { path: "reader", Component: Reader },
      { path: "cart", Component: Cart },
    ],
  },
]);