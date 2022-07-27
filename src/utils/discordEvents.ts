import Discord from 'discord.js';


export async function sendDiscordMessage  (webhookId: any, webhookToken: any, elementName: string, nftUrl:string, description:string){
    console.log('from discord event file ..', webhookId , webhookToken)
    const webhookClient = new Discord.WebhookClient(webhookId, webhookToken);
    const embed = new Discord.MessageEmbed()
      .setTitle(elementName)
      .setColor('#0099ff')
      .setDescription(description)
      .setImage(nftUrl)
      .setTimestamp();
    webhookClient.send({
      username: 'verified-impact-nft-news',
      avatarURL: 'https://cdn-icons-png.flaticon.com/512/1042/1042680.png',
      embeds: [embed],
    });
    webhookClient.destroy();
  };