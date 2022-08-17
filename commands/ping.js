const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .setDMPermission(false),
    async execute(client, interaction) {
        try {
            await interaction.reply('Fetching Ping...');
            await wait(3000);
            await interaction.editReply({ content: `Pong: ${client.ws.ping} ms` });
        } catch (err) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            console.log(err);
        }
    },
};
