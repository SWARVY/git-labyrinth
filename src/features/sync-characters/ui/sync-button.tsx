import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui";
import { useSyncCharacters } from "../model/use-sync-characters";

export function SyncButton() {
  const { t } = useTranslation();
  const { mutate, isPending } = useSyncCharacters();

  return (
    <Button variant="outline" size="sm" onClick={() => mutate()} disabled={isPending}>
      {isPending ? t("sync.pending") : t("sync.idle")}
    </Button>
  );
}
