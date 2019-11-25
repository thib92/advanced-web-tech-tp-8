import { Citizen } from './citizen';
import { createConnection, Connection } from 'typeorm';
import { citizenSchema } from './citizen.schema';
import { distanceToVictim } from './helpers';
import { NotFoundError, ConflictError } from './errors';

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
        type: 'mysql',
        host: '0.0.0.0',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'Db_London1888',
        entities: [citizenSchema],
      });
    } catch (err) {
      console.error('Unable to connect');
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
          isVictim: true,
        },
      });
      if (victim) {
        throw new ConflictError('There is already a victim in the database.');
      }
    }

    return repository.save(citizen);
  }

  async findJack() {
    const connection = await this.getConnection();
    const repository = connection.getRepository(Citizen);

    const victim = await repository.findOne({
      where: {
        isVictim: true,
      },
    });

    if (!victim) {
      throw new NotFoundError('There is no victim in the database.');
    }

    // The distance calculation is done on the MySQL side for performance reasons:
    // If there are a lot of citizens, transmitting the data from MySQL to the Node server can be very long and memory-inefficient
    // Moreover, the math calculation will be much faster on the MySQL side since MySQL will probably parallelize the work
    // Another option would be to fetch all non-victim citizens and filter the array on the JS side
    // The only caveat with our implementation is that we still need to implement the distance function on the JS side
    // to handle the case where there are two citizens at equal distance to the victim.
    const closestCitizens = await repository.createQueryBuilder('c')
      .addSelect('SQRT(POW(c.posX - :vx, 2) + POW(c.posY - :vy, 2))', 'distance')
      .where('isVictim = false')
      .orderBy('distance', 'ASC')
      .setParameters({
        'vx': victim.posX,
        'vy': victim.posY,
      })
      .limit(2)
      .getMany();


    switch (closestCitizens.length) {
      case 0:
        throw new NotFoundError('There is no citizen in the database.');
      case 1:
        return closestCitizens[0];
      default:
        if (distanceToVictim(victim, closestCitizens[0]) === distanceToVictim(victim, closestCitizens[1])) {
          throw new ConflictError('There are at least two citizens with the closest distance to the victime.');
        }
        return closestCitizens[0];
    }
  }

  async deleteAllCitizens() {
    const connection = await this.getConnection();
    const repository = connection.getRepository(Citizen);

    await repository.clear();
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
