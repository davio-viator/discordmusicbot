const Discord = require('discord.js');  //old version
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

// const client = new Discord.Client(); old version

const {Client,Intents} = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = '!';

const fs = require('fs');
const play = require('./commands/p');
const { ifError } = require('assert');

client.commands = new Discord.Collection();

var servers = {};

var timeoutId;

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
  const command = require(`./commands/${file}`);

  client.commands.set(command.name,command);
}

const videoFinder = async (query) => {
  const videoResult = await ytSearch (query) ;
  
  return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
  
}


client.on('message',async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  //client.commands.get(command).execute(message,args,servers);
  //client.commands.get(command).execute(msg, args);

  switch (command){
    case 'play':

      function play(connection,message){
        var server = servers[message.guild.id];
        
        server.dispatcher = connection.play(ytdl(server.queue[0],{filter:'audioonly'}),{seek:0,volume:1});
        // var stream = ytdl(server.queue[0],{filter:'audioonly'});
        // server.dispacher = connection.play(stream,{seek:0,volume:1})

        server.queue.shift();
        
        server.dispatcher.on('finish',function(){
          if(server.queue[0]){
            play(connection,message)
          }else{
            //connection.disconnect();
            timeoutId = setTimeout(function(){
              message.channel.send('You don\'t need me anymore goodbye');
              message.member.voice.channel.leave();
              connection.disconnect();
            },300000)
          }
          /*
          function(){
          if(server.queue[0]){
            play(connection,message);
            clearTimeout(timeoutId);
          }else{
            timeoutId = setTimeout(function(){
              message.channel.send('You don\'t need me anymore goodbye');
              voiceChannel.leave();
              connection.disconnect();
            },300000)
          }
        }
          */
        })
      } 
    

      if (args.length <= 0) return message.channel.send('You need to provide another argument!');
      if(!message.member.voice.channel)  return message.channel.send('You must be in a channel to play music');
      if(!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
      }

      var server = servers[message.guild.id];
      
      var video = await videoFinder(args.join(' '));
      server.queue.push(video.url);
      //server.queue.push(args.join(' '));

      if(!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
        play(connection,message)
        if(video)
          message.reply(`:ok_hand: Now Playing ***${video.title}***`);
        else
          message.channel.send('No video results found');
      })

      break;

    case 'skip':
      if(!message.member.voice.channel)  return message.channel.send('You must be in a channel to play music');
      if(!message.guild.voiceConnection) message.member.voice.channel.join()

      var server = servers[message.guild.id];
      if(server.dispatcher) server.dispatcher.end();      
      message.channel.send('Skipping music');
      break;
    
    case 'queue':
      if (args.length <= 0) return message.channel.send('You need to provide another argument!');
      if(!message.member.voice.channel)  return message.channel.send('You must be in a channel to play music');
      if(!message.guild.voiceConnection) message.member.voice.channel.join()

      if(!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
      }

      var server = servers[message.guild.id];

      var video = await videoFinder(args.join(' '));
      
      server.queue.push(video.url);
      message.channel.send(`Queueing : ***${video.title}***`);
      break;

    default:
      if(client.commands.has(command)) client.commands.get(command).execute(message, args);
      //else message.channel.send("This commande doesn't exist");
      break
  }

});

client.once('ready', () => {
  console.log('music bot is online!');
});

client.login('OTUxOTY5MzUzNDA5MTIyMzg0.YivMjA.PxXxxg9_Lt2cIEOQ85iOB1972TA');

