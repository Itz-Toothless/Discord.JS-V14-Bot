const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeouts a user from the server")
    .addUserOption(option =>
      option.setName("user").setDescription("The user to timeout").setRequired(true))
    .addStringOption(option =>
      option.setName('time').setDescription('The time for the timeout').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('The reason for the timeout (optional)').setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.ModerateMembers),
  async execute(client, interaction) {
    try {
      const time = interaction.options.getString('time');
      if (!time.includes('s', 'm', 'h', 'd', 'w', 'seconds', 'minutes', 'hours', 'days', 'weeks')) {
        return await interaction.reply({ content: "You may only use a Time containing:\nSeconds: **`'s', 'seconds'`**\nMinutes: **`'m', ',minute'`**\n Hours: **`'h', 'hours'`**\nDays: **`'d', 'days'`**\nWeeks: **`'w', 'weeks'`**", ephemeral: true })
      }
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const user = interaction.options.getMember("user");
      let fetched = await interaction.guild.members.fetch(client.user.id);
      let milliSeconds1 = ms(time);
      let milliSeconds2 = prettyMilliseconds(ms(time), { verbose: true });
      if (!user) {
        await interaction.reply({ content: 'You must provide an existent user to timeout!', ephemeral: true });
        return;
      }
      if (interaction.member.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
        await interaction.reply({ content: "I cannot timeout `" + user.user.tag + "` because they have the same or a higher role as you!", ephemeral: true })
        return
      }
      if (fetched.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
        await interaction.reply({ content: "I cannot timeout `" + user.user.tag + "` because they have the same role or a higher role as me!", ephemeral: true })
        return
      }

      if (user.permissions.has("Administrator")) {
        await interaction.reply({ content: "I cannot timeout `" + user.user.tag + "` because they have Administrator permissions!", ephemeral: true })
        return
      }
      if (milliSeconds1 > 28 * 24 * 60 * 60 * 1000) {
        await interaction.reply({ content: "The time cannot be over 28 days due to Discord's Limitations!", ephemeral: true })
        return
      }
      await user.timeout(milliSeconds1, { reason: reason });
      let timeoutEmbed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
        .setTitle('Timeout')
        .setDescription('**Someone has been timed out! Here are some details:**')
        .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
        .addFields({ name: 'User:', value: `${user.user.tag}`, inline: true },
          { name: 'Time:', value: `${milliSeconds2}`, inline: true },
          { name: 'Reason:', value: `${reason}`, inline: true })
        .setTimestamp()
        .setFooter({ text: 'Made with ❤️ by Itz_Toothless#8135', iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` });
      await interaction.reply({ embeds: [timeoutEmbed], ephemeral: true });
    } catch (err) {
      console.log(err);
      return await interaction.reply({ content: 'An error has occured!', ephemeral: true });
    }
  }
};
