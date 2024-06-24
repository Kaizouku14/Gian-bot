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


client.on('messageCreate', message => {
    if(message.author.bot) return;

    const author = message.author.username;
    const msg = message.content.split(/\W+/).filter(Boolean);
    const filteredMessage = msg.filter(message => message.match(/nigger|nigga/i))   

    if(filteredMessage.length > 0 ){ 
        const count = filteredMessage.length
        let userFound = false;
   
        userFound = validateUser(message.author.id, count)

        if (!userFound) {
            writeUserData(message.author.id, author, count)
        }

        const currentCount = retrieveCount(message.author.id)
        const embed = checkMilestones(author , currentCount);

        if (embed) {
            message.channel.send({ embeds: [embed] });
        }
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try{
        
        if(interaction.commandName === 'ping'){
            const username = interaction.user.username;
            const userEntry = await retrieveCount(interaction.user.id)
    
            if (userEntry) {``
                const embed = new EmbedBuilder()
                    .setTitle('🎉 Achievement 🎉')
                    .setColor('#0099ff')
                    .setDescription(`Hey ${username}, you've already mentioned **nigga/nigger**: \`${userEntry} times!\` Keep it up!`);
    
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply(` \`Hey\` ${interaction.user}, \`You do not have an achievement 😔.\` `);
            }
        }  
     
        if(interaction.commandName === 'leaderboard'){
            let leaderBoard = await retrieveAll();
    
            if(leaderBoard.length > 0){
    
                let description = '```\nNo.   User              No. of N-words said\n';
                    leaderBoard.forEach((value, index) => {
                        const position = String(index + 1).padEnd(4, ' ');
                        let name = value.username.slice(0, 15).padEnd(15, ' '); // Limit username length to 15 characters
                        if (index === 0) name = '🥇 ' + name;
                        if (index === 1) name = '🥈 ' + name;
                        if (index === 2) name = '🥉 ' + name;
                        const count = String(value.count).padStart(9, ' ');
                        description += `${position} ${name} ${count}\n`;
                    });
                    description += '```';
    
                const embed = new EmbedBuilder()
                    .setTitle('Leader Board')
                    .setColor('#0099ff')
                    .setDescription(description);
        
                await interaction.reply({ embeds: [embed] });
           }else{
               await interaction.reply('\`No record yet.\`')
           }      
        }

    }catch(error){
        await interaction.reply('There was an unexpected error. Please try again later.');
    }

})

function checkMilestones(username, count) {
    if (count === 0) return -1;

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



