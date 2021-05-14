import { Test } from '@nestjs/testing';
import { UserRepository } from '../../src/users/user.repository';

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });
});
