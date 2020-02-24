const Discord = require('discord.js');
const config = require('./config.json');
const token = require('./token.json');
const client = new Discord.Client({disableEveryone: true});
const fs = require('fs');
client.commands = new Discord.Collection();
require('./util/eventLoader.js')(client);

// Reads all commands and boots them in
fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === 'js')
  if (jsfile.length <= 0) {
    console.log('Couldn\'t find commands.');
    return
  }

jsfile.forEach((files, i) => {
    let props = require(`./commands/${files}`);
    console.log(`${files} has been loaded.`);
    client.commands.set(props.help.name, props);
  })
});

// Voice Channel assign Role
client.on('voiceStateUpdate', (oldMember, newMember) => {
  let oldUserChannel = oldMember.voiceChannel;
  let newUserChannel = newMember.voiceChannel;

  if (oldUserChannel === undefined && newUserChannel !== undefined) {
    console.log('User Joins a voice channel');

  } else if (newUserChannel === undefined){
    console.log('User leaves a voice channel');
  }
});

// Message Guild Event
client.on('message', (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (!cmd.startsWith(prefix)) return;
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(client,message,args);

});

client.login(token.token);