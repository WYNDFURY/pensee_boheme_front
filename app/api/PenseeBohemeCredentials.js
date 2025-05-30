class PenseeBohemeCredentials {
  constructor() {
    this.apiKey = useRuntimeConfig().public.apiBaseUrl
    // this.apiKey = 'http://127.0.0.1:8000/api'
  }
}

export default PenseeBohemeCredentials
