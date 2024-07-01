export const useAuthToken = () => {
  const getAuthToken = () => {
    return localStorage.getItem("auth_token") || undefined;
  };

  const setAuthToken = (token: string) => {
    localStorage.setItem("auth_token", token);
  };

  return { getAuthToken, setAuthToken };
};
