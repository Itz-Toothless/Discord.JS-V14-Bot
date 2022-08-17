const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban-id')
        .setDescription('Ban a User based on their ID')
        .setDMPermission(false)
        .addStringOption(option => option.setName('id').setDescription('The User ID').setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription('Reason (optional)').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(client, interaction) {
        try {
            let user = interaction.options.getString('id')
            let reason = interaction.options.getString('reason') || "No reason provided!"
            if (!user) {
                return await interaction.reply({ content: "Please provide a User ID to ban", ephemeral: true })
            }
            let fetched = await client.users.fetch(user)
            if (!fetched) {
                return await interaction.reply({ content: "User not found", ephemeral: true })
            }
            await interaction.guild.members.ban(fetched.id, { days: 7, reason: reason });
            let banEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Ban')
                .setDescription('**Someone has been banned! Here are some details**')
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
            return await interaction.reply({ embeds: [banEmbed] });
        } catch (err) {
            await interaction.reply({ content: "Something went wrong", ephemeral: true })
            console.log(err);
        }
    }
};
