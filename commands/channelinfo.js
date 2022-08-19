const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channelinfo")
        .setDescription("Gets info about a channel")
        .addChannelOption(option => option.setName('channel').setDescription('The Channel').setRequired(true))
        .setDMPermission(false),
    async execute(client, interaction) {
        try {
            let channel = interaction.options.getChannel('channel')
            if (!channel) {
                return await interaction.reply({ content: "Please provide a Channel", ephemeral: true })
            }
            function channelType(channel) {
                switch (channel.type) {
                    case 0:
                        return "Text Channel";
                    case 2:
                        return "Voice Channel";
                    case 4:
                        return "Category Channel";
                    case 5:
                        return "News Channel";
                    case 15:
                        return "Thread Channel";
                    case 1:
                        return "DM Channel";
                    case 3:
                        return "Group DM Channel";
                    case 14:
                        return "Directory";
                    case 10:
                        return "News Thread";
                    case 11:
                        return "Public Thread";
                    case 12:
                        return "Private Thread";
                    case 13:
                        return "Stage Voice Channel";
                }
            }
            let channelEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Channel Info')
                .setDescription('**Here are some details about the channel**')
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                .addFields({ name: 'Name:', value: `${channel.name}`, inline: true },
                    { name: 'ID:', value: `${channel.id}`, inline: true },
                    { name: 'Type:', value: `${channelType(channel)}`, inline: true },
                    { name: 'Position:', value: `${channel.position || "0"}`, inline: true },
                    { name: 'NSFW:', value: `${channel.nsfw ? "✅" : "❌"}`, inline: true },
                    { name: 'Created at:', value: `**<t:${Math.round(parseInt(channel.createdTimestamp) / 1000)}:F>**`, inline: true })
                .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp();
            return await interaction.reply({ embeds: [channelEmbed] });
        }
        catch (err) {
            console.log(err)
        }
    }
};
