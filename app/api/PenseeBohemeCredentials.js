class PenseeBohemeCredentials {
  constructor() {
    this.apiKey = useRuntimeConfig().public.apiBaseUrl
    // this.apiKey = 'http://192.168.0.175:8000/api'
  }
}

export default PenseeBohemeCredentials
