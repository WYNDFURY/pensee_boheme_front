import PenseeBohemeCredentials from "~/api/pensee_boheme/PenseeBohemeCredentials";
import type { User } from "~/types/models";

export const useUserService = () => {
  const apiKey = new PenseeBohemeCredentials().apiKey;
  const userState = useState<User | null>("user", () => null);
  const { getAuthToken } = useAuthToken();
  const { setAnonymousId } = useAnonymousId();

  const checkIfAuth = async () => {
    // Check if user is authenticated

    const authToken = getAuthToken();

    if (authToken) {
      const response = await useFetch<{ user: User }>(`${apiKey}/me/user`, {
        headers: { Authorization: authToken },
      });

      const isInvalidToken = response.error.value?.statusCode === 422;
      if (isInvalidToken) {
        localStorage.removeItem("authToken");
        userState.value = null;
      }

      if (response.data.value) {
        userState.value = response.data.value.user;
      }
    }

    setAnonymousId();
  };

  return { checkIfAuth };
};
