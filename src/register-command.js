const { REST, Routes } =  require('discord.js');
require('dotenv').config();

const commands = [
    {
      name: 'ping',
      description: 'Reply with how many times you said the n-word.',
    },
    {
      name : 'leaderboard',
      description : 'Displays the current leaderboard showing top users based on their mentions of "nigga/nigger".'
    }
];
  
const registerSlashCommands = async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("Registering slash commands...");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands,});

    console.log("Successfully registered application (/) commands!");
  } catch (error) {
    console.error(error);
  }
};

registerSlashCommands();

