import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen min-w-0 bg-gray-50 overflow-x-hidden">
      <Outlet />
    </div>
  ),
});
