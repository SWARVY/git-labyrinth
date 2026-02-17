import { createFileRoute } from "@tanstack/react-router";
import { MyCardPage } from "~/pages/my-card";

export const Route = createFileRoute("/_authorized/my-card")({
  component: MyCardPage,
});
