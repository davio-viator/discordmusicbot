module.exports = {
  name:'leave',
  description:'Joins and play a music from youtube',
  async execute(message,args){
    const voiceChannel = message.member.voice.channel;

    if(!voiceChannel) return message.channel.send('You need to be in a voice channel to stop the music');
    await voiceChannel.leave();
    await message.channel.send('Leaving the channel :smiling_face_with_tear:');
  }
}