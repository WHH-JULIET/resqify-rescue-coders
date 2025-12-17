import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";

// Pages
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CharacterSelect from "./pages/setup/CharacterSelect";
import LayoutSelect from "./pages/setup/LayoutSelect";
import ProfileSetup from "./pages/setup/ProfileSetup";
import Home from "./pages/Home";
import MapPage from "./pages/Map";
import Contacts from "./pages/Contacts";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/setup/character" element={<CharacterSelect />} />
              <Route path="/setup/layout" element={<LayoutSelect />} />
              <Route path="/setup/profile" element={<ProfileSetup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
