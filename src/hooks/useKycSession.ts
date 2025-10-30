import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useKycSession() {
  return useMutation({
    mutationFn: async ({ cpf }: { cpf: string }) => {
      const integrationId =
        import.meta.env.VITE_INTEGRATION_ID || "integration_id_missing";
      const { data } = await api.post(
        "/customer/register",
        { cpf, integration_id: integrationId },
        {
          headers: {
            Authorization: `Bearer ${
              import.meta.env.VITE_PUBLIC_KEY || "pk_dev_xxxxxxxxx"
            }`,
          },
        }
      );
      return data;
    },
    retry: 1,
  });
}
