export function AlertBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3 rounded-xl flex gap-2 items-center">
      <i className="i-tabler-alert-triangle" />O fluxo KYC funciona{" "}
      <b>apenas em dispositivos móveis</b> (usa câmera e localização). Escaneie
      o QR para abrir no seu celular.
    </div>
  );
}
