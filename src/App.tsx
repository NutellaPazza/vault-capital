import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ExplorePage from "./pages/ExplorePage";
import PoolDetailPage from "./pages/PoolDetailPage";
import PortfolioPage from "./pages/PortfolioPage";
import WalletPage from "./pages/WalletPage";
import MarketplacePage from "./pages/MarketplacePage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import ApplyPage from "./pages/ApplyPage";
import TermsPage from "./pages/TermsPage";
import RegulatoryPage from "./pages/RegulatoryPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FaqPage from "./pages/FaqPage";
import NotFound from "./pages/NotFound";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TryDemoPage from "./pages/TryDemoPage";
import { AuthProvider } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/try-demo" element={<TryDemoPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/pool/:poolId" element={<PoolDetailPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/regulatory" element={<RegulatoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
