const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
let timeoutId;

module.exports = {
  name:'p',
  description:'Joins and play a music from youtube',
  async execute(message,args,servers){
    const voiceChannel = message.member.voice.channel;
    
    if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has('CONNECT')) return message.channel.send('You don\'t have the correct permissions');
    if(!permissions.has('SPEAK')) return message.channel.send('You don\'t have the correct permissions');
    if(!permissions) return message.channel.send('You need to provide another argument!');

    const connection = await voiceChannel.join()
        
    const videoFinder = async (query) => {
      const videoResult = await ytSearch (query) ;
      
      return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
      
    }
    
    const video = await videoFinder(args.join(' '));

    
    
      
      if(video){
          clearTimeout(timeoutId);
        
          const stream = ytdl(video.url,{filter:'audioonly'});
          connection.play(stream,{seek:0,volume:1})
          .on('finish',() => {
            timeoutId = setTimeout(function(){
              message.channel.send('You don\'t need me anymore goodbye');
              voiceChannel.leave();
            },300000)
          })
          await message.reply(`:ok_hand: Now Playing ***${video.title}***`);
        }else{
          message.channel.send('No video results found');
        }

    /* const {
      joinVoiceChannel,
      createAudioPlayer,
      createAudioResource
    } = require('@discordjs/voice');

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    });
    const videoFinder = async (query) => {
        const videoResult = await ytSearch(query);
        
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
      }

      const player = createAudioPlayer();
      const video = await videoFinder(args.join(' '));
      const stream = ytdl(video.url, {
        filter: "audioonly"
      });
      
      const resource = createAudioResource(stream);

      if(video){
        const stream = ytdl(video.url,{filter:'audioonly'});
        play(stream,{seek:0,volume:1})
        // .on('finish',() => {
        //   setTimeout(function(){
        //     message.channel.send('You don\'t need me anymore goodbye');
        //     voiceChannel.leave();
        //   },300000)
        // });
        await message.reply(`:ok_hand: Now Playing ***${video.title}***`);
      }else{
        message.channel.send('No video results found');
      }
      console.log(args)


    async function play() {
      await player.play(resource);
      connection.subscribe(player);
    } */
  }
}