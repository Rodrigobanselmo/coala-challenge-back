import { UserCredential } from 'firebase/auth';

interface IFirebaseProvider {
  validateGoogleToken(token: string): Promise<UserCredential>;
}

export { IFirebaseProvider };
