export function StatusPill({ status }: { status?: string }) {
  const color =
    status === "approved"
      ? "bg-green-500"
      : status === "rejected"
        ? "bg-red-500"
        : status === "pending"
          ? "bg-yellow-500"
          : "bg-gray-400";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${color}`}
    >
      {status ? status.toUpperCase() : "AGUARDANDO"}
    </span>
  );
}
