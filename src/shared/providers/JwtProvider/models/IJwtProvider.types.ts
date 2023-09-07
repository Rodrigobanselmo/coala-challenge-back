interface IJwtProvider {
  validateToken(token: string): Promise<{
    email: string;
    displayName: string;
    photoURL: string;
    uid: string;
  }>;
}

export { IJwtProvider };
