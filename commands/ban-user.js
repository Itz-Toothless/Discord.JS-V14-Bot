const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban-user")
        .setDescription("Bans a user from the server")
        .addUserOption(option =>
            option.setName("user").setDescription("The user to ban").setRequired(true))
        .addStringOption(option =>
            option.setName('reason').setDescription('The reason for the ban').setRequired(false))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(client, interaction) {
        try {
            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString('reason') || 'No reason provided';
            if (!user) {
                await interaction.reply({ content: 'You must provide an existent user to ban!', ephemeral: true });
                return;
            }

            if (!user.bannable) {
                await interaction.reply({ content: "I am unable to ban this User!", ephemeral: true })
                return
            }
            await interaction.guild.members.ban(user, { days: 7, reason: reason });
            let banEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Ban')
                .setDescription('**Someone has been banned! Here are some details:**')
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                .addFields({ name: 'User:', value: user.tag, inline: true },
                    { name: 'Executed by:', value: interaction.user.tag, inline: true },
                    { name: 'Reason:', value: reason, inline: true })
                .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp();
            return await interaction.reply({ embeds: [banEmbed] });
        } catch (err) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            console.error(err);
        }
    }
};
