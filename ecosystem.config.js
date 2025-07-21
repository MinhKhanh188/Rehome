// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'rehome-backend',
      script: './src/server.js',
      cwd: './back-end',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    }
  ]
};

