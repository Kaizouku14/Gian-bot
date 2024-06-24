const { Client, 
GatewayIntentBits ,
EmbedBuilder
} = require('discord.js');
const { keepAlive } = require('./utils/keepAlive');
const { writeUserData , 
validateUser, 
retrieveCount , 
retrieveAll, 
updateRank } = require('./database/service');

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
            //print if successfull
            // console.log("User count updated successfully");
        }else{
            writeUserData(message.author.id, author, count); 
        }

        const result = await retrieveCount(message.author.id);

        if(result.count > 0){
            const embed = await checkMilestone(message.author.id, author, result.count);

            if (embed) {
               await message.channel.send({ embeds: [embed] })
            }
        }
    }
    
})


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === 'ping') {
            const username = interaction.user.username;
            const result = await retrieveCount(interaction.user.id);

            if (result) {
                const embed = new EmbedBuilder()
                    .setTitle('🎉 Achievement 🎉')
                    .setColor('#0099ff')
                    .setDescription(`Hey ${username}, you've already mentioned **nigga/nigger**: \`${result.count} times!\` Keep it up!\n
                        Milestone rank : \`${result.rank}\``);

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply(` \`Hey\` ${interaction.user}, \`You do not have an achievement 😔.\` `);
            }
        }

        if (interaction.commandName === 'leaderboard') {

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

                await interaction.reply({ embeds: [embed] }); 
            } else {
                await interaction.reply('`No record yet.`');
            }
        }
    } catch (error) {
        console.error('Error handling interaction:', error);

        // Check if interaction has already been replied to or deferred
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp('There was an unexpected error. Please try again later.');
        } else {
            await interaction.reply('There was an unexpected error. Please try again later.');
        }
    }
});


const checkMilestone = async (userId, username, count) => {
    if (count < 50) return null;

    const ranks = [
        { min: 50, max: 100, rank: 'Veteran' },
        { min: 101, max: 500, rank: 'Legend' },
        { min: 501, max: 1000, rank: 'Master' },
        { min: 1001, max: Infinity, rank: 'THE GOAT' }
    ];

    for (const { min, max, rank } of ranks) {
        if (count >= min && count <= max) {
            try {
                await updateRank(userId, rank);

                const description = `Hey ${username}, you've reached a count of \`${count}\`! Keep it up!`;

                const embed = new EmbedBuilder()
                    .setTitle('🎉 Achievement 🎉')
                    .setColor('#0099ff')
                    .setDescription(description)
                    .addFields({ name: 'Milestone', value: rank, inline: true });
                
                return embed;
            } catch (error) {
                console.error('Error updating rank:', error);
            }
        }
    }

    return null; 
};

client.login(process.env.TOKEN)



