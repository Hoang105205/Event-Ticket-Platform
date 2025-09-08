// src/components/layout.tsx
import NavBar from "./nav-bar";

interface LayoutProps {
  children: React.ReactNode;
  showNavBar?: boolean; // Optional: để tắt navbar cho specific pages
}

const Layout: React.FC<LayoutProps> = ({ children, showNavBar = true }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {showNavBar && <NavBar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;