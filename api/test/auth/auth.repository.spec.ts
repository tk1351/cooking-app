import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthRepository } from '../../src/auth/auth.repository';

describe('AuthRepository', () => {
  let authRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthRepository],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  describe('getAuthUser', () => {
    it('getAuthUserが成功すると、id, name, roleを返す', async () => {
      const selectUser = {
        id: '1',
        name: 'test',
        role: 'user',
      };

      authRepository.findOne = jest.fn().mockResolvedValue(selectUser);
      expect(authRepository.findOne).not.toHaveBeenCalled();

      const sub = '12345';
      const result = await authRepository.getAuthUser(sub);
      expect(authRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(selectUser);
    });

    it('userが見つからない場合はNotFoundを返す', async () => {
      authRepository.findOne = jest.fn().mockRejectedValue({ code: '404' });
      const sub = '98765';
      await expect(authRepository.getAuthUser(sub)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
