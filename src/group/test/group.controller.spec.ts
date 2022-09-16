import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from '../group.controller';
import { GroupService } from '../group.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('../group.service');

describe('GroupController', () => {
  let groupController: GroupController;
  let groupService: GroupService;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [GroupService, JwtService],
    }).compile();

    groupController = module.get<GroupController>(GroupController);
    groupService = module.get<GroupService>(GroupService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(groupController).toBeDefined();
  });
});
