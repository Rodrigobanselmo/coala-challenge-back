import { InternalServerErrorException } from '@nestjs/common';
import {
  GoogleAuthProvider,
  signInWithCredential,
  getAuth,
} from 'firebase/auth';
import { FirebaseProvider } from './FirebaseProvider';

jest.mock('firebase/app');
jest.mock('firebase/auth');

describe('FirebaseProvider', () => {
  let provider: FirebaseProvider;

  beforeEach(() => {
    (getAuth as jest.Mock).mockReturnValue({
      languageCode: 'en',
    });

    provider = new FirebaseProvider();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('validateGoogleToken', () => {
    it('should validate a token successfully', async () => {
      const mockCredential = {};
      const mockSignInResult = {};
      const mockToken = 'mockToken';

      (GoogleAuthProvider.credential as jest.Mock).mockReturnValue(
        mockCredential,
      );
      (signInWithCredential as jest.Mock).mockResolvedValue(mockSignInResult);

      const result = await provider.validateGoogleToken(mockToken);

      expect(result).toBe(mockSignInResult);
    });

    it('should throw an InternalServerErrorException if signInWithCredential fails', async () => {
      const mockErrorMessage = 'mockError';
      (signInWithCredential as jest.Mock).mockRejectedValue({
        message: mockErrorMessage,
      });

      await expect(provider.validateGoogleToken('mockToken')).rejects.toThrow(
        new InternalServerErrorException(mockErrorMessage),
      );
    });
  });
});
