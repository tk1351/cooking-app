import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../../src/users/jwt.strategy';
import { UserRepository } from '../../src/users/users.repository';
import { User } from '../../src/users/users.entity';

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
      user.sub = '12345';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ sub: '12345' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        sub: '12345',
      });
      expect(result).toEqual(user);
    });
  });

  it('userが見つからない場合、errorを返す', async () => {
    userRepository.findOne.mockResolvedValue(null);
    expect(jwtStrategy.validate({ sub: '12345' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
