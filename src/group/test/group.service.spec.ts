import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Group } from '../group.schema';
import { GroupService } from '../group.service';

const mockGroup = {
  name: 'xyz',
  description: 'xyz',
  created_by: 'jd123',
  members: ['jd123'],
};
describe('GroupService', () => {
  let groupService: GroupService;
  let groupModel: Model<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getModelToken('Group', 'osUsersDB'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockGroup),
            constructor: jest.fn().mockResolvedValue(mockGroup),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
    groupModel = module.get<Model<Group>>(getModelToken('Group', 'osUsersDB'));
  });

  it('should be defined', () => {
    expect(groupService).toBeDefined();
  });
});
