import loginService from "~/services/loginService";

export const useLoginService = () => {
  const service = reactive(new loginService());
  return service;
};
