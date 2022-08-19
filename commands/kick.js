const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server")
        .addUserOption(option =>
            option.setName("user").setDescription("The user to kick").setRequired(true))
        .addStringOption(option =>
            option.setName('reason').setDescription('The reason for the kick').setRequired(false))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(client, interaction) {
        try {
            const user = interaction.options.getMember("user");
            const highestRole = user.roles.highest.id;
            const reason = interaction.options.getString('reason') || 'No reason provided';
            if (!user) {
                await interaction.reply({ content: 'You must provide an existent user to kick!', ephemeral: true });
                return;
            }

            if (interaction.member.roles.highest.comparePositionTo(highestRole) <= 0) {
                await interaction.reply({ content: "You can't kick someone who has a higher role than you!", ephemeral: true })
                return
            }

            if (!user.kickable) {
                await interaction.reply({ content: "I cannot kick `" + user.tag + "` because my Permissions are insufficient!", ephemeral: true })
                return
            }
            await interaction.guild.members.kick(user, { reason: reason });
            let kickEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Kick')
                .setDescription('**Someone has been kicked! Here are some details:**')
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                .addFields({ name: 'User:', value: user.tag, inline: true },
                    { name: 'Executed by:', value: interaction.user.tag, inline: true },
                    { name: 'Reason:', value: reason, inline: true })
                .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp();
            return await interaction.reply({ embeds: [kickEmbed] });
        } catch (err) {
            console.log(err)
        }
    }
};
