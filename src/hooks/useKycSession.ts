import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useKycSession() {
  return useMutation({
    mutationFn: async ({ cpf, flow }: { cpf: string; flow: string }) => {
      const { data } = await api.post(
        "/kyc/pre-register",
        { cpf, flow },
        {
          headers: {
            "x-public-key":
              import.meta.env.VITE_PUBLIC_KEY || "pk_dev_xxxxxxxxx",
          },
        }
      );
      return data;
    },
    retry: 1,
  });
}
