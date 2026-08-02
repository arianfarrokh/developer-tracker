import { ApolloLink } from "@apollo/client";
import { tap } from "rxjs/operators";

/** GraphQL extensions.code when token is missing or invalid */
const AUTH_NOT_AUTHENTICATED = "AUTH_NOT_AUTHENTICATED";
const AUTH_NOT_AUTHORIZED = "AUTH_NOT_AUTHORIZED";

const isAuthExemptPath = (pathname: string) => {
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  if (pathname === "/admin-login" || pathname.startsWith("/admin-login/"))
    return true;
  return false;
};

const getLoginPathForCurrentApp = (pathname: string) => {
  if (pathname.startsWith("/admin")) return "/admin-login";
  return "/login";
};

/**
 * When the API returns GRAPHQL errors with extensions.code === AUTH_NOT_AUTHENTICATED,
 * clears the token and redirects to the correct login page (admin vs user).
 */
export const createAuthExpiryRedirectLink = () =>
  new ApolloLink((_operation, forward) =>
    forward(_operation).pipe(
      tap((result) => {
        if (typeof window === "undefined") return;

        const errs = result.errors;
        if (errs == null || errs.length === 0) return;

        const hitsAuth = errs.some(
          (e) => e.extensions?.code === AUTH_NOT_AUTHENTICATED || e.extensions?.code === AUTH_NOT_AUTHORIZED,
        );
        if (!hitsAuth) return;

        if (isAuthExemptPath(window.location.pathname)) return;

        localStorage.removeItem("token");
        const next = getLoginPathForCurrentApp(window.location.pathname);
        window.location.replace(next);
      }),
    ),
  );
