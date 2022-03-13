const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
var servers = {}

module.exports = {
  name:'skip',
  description:'Joins and play a music from youtube',
  execute(message,args,servers){
    var server = servers[message.guild.id]
    if(server.dispacher) server.dispacher.end();
  }
}