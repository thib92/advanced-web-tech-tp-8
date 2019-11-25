import request from "supertest";
import app from "../app";

jest.mock("../citizenDal");

import { getCitizenDal } from "../citizenDal";

describe("GET /getJack", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a citizen who is not a victim", async () => {
    const citizenDal = getCitizenDal();

    await request(app)
        .get('/getJack')
        .expect(200);

    expect(citizenDal.findJack).toHaveBeenCalledTimes(1);
    expect(citizenDal.findJack).toHaveBeenCalledWith();
  });
});
