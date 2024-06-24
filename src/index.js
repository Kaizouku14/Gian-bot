const { 
Client, 
GatewayIntentBits ,
EmbedBuilder
} = require('discord.js');
const { keepAlive } = require('./utils/keepAlive');
const { writeUserData , validateUser, retrieveCount , retrieveAll } = require('./database/service');

require('dotenv').config();

const client = new Client ({
  intents : [ GatewayIntentBits.Guilds,
              GatewayIntentBits.GuildMessages,
              GatewayIntentBits.MessageContent ]
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    keepAlive({ port: 3000 });
});


client.on('messageCreate', async (message) => {
    if(message.author.bot) return;

    const author = message.author.username;
    const msg = message.content.split(/\W+/).filter(Boolean);
    const filteredMessage = msg.filter(message => message.match(/nigger|nigga/i))   

    if(filteredMessage.length > 0 ){ 
        const count = filteredMessage.length;

        const isValidUser = await validateUser(message.author.id, count);

        if (isValidUser) { 
            console.log("User count updated successfully");
        }else{
            writeUserData(message.author.id, author, count); 
        }

        const currentCount = await retrieveCount(message.author.id);
        if(currentCount > 0){
            const embed = checkMilestones(author , currentCount);

            if (embed) {
                message.channel.send({ embeds: [embed] });
            }
        }
    }
    
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === 'ping') {
            const username = interaction.user.username;
            const userEntry = await retrieveCount(interaction.user.id);

            if (userEntry) {
                const embed = new EmbedBuilder()
                    .setTitle('🎉 Achievement 🎉')
                    .setColor('#0099ff')
                    .setDescription(`Hey ${username}, you've already mentioned **nigga/nigger**: \`${userEntry} times!\` Keep it up!`);

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply(` \`Hey\` ${interaction.user}, \`You do not have an achievement 😔.\` `);
            }
        }

        if (interaction.commandName === 'leaderboard') {
            await interaction.deferReply(); 

            let leaderBoard = await retrieveAll();
            leaderBoard.sort((a, b) => b.count - a.count);

            if (leaderBoard.length > 0) {
                let description = '```\nTop Niggers           No. of N word said\n';
                    leaderBoard.forEach((value, index) => {
                        const position = `${index + 1}.`.padEnd(3, ' ');
                        let name = value.username.slice(0, 15).padEnd(15, ' ');
                        if (index === 0) name = `🥇 ${name}`;
                        if (index === 1) name = `🥈 ${name}`;
                        if (index === 2) name = `🥉 ${name}`;
                        const count = String(value.count).padStart(25 - name.length, ' ');
                        description += `${position}${name}${count}\n`;
                    });
                    description += '```';

                const embed = new EmbedBuilder()
                    .setTitle('Leader Board')
                    .setColor('#0099ff')
                    .setDescription(description);

                await interaction.editReply({ embeds: [embed] }); 
            } else {
                await interaction.editReply('`No record yet.`');
            }
        }
    } catch (error) {
        console.error('Error handling interaction:', error);

        if (!interaction.replied) {
            await interaction.reply('There was an unexpected error. Please try again later.');
        } else {
            await interaction.followUp('There was an unexpected error. Please try again later.');
        }
    }
});

function checkMilestones(username, count) {

    const milestones = {
        1: 'Newborn',
        50: 'Veteran',
        100: 'Legend',
        500: 'Master',
        1000: 'THE GOAT'
    };

    const milestone = milestones[count];
    if (milestone) {
        const description = `Hey ${username}, you've already mentioned **nigga/nigger**: \`${count}\` times! Keep it up!`;
        const embed = new EmbedBuilder()
            .setTitle('🎉 Achievement 🎉')
            .setColor('#0099ff')
            .setDescription(description)
            .addFields({ name: 'Milestone', value: milestone, inline: true });
        return embed;
    }

    return null;
}

client.login(process.env.TOKEN)



