import PenseeBohemeCredentials from "~/api/pensee_boheme/PenseeBohemeCredentials";

class loginService {
  private _apiKey: string;

  constructor() {
    this._apiKey = new PenseeBohemeCredentials().apiKey;
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    street: string,
    number: string,
    city: string,
    postalCode: string,
    country: string
  ) {
    const formData = {
      firstName,
      lastName,
      email,
      password,
      street,
      number,
      city,
      postalCode,
      country,
    };

    try {
      const data = await useFetch(`${this._apiKey}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (data.error) {
        console.error(data.error);
        throw new Error("Registration failed");
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow or handle as needed
    }
  }
}

export default loginService;
