import SiderBarAdmin from "@/components/Common/SiderBarAdmin";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="w-full min-h-screen flex">
      <SiderBarAdmin/>
      <div className='flex-1 min-h-screen'>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
