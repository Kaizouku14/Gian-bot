const { Client, 
    GatewayIntentBits ,
    EmbedBuilder
} = require('discord.js');
require('dotenv').config();

const client = new Client ({
  intents : [ GatewayIntentBits.Guilds,
              GatewayIntentBits.GuildMessages,
              GatewayIntentBits.MessageContent ]
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const leaderBoard = []

client.on('messageCreate', message => {
    if(message.author.bot) return;

    const author = message.author.username;
    const msg = message.content.split(/\W+/).filter(Boolean);
    const filteredMessage = msg.filter(message => message.match(/nigger|nigga/i))   

    if(filteredMessage.length > 0 ){ 
        let userFound = false;

        leaderBoard.forEach(value => { //register user
            if(value.name === author){
               value.count += filteredMessage.length
               userFound = true;
            }
        })

        if (!userFound) {
            leaderBoard.push({ name: author, count: filteredMessage.length }); 
        }
    }

    const count = leaderBoard.find(value => value.name === author)?.count || null;
    const embed = checkMilestones(author , count);
    if (embed) {
        message.channel.send({ embeds: [embed] });
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'ping'){
        const username = interaction.user.username;
        const userEntry = leaderBoard.find(entry => entry.name === username);

        if (userEntry) {
            const embed = new EmbedBuilder()
                .setTitle('🎉 Achievement 🎉')
                .setColor('#0099ff')
                .setDescription(`Hey ${username}, you've already mentioned **nigga/nigger**: \`${userEntry.count} times!\` Keep it up!`);

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply(` \`Hey\` ${interaction.user}, \`You do not have an achievement 😔.\` `);
        }
    }  
``
    if(interaction.commandName === 'leaderboard'){
       if(leaderBoard.length > 0){
            leaderBoard.sort((a, b) => b.count - a.count) // sort in descending order

            let description = '```\nNo.   User              No. of N-words said\n';
            leaderBoard.forEach((value, index) => {
                const position = String(index + 1).padEnd(4, ' '); 
                let name = value.name.padEnd(15, ' '); 
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
           await interaction.reply(` \`No record yet.\` `)
       }      
    }
})

function checkMilestones(username, count) {
    if (count === null) return null;

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



