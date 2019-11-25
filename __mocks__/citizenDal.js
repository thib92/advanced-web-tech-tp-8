const citizenDal = jest.genMockFromModule('../citizenDal');

const mockDal = {
  createCitizen: jest.fn(),
  findJack: jest.fn(),
  deleteAllCitizens: jest.fn(),
}

citizenDal.getCitizenDal = () => mockDal;

module.exports = citizenDal;
