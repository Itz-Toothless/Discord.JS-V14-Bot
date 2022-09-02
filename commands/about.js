const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const process = require("process");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Replies with Bot stats")
        .setDMPermission(false),
    async execute(client, interaction) {
        try {
            let uptime = Math.round(parseInt(client.readyTimestamp) / 1000)
            let created = Math.round(parseInt(client.user.createdTimestamp) / 1000);
            let up = `${process.platform.charAt(0).toUpperCase() + process.platform.slice(1)}`
            const statsEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Bot Stats')
                .setDescription('**Here are some stats about the Bot**')
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                .setDescription(`
			> **Guilds: \`${client.guilds.cache.size}\`**
            > **Users: \`${Math.ceil(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString("tr-TR"))}\`**
            > **Channels: \`${client.channels.cache.size}\`**
            > **Commands: \`${client.commands.size}\`**
            > **Uptime: <t:${uptime}:R>**
            > **Created: <t:${created}:R> - <t:${created}:F>**
            > **Node: \`${process.version}\`**
            > **Discord.js: \`${require('discord.js').version}\`**
            > **OS: \`${up}\`**
            > **CPU: \`${process.arch}\`**
            > **RAM: \`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB\`**
			`)
            .addFields({ name: "Invite Bot", value: `**[Add Me](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=1084516334400)**`, inline: true })
                .setTimestamp()
                .setFooter({ text: 'Made with ❤️ by Itz_Toothless#8135', iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return await interaction.reply({ embeds: [statsEmbed] });
        } catch (err) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            console.error(err);
        }
    }
};
