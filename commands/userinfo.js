const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Replies with User stats")
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("user").setDescription("The User to get stats for").setRequired(true)),
    async execute(client, interaction) {
        try {
            let user = interaction.options.getUser("user") || interaction.member;
            let userEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('User Stats')
                .setDescription('**Here are some stats about the User**')
                .setThumbnail(`${user.displayAvatarURL({ dynamic: true }) ? user.displayAvatarURL({ dynamic: true }) : interaction.member.displayAvatarURL({ dynamic: true })}`)
                .addFields({
                    name: 'User Name',
                    value: user.tag,
                    inline: true
                },
                {
                    name: 'User ID',
                    value: user.id,
                    inline: true
                }, 
                {
                    name: 'User Created At',
                    value: `**<t:${Math.round(parseInt(user.createdTimestamp) / 1000)}:F>**`,
                    inline: true
                })
                .setTimestamp()
                .setFooter({ text: 'Made with ❤️ by Itz_Toothless#8135', iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return await interaction.reply({ embeds: [userEmbed] });
        } catch (err) {
            console.log(err)
        }
    }
};
