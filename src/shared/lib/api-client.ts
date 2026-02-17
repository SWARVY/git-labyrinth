import * as v from "valibot";
import { loginWithGithub } from "@features/auth";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let isRedirecting = false;

export async function fetchJson<T>(
  url: string,
  schema: v.GenericSchema<unknown, T>,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    if (res.status === 401 && !isRedirecting) {
      isRedirecting = true;
      loginWithGithub();
      throw new ApiError(401, "Session expired. Redirecting to login...");
    }

    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new ApiError(res.status, body.error ?? `HTTP ${res.status}`);
  }

  const json = await res.json();
  return v.parse(schema, json);
}
