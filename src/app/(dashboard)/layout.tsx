import Navbar from "@/components/navbar";
import NextTopLoader from 'nextjs-toploader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <NextTopLoader />
      {children}
    </main>
  );
}
