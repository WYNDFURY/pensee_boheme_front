import PenseeBohemeCredentials from "~/api/pensee_boheme/PenseeBohemeCredentials";

class indexProductService {
  private _models?: any;
  private _apiKey: string;

  constructor() {
    this._apiKey = new PenseeBohemeCredentials().apiKey;
  }

  async getProducts() {
    const data = await useFetch(`${this._apiKey}/products`);

    return data;
  }
}

export default indexProductService;
