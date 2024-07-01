export const useHeaders = () => {
  const { getAuthToken } = useAuthToken();
  const { getAnonymousId } = useAnonymousId();

  // Getter for the headers
  const getHeaders = (): HeadersInit => {
    const authToken = getAuthToken();
    const headers: HeadersInit = { Application: "application/json" };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const anonymousId = getAnonymousId();
    if (anonymousId) {
      headers["X-Anonymous-Id"] = anonymousId;
    }

    return headers;
  };

  return { getHeaders };
};
