import { Test } from '@nestjs/testing';
import { TagsService } from '../../src/tags/tags.service';
import { TagRepository } from '../../src/tags/tags.repository';
import { mockCreateTagDto } from './tags.repository.spec';

const mockTags = [
  {
    id: 1,
    name: 'testName',
    recipeId: 1,
  },
  {
    id: 2,
    name: 'testName2',
    recipeId: 2,
  },
];

const mockUpdateTagDto = {
  name: 'updateName',
};

const mockTagRepository = () => ({
  getAllTags: jest.fn(),
  getTagById: jest.fn(),
  getTagsByRecipeId: jest.fn(),
  createTag: jest.fn(),
  updateTag: jest.fn(),
  deleteTag: jest.fn(),
  deleteTagsByRecipeId: jest.fn(),
});

describe('Tags Service', () => {
  let tagsService;
  let tagRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: TagRepository, useFactory: mockTagRepository },
      ],
    }).compile();

    tagsService = await module.get<TagsService>(TagsService);
    tagRepository = await module.get<TagRepository>(TagRepository);
  });

  describe('getAllTags', () => {
    it('全てのtagsをrepositoryから取得する', async () => {
      tagRepository.getAllTags = jest.fn().mockResolvedValue(mockTags);
      expect(tagRepository.getAllTags).not.toHaveBeenCalled();

      const result = await tagsService.getAllTags();
      expect(tagRepository.getAllTags).toHaveBeenCalled();
      expect(result).toEqual(mockTags);
    });
  });

  describe('getTagById', () => {
    it('getTagByIdを呼び、成功するとtagを返す', async () => {
      tagRepository.getTagById.mockResolvedValue(mockTags[0]);

      const result = await tagsService.getTagById(1);
      expect(tagRepository.getTagById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTags[0]);
    });
  });

  describe('getTagsByRecipeId', () => {
    it('recipeIdをパラメーターとして渡し、成功するとtagsを返す', async () => {
      tagRepository.getTagsByRecipeId.mockResolvedValue(mockTags[0]);

      const result = await tagsService.getTagsByRecipeId(1);
      expect(tagRepository.getTagsByRecipeId).toHaveBeenCalled();
      expect(result).toEqual(mockTags[0]);
    });
  });

  describe('createTag', () => {
    it('tagRepository.createTag()を呼び、成功するとtagを返す', async () => {
      tagRepository.createTag.mockResolvedValue('someTags');
      expect(tagRepository.createTag).not.toHaveBeenCalled();

      const result = await tagsService.createTag(mockCreateTagDto);
      expect(result).toEqual('someTags');
    });
  });

  describe('updateTag', () => {
    it('tagを更新する', async () => {
      tagRepository.updateTag.mockResolvedValue('updateTag');
      expect(tagRepository.updateTag).not.toHaveBeenCalled();

      const result = await tagsService.updateTag(1, mockUpdateTagDto);
      expect(tagRepository.updateTag).toHaveBeenCalled();
      expect(result).toEqual('updateTag');
    });
  });

  describe('deleteTag', () => {
    it('tagを削除する', async () => {
      tagRepository.deleteTag.mockResolvedValue({ affected: 1 });
      expect(tagRepository.deleteTag).not.toHaveBeenCalled();

      await tagsService.deleteTag(1);
      expect(tagRepository.deleteTag).toHaveBeenCalled();
    });
  });

  describe('deleteTagsByRecipeId', () => {
    it('recipeIdが一致するtagを削除する', async () => {
      tagRepository.deleteTagsByRecipeId.mockResolvedValue({ affected: 1 });
      expect(tagRepository.deleteTagsByRecipeId).not.toHaveBeenCalled();

      await tagsService.deleteTagsByRecipeId(1);
      expect(tagRepository.deleteTagsByRecipeId).toHaveBeenCalled();
    });
  });
});
