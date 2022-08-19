const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roleinfo")
        .setDescription("Gets info about a role")
        .addRoleOption(option => option.setName('role').setDescription('The Role').setRequired(true))
        .setDMPermission(false),
    async execute(client, interaction) {
        try {
            let role = interaction.options.getRole('role')
            if (!role) {
                return await interaction.reply({ content: "Please provide a Role", ephemeral: true })
            }
            let roleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Role Info')
                .setDescription('**Here are some details about the role**')
                .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                .addFields({ name: 'Name:', value: `${role.name}`, inline: true },
                    { name: 'ID:', value: `${role.id}`, inline: true },
                    { name: 'Color:', value: `${role.color}`, inline: true },
                    { name: 'Position:', value: `${role.position}`, inline: true },
                    { name: 'Mentionable:', value: `${role.mentionable ? "✅" : "❌"}`, inline: true },
                    { name: 'Hoist:', value: `${role.hoist ? "✅" : "❌"}`, inline: true },
                    { name: 'Created at:', value: `<t:${Math.round(parseInt(role.createdTimestamp) / 1000)}:F>`, inline: true })
                .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp();
            return await interaction.reply({ embeds: [roleEmbed] });
        }
        catch (err) {
            console.log(err)
        }
    }
};
