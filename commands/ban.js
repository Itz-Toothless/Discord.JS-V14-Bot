const chalk = require('chalk');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server')
        .addSubcommand(subcommand => subcommand.setName('user').setDescription('Ban a Member of this Server')
            .addUserOption(option =>
                option.setName('user').setDescription('The Member to ban').setRequired(true))
            .addStringOption(option =>
                option.setName('reason').setDescription('The reason for the Ban').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('id').setDescription('Ban a specified User ID from this Server')
            .addStringOption(option =>
                option.setName('id').setDescription('The ID to Ban').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('The Reason to Ban the User').setRequired(true))
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(client, interaction) {
        try {
            if (interaction.options.getSubcommand() === "id") {
                const user = interaction.options.getString('id');
                const reason = interaction.options.getString('reason');
                let fetchedUser = await client.users.fetch(user);
                if (!fetchedUser) {
                    return await interaction.reply({ content: 'Unable to find the user! Check your input and try again!', ephemeral: true });
                }
                const bannedUsers = await interaction.guild.bans.fetch();
                if (bannedUsers.has(fetchedUser.id)) {
                    let notBanned = new EmbedBuilder()
                        .setColor(0xff2200)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Ban not executed')
                        .setDescription(`${fetchedUser.tag} is already banned!`)
                        .setTimestamp()
                    await interaction.reply({ embeds: [notBanned], ephemeral: true })
                }
                await interaction.guild.members.ban(fetchedUser.id, { reason: reason });
                let banEmbed = new EmbedBuilder()
                    .setColor(0x7289DA)
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setTitle('Ban')
                    .setDescription('**Someone has been banned! Here are some details:**')
                    .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                    .addFields({ name: 'User:', value: `${fetchedUser.tag}`, inline: true },
                        { name: 'Executed by:', value: `${interaction.user.tag}`, inline: true },
                        { name: 'Reason:', value: `${reason}`, inline: true })
                    .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                    .setTimestamp();
                return await interaction.reply({ embeds: [banEmbed] });
            } else if (interaction.options.getSubcommand() === "user") {
                const user = interaction.options.getMember("user");
                const reason = interaction.options.getString('reason') || 'No reason provided';
                if (!user) {
                    await interaction.reply({ content: 'You must provide an existent user to ban!', ephemeral: true });
                    return;
                }

                if (interaction.member.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
                    await interaction.reply({ content: "You can't ban someone who has a higher role than you!", ephemeral: true })
                    return
                }

                if (!user.bannable) {
                    await interaction.reply({ content: "I cannot ban `" + user.tag + "` because my Permissions are insufficient!", ephemeral: true })
                    return
                }
                const bannedUsers = await interaction.guild.bans.fetch();
                if (bannedUsers.has(user.id)) {
                    let notBanned = new EmbedBuilder()
                        .setColor(0xff2200)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Ban not executed')
                        .setDescription(`${user.user.tag} is already banned!`)
                        .setTimestamp()
                    await interaction.reply({ embeds: [notBanned] })
                }
                await interaction.guild.members.ban(user, { days: 7, reason: reason });
                let banEmbed = new EmbedBuilder()
                    .setColor(0x7289DA)
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setTitle('Ban')
                    .setDescription('**Someone has been banned! Here are some details:**')
                    .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                    .addFields({ name: 'User:', value: `${user.user.tag}`, inline: true },
                        { name: 'Executed by:', value: `${interaction.user.tag}`, inline: true },
                        { name: 'Reason:', value: `${reason}`, inline: true })
                    .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                    .setTimestamp();
                return await interaction.reply({ embeds: [banEmbed] });
            }
        } catch (err) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            console.log(err);
        }
    }
};
