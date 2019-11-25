import request from "supertest";
import app from "../app";

jest.mock("../citizenDal");

import { getCitizenDal } from "../citizenDal";

describe("DELETE /evidences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a citizen who is not a victim", async () => {
    const citizenDal = getCitizenDal();

    await request(app)
        .delete('/evidences')
        .expect(204);

    expect(citizenDal.deleteAllCitizens).toHaveBeenCalledTimes(1);
    expect(citizenDal.deleteAllCitizens).toHaveBeenCalledWith();
  });
});
