interface IFirebaseProvider {
  validateGoogleToken(token: string): Promise<{
    user: {
      email: string;
      displayName: string;
      photoURL: string;
      uid: string;
    };
  }>;
}

export { IFirebaseProvider };
