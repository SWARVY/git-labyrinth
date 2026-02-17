import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "~/pages/dashboard";

export const Route = createFileRoute("/_authorized/dashboard")({
  component: DashboardPage,
});
