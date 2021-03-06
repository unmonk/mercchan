const config = require('../config.json');

module.exports = client => {
  let pluralnonpluralservers = client.guilds.size > 1 ? 'Servers' : 'Server';
  let pluralnonpluralusers = client.users.size > 1 ? 'Users' : 'User';

  console.log(
    `${client.user.username} is online and is operating on ${client.guilds.size} ${pluralnonpluralservers} for ${client.users.size} ${pluralnonpluralusers}.`
  );

  try {
    function setActivity() {
      const Gameinfo = [
        `Use ${config.prefix}help for help`,
        `Using ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          0
        )}MBs of RAM`,
        `Not Escaping Tarkov`,
        `Nuking Ghandi`,
        `What is love, baby dont hurt me`
      ];
      let info = Gameinfo[Math.floor(Math.random() * Gameinfo.length)];

      client.user.setActivity(Gameinfo);
      console.log(`[Console] Activity set to (${info})`);
    }

    setInterval(setActivity, 1200000);
  } catch (error) {
    console.log(error);
  }
};
