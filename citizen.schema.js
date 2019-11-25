import { EntitySchema } from 'typeorm';
import { Citizen } from './citizen';

export const citizenSchema = new EntitySchema({
  tableName: 'LondonCitizen',
  name: 'LondonCitizen',
  target: Citizen,
  columns: {
    id: {
      primary: true,
      generated: true,
      type: 'int',
    },
    name: {
      type: 'varchar',
      nullable: false,
    },
    posX: {
      type: 'int',
      nullable: false,
    },
    posY: {
      type: 'int',
      nullable: false,
    },
    isVictim: {
      type: 'bool',
      nullable: false,
    },
  },
});
