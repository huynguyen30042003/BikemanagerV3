"use client";

import { useRouter } from "next/navigation";
import { useCreateSupplier } from "../useSupplier";
import { useState } from "react";
export function useNewSupplierPageState() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Name: "",
    ContactPerson: "",
    Phone: "",
    Email: "",
    Address: "",
    TaxCode: "",
  });
  const createSupplier = useCreateSupplier();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Name || !formData.Email || !formData.Phone) {
      alert("Vui lòng điền tất cả thông tin bắt buộc");
      return;
    }
    createSupplier.mutate(formData, {
      onSuccess: () => {
        alert("Create successfull");
      },
    });
    router.push("/admin/suppliers");
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
}
