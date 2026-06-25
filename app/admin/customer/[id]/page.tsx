"use client";

import { Button } from "@/components/ui/button";
import {
  useGetCustomersById,
  useGetCustomersVehicle,
} from "@/hooks/Customer/useCustomer";
import { ArrowLeft, Badge, Edit, Plus } from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { useEffect, useState } from "react";
import { Table } from "@/components/ui/Table";
import { CustomerVehicleRes } from "@/types/customer";
import { orderRes } from "@/types/order/order";
import { useGetOrder } from "@/hooks/Order/useOrder";
import { useGetRepairOrder } from "@/hooks/Repair/useRepairOrder";
import { repairOrderRes } from "@/types/repair";
import { useGetInstallmentContracts } from "@/hooks/Order/useInstallmentContracts";
import { InstallmentContractsRes } from "@/types/order/installment-contracts";

function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const searchByFromUrl = searchParams.get("searchBy") || "all";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const pageSizeFromUrl = Number(searchParams.get("pageSize")) || 10;
  const [page, setPage] = useState(pageFromUrl);
  const [pageSize, setPageSize] = useState(pageSizeFromUrl);
  const { data: customer, isLoading } = useGetCustomersById(id);
  const [activeTab, setActiveTab] = useState("overview");
  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: 500,
    initialValue: searchFromUrl,
  });
  const { data: customerVehicleReq, isLoading: isLoadingCustomerVehicle } =
    useGetCustomersVehicle(
      {
        Search: searchTerm,
        CustomerId: id,
        Page: page,
        PageSize: pageSize,
      },
      {
        enabled: activeTab === "vehicles",
      },
    );

  const { data: OrderReq, isLoading: isLoadingOrder } = useGetOrder(
    {
      Search: searchTerm,
      CustomerId: id,
      Page: page,
      PageSize: pageSize,
    },
    {
      enabled: activeTab === "orders",
    },
  );
  const { data: RepairOrderReq, isLoading: isLoadingRepairOrder } =
    useGetRepairOrder(
      {
        CustomerId: id,
        Page: page,
        PageSize: pageSize,
      },
      {
        enabled: activeTab === "repairs",
      },
    );
  const {
    data: installmentContractsRes,
    isLoading: isLoadinginstallmentContracts,
  } = useGetInstallmentContracts(
    {
      CustomerId: id,
      Page: page,
      PageSize: pageSize,
    },
    {
      enabled: activeTab === "installments",
    },
  );
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);
  useEffect(() => {
    const query = new URLSearchParams();

    if (searchTerm) {
      query.set("search", searchTerm);
    }

    query.set("page", page.toString());
    query.set("pageSize", pageSize.toString());

    router.replace(`${pathname}?${query.toString()}`);
  }, [searchTerm, page, pageSize, pathname, router]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };
  const columnsTableVehicle = [
    {
      key: "modelName",
      title: "Model Name",
    },
    {
      key: "plateNumber",
      title: "plateNumber",
    },
    {
      key: "frameNumber",
      title: "frameNumber",
    },
    {
      key: "engineNumber",
      title: "engineNumber",
    },
    {
      key: "batterySerial",
      title: "batterySerial",
    },
    {
      key: "purchaseDate",
      title: "purchaseDate",
    },
  ];
  const columnsTableOrder = [
    {
      key: "orderCode",
      title: "orderCode",
    },
    {
      key: "subTotal",
      title: "subTotal",
    },
    {
      key: "discountAmount",
      title: "discountAmount",
    },
    {
      key: "taxAmount",
      title: "taxAmount",
    },
    {
      key: "totalAmount",
      title: "totalAmount",
    },
    {
      key: "paymentMethod",
      title: "paymentMethod",
    },
    {
      key: "paymentStatus",
      title: "paymentStatus",
    },
    {
      key: "orderStatus",
      title: "orderStatus",
    },
    {
      key: "createdBy",
      title: "createdBy",
    },
  ];

  const columnsTableRepairOrder = [
    {
      key: "repairCode",
      title: "repairCode",
    },
    {
      key: "issueDescription",
      title: "issueDescription",
    },
    {
      key: "diagnosis",
      title: "diagnosis",
    },
    {
      key: "status",
      title: "status",
    },
    {
      key: "estimatedCost",
      title: "estimatedCost",
    },
    {
      key: "totalCost",
      title: "totalCost",
    },
    {
      key: "checkInAt",
      title: "checkInAt",
    },
  ];
  const columnsTableInstallmentContracts = [
    {
      key: "contractNumber",
      title: "contractNumber",
    },
    {
      key: "loanAmount",
      title: "loanAmount",
    },
    {
      key: "downPayment",
      title: "downPayment",
    },
    {
      key: "installmentMonths",
      title: "installmentMonths",
    },
    {
      key: "monthlyPayment",
      title: "monthlyPayment",
    },
    {
      key: "interestRate",
      title: "interestRate",
    },
    {
      key: "contractStatus",
      title: "contractStatus",
    },
  ];
  return (
    <div className="flex-1 min-h-screen">
      <div className="px-8 h-16 border-b text-[24px] flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/customers">
            <ArrowLeft size={18} />
            Quay lại
          </Link>
        </Button>

        <Link href="/admin/customers/new">
          <Button>
            <Edit size={18} />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      {!isLoading && customer && (
        <>
          <Card className="rounded-xl mx-8 mt-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl">
                    {customer.fullName}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    ID: {customer.id}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Email
                    </label>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Số điện thoại
                    </label>
                    <p className="font-medium">{customer.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Địa chỉ
                    </label>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Level
                    </label>
                    <p className="font-medium">{customer.customerLevel}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Tổng mua hàng
                    </label>
                    <p className="font-medium">{customer.totalOrders} lần</p>
                  </div>
                  {/* <div>
                <label className="text-sm text-muted-foreground">Liên hệ cuối cùng</label>
                <p className="font-medium">
                  {new Date(customer.lastPurchaseAt).toLocaleDateString('vi-VN')}
                </p>
              </div> */}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="overview"
            className="rounded-xl mx-8 mt-8"
          >
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="vehicles">Phương tiện</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="repairs">Sửa chữa</TabsTrigger>
              <TabsTrigger value="installments">Trả góp</TabsTrigger>
              <TabsTrigger value="warranty">Bảo hành</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tổng doanh thu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(customer.totalRevenue)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Phương tiện
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <div className="text-2xl font-bold">{vehicles.length}</div> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <div className="text-2xl font-bold">{orders.length}</div> */}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vehicles">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Danh sách phương tiện</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="">
                    {!isLoading && (
                      <Table<CustomerVehicleRes>
                        showIndex
                        data={customerVehicleReq?.items ?? []}
                        columns={columnsTableVehicle}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {!isLoadingOrder && (
              <TabsContent value="orders">
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Danh sách đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="">
                      {!isLoading && (
                        <Table<orderRes>
                          showIndex
                          data={OrderReq?.items ?? []}
                          columns={columnsTableOrder}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {!isLoadingRepairOrder && (
              <TabsContent value="repairs">
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Danh sách sửa chữa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="">
                      {!isLoading && (
                        <Table<repairOrderRes>
                          showIndex
                          data={RepairOrderReq?.items ?? []}
                          columns={columnsTableRepairOrder}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            {!isLoadinginstallmentContracts && (
              <TabsContent value="installments">
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Danh sách trả góp</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="">
                      {!isLoading && (
                        <Table<InstallmentContractsRes>
                          showIndex
                          data={installmentContractsRes?.items ?? []}
                          columns={columnsTableInstallmentContracts}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </>
      )}
    </div>
  );
}

export default Page;
