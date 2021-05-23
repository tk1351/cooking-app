import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TagsService } from '../../src/tags/tags.service';
import { TagRepository } from '../../src/tags/tags.repository';
import { mockCreateTagDto } from './tag.repository.spec';

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
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockTags),
  })),
  createTag: jest.fn(),
  delete: jest.fn(),
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
      tagsService.getAllTags = jest.fn().mockResolvedValue(mockTags);
      expect(tagsService.getAllTags).not.toHaveBeenCalled();

      const result = await tagsService.getAllTags();
      expect(tagsService.getAllTags).toHaveBeenCalled();
      expect(result).toEqual(mockTags);
    });
  });

  describe('getTagById', () => {
    it('tagRepository.findOne()を呼び、成功するとtagを返す', async () => {
      tagRepository.findOne.mockResolvedValue(mockTags[0]);

      const result = await tagsService.getTagById(1);
      expect(tagRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTags[0]);
    });

    it('tagが無い場合、errorを返す', async () => {
      tagRepository.findOne.mockResolvedValue(null);
      expect(tagsService.getTagById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTagsByRecipeId', () => {
    it('recipeIdをパラメーターとして渡し、成功するとtagsを返す', async () => {
      const result = await tagsService.getTagsByRecipeId(1);
      expect(result).toEqual(mockTags);
    });
  });

  describe('createTag', () => {
    it('tagRepository.createTag()を呼び、成功するとtagを返す', async () => {
      tagRepository.createTag.mockResolvedValue('someTags');
      expect(tagRepository.createTag).not.toHaveBeenCalled();

      const result = await tagsService.createTag(mockCreateTagDto);
      expect(result).toEqual('someTags');
      const { name, recipe, createdAt, updatedAt } = mockCreateTagDto;

      expect(tagRepository.createTag).toHaveBeenCalledWith({
        name,
        recipe,
        createdAt,
        updatedAt,
      });
    });
  });

  describe('updateTag', () => {
    it('tagを更新する', async () => {
      const save = jest.fn().mockResolvedValue(true);

      tagsService.getTagById = jest.fn().mockResolvedValue({
        id: 1,
        mockUpdateTagDto,
        save,
      });
      expect(tagsService.getTagById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await tagsService.updateTag(1, mockUpdateTagDto);
      expect(tagsService.getTagById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'タグ名の更新が完了しました' });
    });
  });

  describe('deleteTag', () => {
    it('tagを削除する', async () => {
      tagRepository.delete.mockResolvedValue({ affected: 1 });
      expect(tagRepository.delete).not.toHaveBeenCalled();

      await tagsService.deleteTag(1);
      expect(tagRepository.delete).toHaveBeenCalled();
    });

    it('tagが無い場合は、errorを返す', async () => {
      tagRepository.delete.mockResolvedValue({ affected: 0 });

      expect(tagsService.deleteTag(1)).rejects.toThrow(NotFoundException);
    });
  });
});
