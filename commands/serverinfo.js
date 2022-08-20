const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Replies with Server stats")
        .setDMPermission(false),
    async execute(client, interaction) {
        try {
            let server = interaction.guild
            let owner = server.ownerId
            let theOwner = await interaction.guild.members.fetch(owner)
            let serverEmbed = new EmbedBuilder()
                .setColor(0x7289DA)
                .setAuthor({ name: `${interaction.member.tag}`, iconURL: `${interaction.member.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Server Stats')
                .setDescription('**Here are some stats about the Server**')
                .setThumbnail(`${server.iconURL({ dynamic: true })}`)
                .addFields({ name: 'Server Name', value: `${server.name}`, inline: true },
                    { name: 'Server ID', value: `${server.id}`, inline: true },
                    { name: 'Server Owner', value: `${theOwner.user.tag}\n${theOwner.id}`, inline: true },
                    { name: 'Server Created At', value: `**<t:${Math.round(parseInt(server.createdTimestamp) / 1000)}:F>**`, inline: true },
                    { name: 'Server Region', value: `${server.preferredLocale}`, inline: true },
                    { name: 'Server Verification Level', value: `${server.verificationLevel}`, inline: true })
                .setTimestamp()
                .setFooter({ text: 'Made with ❤️ by Itz_Toothless#8135', iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return await interaction.reply({ embeds: [serverEmbed] });
        } catch (err) {
            console.log(err)
        }
    }
};
