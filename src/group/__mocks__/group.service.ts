const mockGroup = {
  name: 'Group 1',
  description: 'Wonderful group',
  members: ['user_xyz'],
  createdBy: 'user_xyz',
};
export const GroupService = jest.fn().mockReturnValue({
  create: jest.fn().mockImplementation(() => {
    return mockGroup;
  }),

  findAll: jest.fn().mockImplementation(() => {
    return [mockGroup];
  }),

  findOne: jest.fn().mockImplementation(() => {
    return mockGroup;
  }),

  update: jest.fn().mockImplementation(() => {
    return mockGroup;
  }),
  addMemberToGroup: jest.fn().mockImplementation(() => {
    return mockGroup;
  }),

  remove: jest.fn().mockReturnValue(null),
});
