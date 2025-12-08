import { useStore } from "../store/store";
import type { RefreshResponse, ApiError } from "./auth/auth.types";

const AUTH_SERVICE_URL: string = import.meta.env.VITE_AUTH_SERVICE_URL;
const authEndpoint = AUTH_SERVICE_URL + "/auth";

const buildHeaders = (bearerToken?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  return { headers };
};

const defaultPostOptions: RequestInit = {
  method: "POST",
};

const defaultPatchOptions: RequestInit = {
  method: "PATCH",
};

const defaultPutOptions: RequestInit = {
  method: "PUT",
};

const defaultDeleteOptions: RequestInit = {
  method: "DELETE",
};

type FetchJsonParams = {
  url: string;
  options?: RequestInit;
  content?: unknown;
  retry?: boolean;
};

async function refreshAccessToken(): Promise<string | null> {
  const {
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    setLoggedIn,
    setUsername,
    setEmail,
    setRole,
    setUserId,
  } = useStore.getState();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${authEndpoint}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      setLoggedIn(false);
      setAccessToken("");
      setRefreshToken("");
      setUsername("");
      setEmail("");
      setRole(NaN);
      setUserId(NaN);
      return null;
    }

    const data = (await response.json()) as RefreshResponse;
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    setLoggedIn(false);
    setAccessToken("");
    setRefreshToken("");
    setUsername("");
    setEmail("");
    setRole(NaN);
    setUserId(NaN);
    return null;
  }
}

async function fetchJson({
  url,
  options,
  content,
  retry = true,
}: FetchJsonParams) {
  const body = content !== undefined ? JSON.stringify(content) : undefined;

  let response = await fetch(url, {
    ...(options || {}),
    body,
  });

  if (
    response.status === 401 &&
    retry &&
    !url.includes("/auth/login") &&
    !url.includes("/auth/register") &&
    !url.includes("/auth/refresh")
  ) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      const existingHeaders =
        (options?.headers as Record<string, string>) ?? {};
      const headers: Record<string, string> = {
        ...existingHeaders,
        Authorization: `Bearer ${newAccessToken}`,
      };

      response = await fetch(url, {
        ...(options || {}),
        headers,
        body,
      });
    } else {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = {
          errors: [{ message: "Unauthorized" }],
        } as ApiError;
      }
      return Promise.reject(errorBody);
    }
  }

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = {
        errors: [{ message: "Unknown error" }],
      } as ApiError;
    }

    return Promise.reject(errorBody);
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export const jsonApi = {
  get: ({
    url,
    options,
    bearerToken,
  }: {
    url: string;
    options?: RequestInit;
    bearerToken?: string;
  }) => {
    return fetchJson({
      url,
      options: { ...buildHeaders(bearerToken), ...options },
    });
  },

  post: ({
    url,
    content,
    options,
    bearerToken,
  }: {
    url: string;
    content?: unknown;
    options?: RequestInit;
    bearerToken?: string;
  }) => {
    return fetchJson({
      url,
      options: {
        ...buildHeaders(bearerToken),
        ...defaultPostOptions,
        ...options,
      },
      content,
    });
  },

  patch: ({
    url,
    content,
    options,
    bearerToken,
  }: {
    url: string;
    content: unknown;
    options?: RequestInit;
    bearerToken?: string;
  }) => {
    return fetchJson({
      url,
      options: {
        ...buildHeaders(bearerToken),
        ...defaultPatchOptions,
        ...options,
      },
      content,
    });
  },

  put: ({
    url,
    content,
    options,
    bearerToken,
  }: {
    url: string;
    content: unknown;
    options?: RequestInit;
    bearerToken?: string;
  }) => {
    return fetchJson({
      url,
      options: {
        ...buildHeaders(bearerToken),
        ...defaultPutOptions,
        ...options,
      },
      content,
    });
  },

  delete: ({
    url,
    content,
    options,
    bearerToken,
  }: {
    url: string;
    content?: unknown;
    options?: RequestInit;
    bearerToken?: string;
  }) => {
    return fetchJson({
      url,
      options: {
        ...buildHeaders(bearerToken),
        ...defaultDeleteOptions,
        ...options,
      },
      content,
    });
  },
};
