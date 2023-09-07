import { InternalServerErrorException } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { IJwtProvider } from '../models/IJwtProvider.types';

class FirebaseProvider implements IJwtProvider {
  private firebaseApp: FirebaseApp;
  private firebaseAuth: Auth;
  private firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };

  constructor() {
    this.firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };

    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firebaseAuth = getAuth(this.firebaseApp);
    this.firebaseAuth.languageCode = 'pt-br';
  }

  async validateToken(token: string) {
    const credential = GoogleAuthProvider.credential(token);
    const result = await signInWithCredential(
      this.firebaseAuth,
      credential,
    ).catch((error) => {
      const errorMessage = error.message;
      throw new InternalServerErrorException(errorMessage);
    });

    return result.user;
  }
}

export { FirebaseProvider };
