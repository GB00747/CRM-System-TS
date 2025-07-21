class TokenStorage {
  private accessToken : string | null = null

  setAccessToken(token: string) {
    this.accessToken = token
  }

  getAccessToken() {
    return this.accessToken
  }

  clearAccessToken() {
    this.accessToken = null
  }

}

export const tokenStorage = new TokenStorage()