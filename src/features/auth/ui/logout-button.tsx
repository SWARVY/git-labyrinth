import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui";
import { logout } from "../model/logout";

export function LogoutButton() {
  const { t } = useTranslation();

  return (
    <Button variant="ghost" size="sm" onClick={() => logout()}>
      {t("auth.logout")}
    </Button>
  );
}
