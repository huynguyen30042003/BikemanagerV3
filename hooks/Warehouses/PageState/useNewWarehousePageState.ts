"use client";

import { useRouter } from "next/navigation";
import { useCreateWarehouse } from "../useWarehouse";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";
import { useGetBrands } from "@/hooks/Product/useBrand";

const schema = z.object({
  BranchId: z.string().uuid("Vui lòng chọn thương hiệu"),

  Name: z
    .string()
    .min(1, "Tên kho là bắt buộc")
    .max(255),

  Address: z
    .string()
    .min(1, "Địa chỉ là bắt buộc")
    .max(255),
});

export type FormValues = z.infer<typeof schema>;

export function useNewWarehousePageState() {
  const router = useRouter();

  const create = useCreateWarehouse();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      BranchId: "",

      Name: "",

      Address: "",
    },
  });
  const { data: brandsData } = useGetBrands({ pageSize: 100 });
  const brands = brandsData?.data?.items ?? [];
  const onSubmit = (data: FormValues) => {
    create.mutate(data, {
      onSuccess: () => {
        alert("Create successful");

        router.push("/admin/warehouses");
      },
    });
  };

  return {
    form,
    brands,
    onSubmit,
    isLoading: create.isPending,
  };
}