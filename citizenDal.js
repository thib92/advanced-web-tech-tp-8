import { Citizen } from "./citizen";
import { createConnection, Connection } from "typeorm";

export class CitizenDal {
  /**
   * Returns the connetion to the DB
   * @returns {Promise<Connection>}
   */
  async getConnection() {
    if (this.connection) {
      return this.connection;
    }
    await this.connect();
    return this.connection;
  }

  async connect() {
    try {
      this.connection = await createConnection({
        type: "mysql",
        host: "0.0.0.0",
        port: 3306,
        username: "root",
        password: "root",
        database: "Db_London1888",
        entities: []
      });
    } catch (err) {
      console.error("Unable to connect");
      console.error(err);
    }
  }

  /**
   * Create a citizen and persist it in the database
   * @param {Citizen} citizen The citizen to create
   * @returns {Promise<Citizen>} The citizen created
   */
  async createCitizen(citizen) {
    const connection = await this.getConnection();

    const repository = connection.getRepository(Citizen);

    // Throw an error if the citizen to create is a victim,
    // and there is already a victim in the database
    if (citizen.isVictim) {
      const victim = await repository.findOne({
        where: {
          isVictim: true
        }
      });
      if (victim) {
        throw new Error("There is already a victim in the database.");
      }
    }

    return repository.save(citizen);
  }
}

let citizenDal;

/**
 * Get the Citizen DAL
 * @returns {CitizenDal}
 */
export const getCitizenDal = () => {
  if (!citizenDal) {
    citizenDal = new CitizenDal();
  }
  return citizenDal;
};
