import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface KycSessionParams {
  cpf: string;
  webhook_url?: string;
  transaction_id?: string;
}

export function useKycSession() {
  return useMutation({
    mutationFn: async ({ cpf, webhook_url, transaction_id }: KycSessionParams) => {
      const integrationId =
        import.meta.env.VITE_INTEGRATION_ID || "integration_id_missing";
      
      const body: Record<string, string> = {
        cpf,
        integration_id: integrationId,
      };

      if (webhook_url) {
        body.webhook_url = webhook_url;
      }
      if (transaction_id) {
        body.transaction_id = transaction_id;
      }

      const { data } = await api.post(
        "/customer/register",
        body,
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
