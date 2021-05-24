import { Test } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from '../../src/users/users.repository';

const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'testPassword',
    name: 'testName',
    bio: 'testBio',
    specialDish: 'test',
    favoriteDish: 'test',
    social: [],
  },
  {
    id: 2,
    email: 'test2@example.com',
    password: 'testPassword2',
    name: 'testName2',
    bio: 'testBio2',
    specialDish: 'test2',
    favoriteDish: 'test2',
    social: [],
  },
];

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

  describe('getAllUsers', () => {
    it('getAllUsersに成功する', async () => {
      const getMany = jest.fn().mockResolvedValue(mockUsers);
      const leftJoinAndSelect = jest.fn(() => ({ getMany }));
      userRepository.createQueryBuilder = jest.fn(() => ({
        leftJoinAndSelect,
      }));

      const result = await userRepository.getAllUsers();
      expect(userRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('getUserByIdに成功すると、該当のuserを返す', async () => {
      const getOne = jest.fn().mockResolvedValue(mockUsers[0]);
      const where = jest.fn(() => ({ getOne }));
      const leftJoinAndSelect = jest.fn(() => ({ where }));
      userRepository.createQueryBuilder = jest.fn(() => ({
        leftJoinAndSelect,
      }));

      const result = await userRepository.getUserById(1);
      expect(userRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockUsers[0]);
    });
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
