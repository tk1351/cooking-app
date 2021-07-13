import { Test } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { AuthRepository } from '../../src/auth/auth.repository';

const mockAuthRepository = () => ({
  getAuthUser: jest.fn(),
});

describe('AuthService', () => {
  let authService;
  let authRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useFactory: mockAuthRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  describe('getAuthUser', () => {
    it('getAuthUserが成功すると、id, name, roleを返す', async () => {
      const selectUser = {
        id: '1',
        name: 'test',
        role: 'user',
      };

      authRepository.getAuthUser.mockResolvedValue(selectUser);

      const sub = '12345';
      const result = await authService.getAuthUser(sub);
      expect(authRepository.getAuthUser).toHaveBeenCalled();
      expect(result).toEqual(selectUser);
    });
  });
});
