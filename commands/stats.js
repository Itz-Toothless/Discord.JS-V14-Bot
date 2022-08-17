const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Replies with Bot stats")
        .setDMPermission(false),
    async execute(client, interaction) {
        try {
            const statsEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Bot Stats')
                .setDescription('**Here are some stats about the Bot**')
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                .addFields({
                    name: 'Bot Name',
                    value: client.user.tag,
                    inline: true
                },
                    {
                        name: 'Bot ID',
                        value: client.user.id,
                        inline: true
                    },
                    {
                        name: 'Bot Version',
                        value: '1.0.0',
                        inline: true
                    },
                    {
                        name: 'Bot Prefix',
                        value: '/',
                        inline: true
                    },
                    {
                        name: 'Bot Creator',
                        value: 'Itz_Toothless#8135',
                        inline: true
                    },
                    {
                        name: 'Bot Created At',
                        value: `**<t:${Math.round(parseInt(client.user.createdTimestamp) / 1000)}:F>**`,
                        inline: true
                    },
                    {
                        name: 'Bot Uptime',
                        value: `**<t:${Math.round(parseInt(client.readyTimestamp) / 1000)}:R>**`,
                        inline: true
                    })
                .setTimestamp()
                .setFooter({ text: 'Made with ❤️ by Itz_Toothless#8135', iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return await interaction.reply({ embeds: [statsEmbed] });
        } catch (err) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            console.error(err);
        }
    }
};
