const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Gets Info about a specified type")
        .addSubcommand(subcommand => subcommand.setName("channel").setDescription("Shows Info about a specified Channel")
            .addChannelOption(option =>
                option.setName("channel").setDescription("The Channel you want Info from").setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('role').setDescription('Shows Info about a specified Role')
            .addRoleOption(option =>
                option.setName('role').setDescription('The Role you want Info from').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('server').setDescription('Shows Info about the current Guild'))

        .addSubcommand(subcommand => subcommand.setName('user').setDescription('Shows Info about a specified User')
            .addUserOption(option => option.setName('target').setDescription('The Member you want Info from')),
        )
        .setDMPermission(false),
    async execute(client, interaction) {
        try {
            switch (interaction.options.getSubcommand()) {
                case 'channel':
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
                        .setColor(0x7289DA)
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

                case 'role':
                    let role = interaction.options.getRole('role')
                    if (!role) {
                        return await interaction.reply({ content: "Please provide a Role", ephemeral: true })
                    }
                    let roleEmbed = new EmbedBuilder()
                        .setColor(0x7289DA)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Role Info')
                        .setDescription('**Here are some details about the role**')
                        .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                        .addFields({ name: 'Name:', value: `${role.name}`, inline: true },
                            { name: 'ID:', value: `${role.id}`, inline: true },
                            { name: 'Color', value: `${role.hexColor}`, inline: true },
                            { name: 'Position:', value: `${role.position}`, inline: true },
                            { name: 'Mentionable:', value: `${role.mentionable ? "✅" : "❌"}`, inline: true },
                            { name: 'Hoist:', value: `${role.hoist ? "✅" : "❌"}`, inline: true },
                            { name: 'Created at:', value: `<t:${Math.round(parseInt(role.createdTimestamp) / 1000)}:F>`, inline: true })
                        .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                        .setTimestamp();
                    return await interaction.reply({ embeds: [roleEmbed] });

                case 'server':
                    let server = interaction.guild
                    let owner = server.ownerId
                    let theOwner = await interaction.guild.members.fetch(owner)
                    let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
                    let verif = verifLevels[server.verificationLevel]
                    let serverEmbed = new EmbedBuilder()
                        .setColor(0x7289DA)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.member.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Server Stats')
                        .setDescription('**Here are some stats about the Server**')
                        .setThumbnail(`${server.iconURL({ dynamic: true })}`)
                        .addFields({ name: 'Server Name', value: `${server.name}`, inline: true },
                            { name: 'Server ID', value: `${server.id}`, inline: true },
                            { name: 'Server Owner', value: `${theOwner.user.tag}\n${theOwner.id}`, inline: true },
                            { name: 'Server Created At', value: `**<t:${Math.round(parseInt(server.createdTimestamp) / 1000)}:F>**`, inline: true },
                            { name: 'Server Region', value: `${server.preferredLocale}`, inline: true },
                            { name: 'Server Verification Level', value: `${verif}`, inline: true })
                        .setTimestamp()
                        .setFooter({ text: 'Made with ❤️ by Itz_Toothless#8135', iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                    return await interaction.reply({ embeds: [serverEmbed] });
                case 'user':
                    const user = interaction.options.getMember('target') || interaction.member;
                    let userEmbed = new EmbedBuilder()
                        .setColor(0x7289DA)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('User Stats')
                        .setDescription('**Here are some stats about the User**')
                        .setThumbnail(`${user.displayAvatarURL({ dynamic: true }) ? user.displayAvatarURL({ dynamic: true }) : interaction.member.displayAvatarURL({ dynamic: true })}`)
                        .addFields({ name: 'User Name', value: `${user.user.tag}`, inline: true },
                            { name: 'User ID', value: `${user.id}`, inline: true },
                            { name: 'User Created at', value: `**<t:${Math.round(parseInt(user.user.createdTimestamp) / 1000)}:F>**`, inline: true },
                            { name: 'User Joined at:', value: `**<t:${Math.round(parseInt(user.joinedTimestamp) / 1000)}:F>**` },
                            { name: 'Roles', value: `${user.roles.cache.map(r => r.name).join('\n')}` },
                            { name: 'Admin', value: `${user.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR) ? "✅" : "❌"}`, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: 'Made with ❤️ by Itz_Toothless#8135', iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                    return await interaction.reply({ embeds: [userEmbed] });
            }
        }
        catch (err) {
            console.log(chalk.bgRedBright(err))
        }
    }
};
