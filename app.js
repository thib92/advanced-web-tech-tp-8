import express from 'express';
import bodyParser from 'body-parser';
import { Citizen } from './citizen';
import { getCitizenDal } from './citizenDal';

const app = express();

app.use(bodyParser.json());
app.use(function(_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.post('/citizen/:name/:posX/:posY', async (req, res) => {
  const { name, posX: posXString, posY: posYString } = req.params;

  const posX = Number(posXString);
  const posY = Number(posYString);

  if (isNaN(posX) || isNaN(posY)) {
    throw new BadRequestError('posX and posY must be numbers.');
  }

  const citizenDal = getCitizenDal();
  const citizen = new Citizen(undefined, name, posX, posY, false);
  const citizenCreated = await citizenDal.createCitizen(citizen);
  return res.json(citizenCreated);
});

app.post('/victim/:name/:posX/:posY', async (req, res) => {
  const { name, posX: posXString, posY: posYString } = req.params;

  const posX = Number(posXString);
  const posY = Number(posYString);

  if (isNaN(posX) || isNaN(posY)) {
    throw new BadRequestError('posX and posY must be numbers.');
  }

  const citizenDal = getCitizenDal();
  const citizen = new Citizen(undefined, name, posX, posY, true);

  try {
    const citizenCreated = await citizenDal.createCitizen(citizen);
    res.json(citizenCreated);
  } catch (e) {
    throw new ConflictError('There is already a victim.');
  }
});

app.delete('/evidences', async (_, res) => {
  const citizenDal = getCitizenDal();
  await citizenDal.deleteAllCitizens();
  return res.status(204).end();
});

export default app;
