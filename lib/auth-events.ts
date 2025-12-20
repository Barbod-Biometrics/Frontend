export type AuthEvent = "unauthorized";

type AuthEventHandler = (event: AuthEvent) => void;

let authEventHandler: AuthEventHandler | null = null;

export const setAuthEventHandler = (next: AuthEventHandler | null) => {
  authEventHandler = next;
};

export const emitAuthEvent = (event: AuthEvent) => {
  authEventHandler?.(event);
};
