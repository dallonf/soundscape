const npsUtils = require('nps-utils');

module.exports = {
  scripts: {
    default: npsUtils.concurrent({
      cra: `${npsUtils.crossEnv('BROWSER=none react-scripts start')}`,
      electron: `wait-on http://localhost:3000 && ${npsUtils.crossEnv(
        'ELECTRON_START_URL=http://localhost:3000 electron .'
      )}`,
    }),
    build: 'react-scripts build',
    test: 'react-scripts test --env=jsdom',
    eject: 'react-scripts eject',
  },
};
