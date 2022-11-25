export const sendDiscordMessage = async (id: string, token: string, description: string, title?: any, url?: string, imageUrl?: string)=> {
  const { REACT_APP_DISCORD_API_URL } = process.env;
  const apiName = 'discord';
  const body = {
    id,
    token,
    description,
    title,
    url,
    imageUrl    
  }
  await fetch(
    `${REACT_APP_DISCORD_API_URL}/${apiName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
    });
};