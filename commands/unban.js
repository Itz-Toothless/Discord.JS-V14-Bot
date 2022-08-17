const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a user from the server")
        .addStringOption(option => option.setName('id').setDescription('The User ID').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason (optional)').setRequired(false))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.BanMembers),
    async execute(client, interaction) {
        try {
            let user = interaction.options.getString('id')
            let reason = interaction.options.getString('reason') || "No reason provided!"
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return await interaction.reply({ content: "I do not have the `BAN_MEMBERS` Permission to unban a User!", ephemeral: true })
            }
            if (!user) {
                return await interaction.reply({ content: "Please provide a User ID to unban", ephemeral: true })
            }
            let fetched = await client.users.fetch(user)
            if (!fetched) {
                return await interaction.reply({ content: "User not found", ephemeral: true })
            }
            // check if the user is actually banned on this server
            const bannedUsers = await interaction.guild.bans.fetch();
            if (!bannedUsers.has(fetched.id)) {
                let notBanned = new EmbedBuilder()
                    .setColor(0xff2200)
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setTitle('Unban not executed')
                    .setDescription(`${fetched.tag} is not banned!`)
                    .setTimestamp()
                await interaction.reply({ embeds: [notBanned] })
            }
            await interaction.guild.members.unban(fetched.id, reason);
            let unbanEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Unban')
                .setDescription('**Someone has been unbanned! Here are some details**')
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                .addFields({
                    name: 'User:',
                    value: fetched.tag,
                    inline: true
                },
                {
                    name: 'Executed by:',
                    value: interaction.user.tag,
                    inline: true
                },
                {
                    name: 'Reason:',
                    value: reason,
                    inline: true
                })
                .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp();
            return await interaction.reply({ embeds: [unbanEmbed] });
        } catch (err) {
            console.log(err)
        }
    }
};
