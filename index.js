import 'regenerator-runtime/runtime';

import app from './app';
import { getCitizenDal } from './citizenDal';

const port = 8081;

const server = app.listen(port, async () => {
  const port = server.address().port;
  console.log('Server listening on port ' + port + '...');
  await getCitizenDal().connect();
  console.log('Database connected...');
});
