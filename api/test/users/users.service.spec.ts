import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/users.service';
import { UserRepository } from '../../src/users/users.repository';
import { UserRole } from '../../src/users/user.model';
import { RecipeLikesService } from '../../src/recipe-likes/recipe-likes.service';
import { SocialsService } from '../../src/socials/socials.service';

const mockUser = {
  id: 1,
  name: 'testName',
  email: 'test@example.com',
  password: 'testPassword',
  bio: 'testBio',
  favoriteDish: 'testDish',
  specialDish: 'testDish',
  role: UserRole.user,
  salt: 'testSalt',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAdmin = {
  id: 123,
  name: 'testName',
  email: 'test@example.com',
  password: 'testPassword',
  bio: 'testBio',
  favoriteDish: 'testDish',
  specialDish: 'testDish',
  role: UserRole.admin,
  salt: 'testSalt',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCreateUserDto = {
  name: 'testName',
  email: 'test@example.com',
  sub: '12345',
};

const mockUserRepository = () => ({
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  registerAdmin: jest.fn(),
  register: jest.fn(),
  validateUserPassword: jest.fn(),
  deleteUser: jest.fn(),
  deleteUserByAdmin: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

const mockRecipeLikesService = () => ({
  getRecipeLikesByUserId: jest.fn().mockResolvedValue(1),
  deleteRecipeLikes: jest.fn().mockResolvedValue(1),
  map: jest.fn(),
});

const mockSocialsService = () => ({
  deleteSocialsByUserId: jest.fn().mockResolvedValue({ affected: 1 }),
});

describe('Users service', () => {
  let usersService;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: RecipeLikesService, useFactory: mockRecipeLikesService },
        { provide: SocialsService, useFactory: mockSocialsService },
      ],
    }).compile();

    usersService = await module.get<UsersService>(UsersService);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('getAllUsers', () => {
    it('全てのuserをrepositoryから取得する', async () => {
      userRepository.getAllUsers = jest.fn().mockResolvedValue(mockUser);

      const result = await usersService.getAllUsers();
      expect(userRepository.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('getUserByIdを呼び、成功するとuserを返す', async () => {
      userRepository.getUserById.mockResolvedValue(mockUser[0]);

      const result = await usersService.getUserById(1);
      expect(result).toEqual(mockUser[0]);
      expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('registerAdmin', () => {
    it('userRepository.registerAdmin()を呼び、成功するとuserを返す', async () => {
      userRepository.registerAdmin.mockResolvedValue('someUser');
      expect(userRepository.registerAdmin).not.toHaveBeenCalled();

      const result = await usersService.registerAdmin(mockCreateUserDto);
      expect(result).toEqual('someUser');

      const { name, email, sub } = mockCreateUserDto;
      expect(userRepository.registerAdmin).toHaveBeenCalledWith({
        name,
        email,
        sub,
      });
    });
  });

  describe('register', () => {
    it('userRepository.register()を呼び、成功するとuserを返す', async () => {
      userRepository.register.mockResolvedValue('someUser');
      expect(userRepository.register).not.toHaveBeenCalled();

      const result = await usersService.register(mockCreateUserDto);
      expect(result).toEqual('someUser');

      const { name, email, sub } = mockCreateUserDto;
      expect(userRepository.register).toHaveBeenCalledWith({
        name,
        email,
        sub,
      });
    });
  });

  describe('deleteUser', () => {
    it('userを削除する', async () => {
      userRepository.deleteUser.mockResolvedValue({ affected: 1 });
      expect(userRepository.deleteUser).not.toHaveBeenCalled();

      await usersService.deleteUser(1, mockUser);
      expect(userRepository.deleteUser).toHaveBeenCalled();
    });
  });

  describe('deleteUserByAdmin', () => {
    it('admin権限でuserを削除する', async () => {
      userRepository.deleteUserByAdmin.mockResolvedValue({
        affected: 1,
      });
      expect(userRepository.deleteUserByAdmin).not.toHaveBeenCalled();

      await usersService.deleteUserByAdmin(1, mockAdmin);

      expect(userRepository.deleteUserByAdmin).toHaveBeenCalled();
    });
  });
});
