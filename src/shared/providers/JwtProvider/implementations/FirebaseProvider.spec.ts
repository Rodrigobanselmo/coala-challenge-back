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

  describe('validateToken', () => {
    it('should validate a token successfully', async () => {
      const mockCredential = {};
      const mockSignInResult = { user: {} };
      const mockToken = 'mockToken';

      (GoogleAuthProvider.credential as jest.Mock).mockReturnValue(
        mockCredential,
      );
      (signInWithCredential as jest.Mock).mockResolvedValue(mockSignInResult);

      const result = await provider.validateToken(mockToken);

      expect(result).toBe(mockSignInResult.user);
    });

    it('should throw an InternalServerErrorException if signInWithCredential fails', async () => {
      const mockErrorMessage = 'mockError';
      (signInWithCredential as jest.Mock).mockRejectedValue({
        message: mockErrorMessage,
      });

      await expect(provider.validateToken('mockToken')).rejects.toThrow(
        new InternalServerErrorException(mockErrorMessage),
      );
    });
  });
});
