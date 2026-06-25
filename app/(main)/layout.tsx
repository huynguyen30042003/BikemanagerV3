import Navbar from "@/components/Common/Navbar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="px-5 container">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
