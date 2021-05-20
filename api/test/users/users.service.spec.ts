import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../src/users/users.service';
import { UserRepository } from '../../src/users/user.repository';
import { UserRole } from '../../src/users/user.model';
import { AuthCredentialsDto } from '../../src/users/dto/auth-credentials.dto';
import { UpdateProfileDto } from '../../src/users/dto/update-profile.dto';

const mockUser = {
  id: 1,
  name: 'testName',
  email: 'test@example.com',
  password: 'testPassword',
  bio: 'testBio',
  favoriteDish: 'testDish',
  specialDish: 'testDish',
  role: UserRole.auth,
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

const mockAuthCredentialsDto: AuthCredentialsDto = {
  email: 'test@example.com',
  password: 'testPassword',
};

const mockUpdateProfileDto: UpdateProfileDto = {
  name: '',
  favoriteDish: '',
  specialDish: '',
  bio: '',
};

const mockUserRepository = () => ({
  getAllUsers: jest.fn(),
  findOne: jest.fn(),
  registerAdmin: jest.fn(),
  register: jest.fn(),
  validateUserPassword: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
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
      ],
    }).compile();

    usersService = await module.get<UsersService>(UsersService);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('getAllUsers', () => {
    it('全てのuserをrepositoryから取得する', async () => {
      usersService.getAllUsers = jest.fn().mockResolvedValue(mockUser);
      expect(usersService.getAllUsers).not.toHaveBeenCalled();

      const result = await usersService.getAllUsers();
      expect(usersService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('userRepository.findOne()を呼び、成功するとuserを返す', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.getUserById(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('userが無い場合、errorを返す', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(usersService.getUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('registerAdmin', () => {
    it('userRepository.registerAdmin()を呼び、成功するとuserを返す', async () => {
      userRepository.registerAdmin.mockResolvedValue('someUser');
      expect(userRepository.registerAdmin).not.toHaveBeenCalled();

      const result = await usersService.registerAdmin(mockAuthCredentialsDto);
      expect(result).toEqual('someUser');

      const { email, password } = mockAuthCredentialsDto;
      expect(userRepository.registerAdmin).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });

  describe('register', () => {
    it('userRepository.register()を呼び、成功するとuserを返す', async () => {
      userRepository.register.mockResolvedValue('someUser');
      expect(userRepository.register).not.toHaveBeenCalled();

      const result = await usersService.register(mockAuthCredentialsDto);
      expect(result).toEqual('someUser');

      const { email, password } = mockAuthCredentialsDto;
      expect(userRepository.register).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });

  describe('login', () => {
    it('userRepository.validateUserPassword()を呼び、成功するとtokenを返す', async () => {
      userRepository.validateUserPassword.mockResolvedValue('someToken');

      expect(userRepository.validateUserPassword).not.toHaveBeenCalled();

      const result = await usersService.login(mockAuthCredentialsDto);
      expect(userRepository.validateUserPassword).toHaveBeenCalled();

      // とりあえずaccessTokenが返ることだけ確認
      expect(result.accessToken).toBeUndefined();
    });

    it('authCredentialsDtoが不正の場合、errorを返す', () => {
      userRepository.validateUserPassword.mockResolvedValue(null);
      expect(usersService.login(mockAuthCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('updateUserProfile', () => {
    it('user profileを更新する', async () => {
      const save = jest.fn().mockResolvedValue(true);

      usersService.getUserById = jest.fn().mockResolvedValue({
        id: 1,
        mockUpdateProfileDto,
        save,
      });

      expect(usersService.getUserById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await usersService.updateUserProfile(
        1,
        mockUpdateProfileDto,
        mockUser,
      );
      expect(usersService.getUserById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.mockUpdateProfileDto).toEqual(mockUpdateProfileDto);
    });

    it('自身のデータではない場合は、errorを返す', async () => {
      const save = jest.fn().mockResolvedValue(true);

      usersService.getUserById = jest.fn().mockResolvedValue({
        id: 12345,
        mockUpdateProfileDto,
        save,
      });

      expect(
        usersService.updateUserProfile(1, mockUpdateProfileDto, mockUser),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteUser', () => {
    it('userを削除する', async () => {
      usersService.getUserById = jest.fn().mockResolvedValue({
        id: 1,
      });
      userRepository.delete.mockResolvedValue({ affected: 1 });
      expect(usersService.getUserById).not.toHaveBeenCalled();
      expect(userRepository.delete).not.toHaveBeenCalled();

      await usersService.deleteUser(1, mockUser);
      expect(userRepository.delete).toHaveBeenCalledWith({ id: mockUser.id });
    });

    it('userが見つからない場合は、errorを返す', () => {
      usersService.getUserById = jest.fn().mockResolvedValue({
        id: 1,
      });
      userRepository.delete.mockResolvedValue({ affected: 0 });
      expect(usersService.deleteUser(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('自身のデータではない場合は, errorを返す', () => {
      usersService.getUserById = jest.fn().mockResolvedValue({
        id: 12345,
      });

      expect(usersService.deleteUser(1, mockUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('deleteUserByAdmin', () => {
    it('admin権限でuserを削除する', async () => {
      userRepository.delete.mockResolvedValue({
        affected: 1,
      });
      expect(userRepository.delete).not.toHaveBeenCalled();

      await usersService.deleteUserByAdmin(1, mockAdmin);
      expect(userRepository.delete).toHaveBeenCalledWith({ id: mockUser.id });
    });

    it('userが見つからない場合は、errorを返す', () => {
      userRepository.delete.mockResolvedValue({
        affected: 0,
      });

      expect(usersService.deleteUserByAdmin(1, mockAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('admin権限がない場合は、errorを返す', () => {
      userRepository.delete.mockResolvedValue({
        affected: 1,
      });

      expect(usersService.deleteUserByAdmin(1, mockUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
