const Discord = require('discord.js');
const config = require('../config.json');
const errors = require('../util/errors.js');

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('BAN_MEMBERS'))
    return errors.noPermissions(message, 'BAN_MEMBERS');

  let user = message.guild.member(message.mentions.members.first());
  if (!user) return errors.invalidUser(message);

  let reason = args.slice(1).join(' ');
  if (!reason) return errors.invalidReason(message);

  if (user.hasPermission('MANAGE_MESSAGES'))
    return errors.cannotPunish(message);

  let createdAtRaw = message.createdAt.toDateString();
  let createdAt = createdAtRaw.split(' ');

  let embed = new Discord.RichEmbed()
    .setTitle('User has been banned')
    .setColor(config.red)
    .addField('Banned User', `${user}`, true)
    .addField('Banned By', `${message.author}`, true)
    .addField('Banned in Channel', message.channel)
    .addField(
      'Time',
      `${createdAt[0]} ${createdAt[2]} ${createdAt[1]} ${createdAt[3]}`,
      true
    )
    .addField('Reason', reason);

  let auditlogchannel = message.guild.channels.find('name', 'audit-log');
  if (!auditlogchannel) return errors.noLogChannel(message);

  auditlogchannel.send(embed).catch(err => console.log(err));
  message
    .member(user)
    .ban(reason)
    .catch(err => console.log(err));

  console.log(
    `[${message.guild}] ${message.author.username} has banned ${user.user.username} from ${message.guild} for ${reason}.`
  );
  return;
};

module.exports.help = {
  name: 'ban',
  description: 'This will permanently ban a user from the guild.',
  usage: 'ban [@user] [reason]'
};
