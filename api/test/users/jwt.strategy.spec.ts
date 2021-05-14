import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../../src/users/jwt.strategy';
import { UserRepository } from '../../src/users/user.repository';
import { User } from '../../src/users/user.entity';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('JWT payloadに基づいてバリデーションを行い、userを返す', async () => {
      const user = new User();
      user.email = 'test@example.com';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ email: 'test@example.com' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(user);
    });
  });

  it('userが見つからない場合、errorを返す', async () => {
    userRepository.findOne.mockResolvedValue(null);
    expect(jwtStrategy.validate({ email: 'test@example.com' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
