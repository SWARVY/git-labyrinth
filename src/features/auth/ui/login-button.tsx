import { Button } from "@shared/ui";
import { loginWithGithub } from "../model/login";

export function LoginButton() {
  return (
    <Button size="lg" onClick={() => loginWithGithub()}>
      모험 시작하기
    </Button>
  );
}
