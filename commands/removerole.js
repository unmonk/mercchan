const Discord = require('discord.js');
const config = require('../config.json');
const errors = require('../util/errors.js');

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('MANAGE_ROLES')) return errors.noPermissions(message, 'MANAGE_ROLES');

  let user = message.guild.member(message.mentions.members.first());
  if (!user) return errors.invalidUser(message);

  let role = args.slice(1).join(" ");
  if (!role) return message.reply('Please specify a role.');
  let guildRole = message.guild.roles.find('name', role);
  if (!role) return message.reply('Couldn\'t find that role.');

  if (!user.roles.has(guildRole.id)) return message.reply('That role does not exist!');
  await (user.removeRole(guildRole.id));

  let embed = new Discord.RichEmbed()
  .setTitle('User has been removed from a role.')
  .setColor(config.yellow)
  .addField('Removed User', `${user}`, true)
  .addField('Removed By', `${message.author}`, true)
  .addField('Removed Role', `${role}`, true);

  let auditlogchannel = message.guild.channels.find('name', 'audit-log');
  if (!auditlogchannel) return errors.noLogChannel(message);

  auditlogchannel.send(embed);
  console.log(`[${message.guild}] ${message.author.username} has removed the role ${guildRole.name} from ${user.user.username}.`);
  return
};

module.exports.help = {
  name: 'removerole',
  description: 'This will remove a role from the mentioned user.',
  usage: 'removerole [@user] [role]'
}
