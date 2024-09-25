import Navbar from "@/components/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <NextTopLoader />
      <TooltipProvider>{children}</TooltipProvider>
    </main>
  );
}
