import { Test } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from '../../src/users/users.repository';

const mockCredentialsDto = {
  email: 'test@example.com',
  password: 'testPassword',
};

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('registerAdmin', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('registerAdminに成功', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        userRepository.registerAdmin(mockCredentialsDto),
      ).resolves.not.toThrow();
    });

    it('emailが既に存在する場合は、conflict errorを返す', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(
        userRepository.registerAdmin(mockCredentialsDto),
      ).rejects.toThrow(ConflictException);
    });

    it('その他のerrorでは、InternalServer errorを返す', async () => {
      save.mockRejectedValue({ code: '111' });
      await expect(
        userRepository.registerAdmin(mockCredentialsDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('register', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });
    it('registerAdminに成功', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        userRepository.register(mockCredentialsDto),
      ).resolves.not.toThrow();
    });

    it('emailが既に存在する場合は、conflict errorを返す', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(userRepository.register(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('その他のerrorでは、InternalServer errorを返す', async () => {
      save.mockRejectedValue({ code: '111' });
      await expect(userRepository.register(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
