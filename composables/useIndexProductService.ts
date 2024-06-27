import indexProductService from "~/services/indexProductService";

export const useIndexProductService = () => {
  const service = reactive(new indexProductService());
  return service;
};
