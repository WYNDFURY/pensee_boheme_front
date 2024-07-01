export const useAnonymousId = () => {
  const getAnonymousId = () => {
    return localStorage.getItem("anonymous_id") || undefined;
  };

  const setAnonymousId = () => {
    if (!getAnonymousId()) {
      localStorage.setItem("anonymous_id", crypto.randomUUID());
    }
  };

  return { getAnonymousId, setAnonymousId };
};
