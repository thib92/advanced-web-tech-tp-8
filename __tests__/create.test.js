import request from 'supertest';
import app from '../app';

jest.mock('../citizenDal');

import { getCitizenDal } from '../citizenDal';
import { Citizen } from '../citizen';

describe('Create a citizen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /citizen', () => {
    it('creates a citizen who is not a victim', async () => {
      const citizenDal = getCitizenDal();

      const name = 'citizen';
      const posX = 1;
      const posY = 1;

      await request(app)
        .post(`/citizen/${name}/${posX}/${posY}`)
        .expect(200);

      expect(citizenDal.createCitizen).toHaveBeenCalledTimes(1);
      expect(citizenDal.createCitizen).toHaveBeenCalledWith(
        new Citizen(undefined, name, posX, posY, false),
      );
    });
  });

  describe('POST /victim', () => {
    it('creates a citizen who is a victim', async () => {
      const citizenDal = getCitizenDal();

      const name = 'citizen';
      const posX = 1;
      const posY = 1;

      await request(app)
        .post(`/victim/${name}/${posX}/${posY}`)
        .expect(200);

      expect(citizenDal.createCitizen).toHaveBeenCalledTimes(1);
      expect(citizenDal.createCitizen).toHaveBeenCalledWith(
        new Citizen(undefined, name, posX, posY, true),
      );
    });
  });
});
