"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import bike from "@/image/bike.svg";
import arrowLeft from "@/image/arrow-bar-to-left.svg";
import arrowRight from "@/image/arrow-bar-to-right.svg";
import chevronDown from "@/image/chevron-down.svg";

import {
  Barcode,
  Bike,
  Boxes,
  FolderTree,
  History,
  ImageIcon,
  Package,
  ShoppingBag,
  Star,
  Tags,
  Users,
  LucideIcon,
  CreditCard,
  ShoppingCart,
  Truck,
  FileText,
  Warehouse,
} from "lucide-react";

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type MenuGroup = {
  title: string;
  href: string;
  icon: LucideIcon;
  items?: MenuItem[];
};

export default function SiderBarAdmin() {
  const pathname = usePathname();

  const [isClose, setIsClose] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);
  useEffect(() => {
  if (!isResizing) return;

  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = e.clientX;

    // Giới hạn width
    const minWidth = 80;
    const maxWidth = 400;

    const width = Math.min(
      Math.max(newWidth, minWidth),
      maxWidth
    );

    setSidebarWidth(width);

    // Kéo nhỏ → tự đóng
    if (width <= 120) {
      setIsClose(true);
    }

    // Kéo rộng → tự mở
    if (width > 180) {
      setIsClose(false);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
}, [isResizing]);
  const router: MenuGroup[] = [
    {
      title: "Danh mục",
      href: "/admin/danhMucChung",
      icon: Users,
      items: [
        {
          title: "Danh mục chung",
          href: "/admin/danhMucChung",
          icon: Users,
        },
        {
          title: "Danh mục chi tiết",
          href: "/admin/danhMucChiTiet",
          icon: Star,
        },
      ],
    },
    {
      title: "Khách hàng",
      href: "/admin/customer",
      icon: Users,
      items: [
        {
          title: "Khách hàng",
          href: "/admin/customer",
          icon: Users,
        },
        {
          title: "Đánh giá",
          href: "/admin/customer/statistics",
          icon: Star,
        },
        {
          title: "Xe của khách",
          href: "/admin/customer/vehicles",
          icon: Bike,
        },
        {
          title: "Lịch sử sở hữu",
          href: "/admin/customer/ownerships",
          icon: History,
        },
      ],
    },
    {
      title: "Sản phẩm",
      href: "/admin/products",
      icon: Package,
      items: [
        {
          title: "Danh sách sản phẩm",
          href: "/admin/products/manage",
          icon: ShoppingBag,
        },
        {
          title: "Thương hiệu",
          href: "/admin/brands",
          icon: Tags,
        },
        {
          title: "Loại sản phẩm",
          href: "/admin/category",
          icon: FolderTree,
        },
        {
          title: "Quản lý sản phẩm",
          href: "/admin/products",
          icon: Package,
        },
        {
          title: "Hình ảnh sản phẩm",
          href: "/admin/product-images",
          icon: ImageIcon,
        },
        {
          title: "Biến thể sản phẩm",
          href: "/admin/product-variants",
          icon: Boxes,
        },
        {
          title: "Seri sản phẩm",
          href: "/admin/product-serials",
          icon: Barcode,
        },
      ],
    },
    {
      title: "Đơn hàng",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Trả góp",
      href: "/admin/installment-providers",
      icon: Package,
      items: [
        {
          title: "Nhà cung cấp",
          href: "/admin/installment-providers",
          icon: CreditCard,
        },
        {
          title: "Hợp đồng",
          href: "/admin/installment-contracts",
          icon: Package,
        },
      ],
    },
    {
      title: "Mua hàng",
      href: "/admin/suppliers",
      icon: FileText,
      items: [
        { 
          href: "/admin/suppliers", 
          title: "Nhà cung cấp", 
          icon: Truck 
        },
        {
          title: "Đơn mua hàng",
          href: "/admin/purchase-orders",
          icon: FileText
        },
      ],
    },
    { href: '/admin/warehouses', title: 'Kho hàng', icon: Warehouse },
    { href: '/admin/sales', title: 'Đơn hàng bán', icon: ShoppingCart },
  ];

  useEffect(() => {
    const activeGroup = router.find((group) =>
      group?.items?.some((item) => pathname === item.href),
    );

    if (activeGroup) {
      setOpenMenu(activeGroup.title);
    }
  }, [pathname]);
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      // Tablet + mobile → tự đóng
      setIsClose(true);
    } else {
      // Desktop → tự mở
      setIsClose(false);
    }
  };

  // Chạy ngay khi component render
  handleResize();

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
  return (
    <aside
      ref={sidebarRef} // [THÊM]
      style={{
        width: isClose ? 80 : sidebarWidth, // [THÊM]
      }}
      className={`
        sticky top-0 h-screen
        border-r bg-card
        ${!isResizing ? "transition-all duration-300" : ""} 
      `}
    >
      {/* Header */}
      <div
        className={`h-16 border-b
          flex items-center
          gap-3 px-4 ${isClose ? "justify-center" : ""}`}
      >
        <Image src={bike} alt="logo" width={36} height={36} />

        {!isClose && <h2 className="font-bold text-lg">Bike Manager</h2>}
      </div>

      {/* Menu */}
      <div className="p-3 space-y-2">
        {router.map((item) => {
          const Icon = item.icon;

          const hasChildren = item.items && item.items.length > 0;

          const isOpen = openMenu === item.title;

          const isParentActive = hasChildren
            ? item.items!.some((x) => pathname === x.href)
            : pathname === item.href;

          return (
            <div key={item.title}>
              {hasChildren ? (
                <>
                  {/* Parent có submenu */}
                  <button
                    onClick={() =>
                      setOpenMenu((prev) =>
                        prev === item.title ? null : item.title,
                      )
                    }
                    className={`
              w-full rounded-xl px-3 py-2
              flex items-center transition-colors
              ${
                isParentActive
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-slate-100"
              }
              ${isClose ? "justify-center" : "justify-between"}
            `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />

                      {!isClose && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </div>

                    {!isClose && (
                      <Image
                        src={chevronDown}
                        alt="down"
                        width={16}
                        height={16}
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Children */}
                  {isOpen && (
                    <div
                      className={`mt-2 flex flex-col gap-1 ${
                        isClose ? "" : "ml-4"
                      }`}
                    >
                      {item.items!.map((subItem) => {
                        const SubIcon = subItem.icon;

                        const isActive = pathname === subItem.href;

                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`
                      rounded-lg px-3 py-2
                      flex items-center gap-3
                      transition-colors
                      ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }
                      ${isClose ? "justify-center" : ""}
                    `}
                          >
                            <SubIcon size={18} />

                            {!isClose && <span>{subItem.title}</span>}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                /* Menu không có submenu */
                <Link
                  href={item.href}
                  className={`
            w-full rounded-xl px-3 py-2
            flex items-center gap-3
            transition-colors
            ${
              pathname === item.href
                ? "bg-blue-500 text-white"
                : "hover:bg-slate-100"
            }
            ${isClose ? "justify-center" : ""}
          `}
                >
                  <Icon size={20} />

                  {!isClose && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Toggle */}
      <div
  onMouseDown={() => setIsResizing(true)}
  className="
    absolute
    top-0
    right-0
    h-full
    w-1
    cursor-col-resize
    hover:bg-blue-400
    transition-colors
    z-10
  "
/>
      <Button
        variant="outline"
        size="icon"
        className="
          absolute
          bottom-4
          -right-5
          h-10 w-10
          rounded-full
          bg-white
          shadow-md
        "
        onClick={() => setIsClose((prev) => !prev)}
      >
        <Image src={isClose ? arrowRight : arrowLeft} alt="toggle" />
      </Button>
    </aside>
  );
}
