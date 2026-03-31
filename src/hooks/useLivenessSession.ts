import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface LivenessSessionParams {
  cpf: string;
}

interface LivenessSessionResponse {
  guid: string;
  redirect_url: string;
  submission_id: string;
}

export function useLivenessSession() {
  return useMutation({
    mutationFn: async ({ cpf }: LivenessSessionParams): Promise<LivenessSessionResponse> => {
      const integrationId =
        import.meta.env.VITE_INTEGRATION_ID || "integration_id_missing";

      const { data } = await api.post(
        "/links/generate",
        { cpf, integration_id: integrationId, flow: "liveness" },
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
