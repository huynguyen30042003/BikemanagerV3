import { getUserInfo, loginApi, registerApi } from "@/shared/api/auth.api";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      router.push("/login");
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useLogout = () => {
  return async () => {
    document.cookie = "access_token=; Max-Age=0; path=/";

    window.location.href = "/login";
  };
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],

    queryFn: getUserInfo,

    retry: false,
  });
};
