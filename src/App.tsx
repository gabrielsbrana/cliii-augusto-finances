import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Receitas from "./pages/Receitas";
import Despesas from "./pages/Despesas";
import Metas from "./pages/Metas";
import PlanejamentoOrcamental from "./pages/PlanejamentoOrcamental";
import Relatorios from "./pages/Relatorios";
import Dicas from "./pages/Dicas";
import Perfil from "./pages/Perfil";
import Dividas from "./pages/Dividas";
import SoicQuickTap from "./pages/SoicQuickTap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/planejamento" element={<PlanejamentoOrcamental />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/dicas" element={<Dicas />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/dividas" element={<Dividas />} />
          <Route path="/quick-tap" element={<SoicQuickTap />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
