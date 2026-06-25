"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useGetSupplierById, useUpdateSupplier } from "../useSupplier";
import { UpdateSupplierRequest } from "@/types/supplier/suppliers";

export function useEditSupplierPageState() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;
  const updateSupplier = useUpdateSupplier();
  const { data: supplier, isLoading } =
    useGetSupplierById(supplierId);

  const form = useForm<UpdateSupplierRequest>({
    defaultValues: {
      id: supplierId,
      Name: "",
      ContactPerson: "",
      Phone: "",
      Email: "",
      Address: "",
      TaxCode: "",
    },
  });

  useEffect(() => {
    if (!supplier?.data) return;

    form.reset({
      id: supplierId,
      Name: supplier.data.name ?? "",
      ContactPerson: supplier.data.contactPerson ?? "",
      Phone: supplier.data.phone ?? "",
      Email: supplier.data.email ?? "",
      Address: supplier.data.address ?? "",
      TaxCode: supplier.data.taxCode ?? "",
    });
  }, [supplier, form, supplierId]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!data.Name || !data.Email || !data.Phone) {
      alert("Vui lòng điền tất cả thông tin bắt buộc");
      return;
    }

    console.log(data);

    updateSupplier.mutate(data,{
      onSuccess:()=>{
         router.push("/admin/suppliers")
      }
    })

    router.push("/admin/suppliers");
  });

  return {
    form,
    isLoading,
    handleSubmit,
  };
}