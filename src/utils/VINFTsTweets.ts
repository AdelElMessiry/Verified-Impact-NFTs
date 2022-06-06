export const SendTweetWithImage = async (image: any, body: any) => {
  await fetch(
    `https://kr9d5y7ibh.execute-api.us-east-2.amazonaws.com/dev/tweetImage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: body, img: image }),
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      debugger;
    });
};

export const SendTweet = async (body: any) => {
  debugger;
  await fetch(
    `https://kr9d5y7ibh.execute-api.us-east-2.amazonaws.com/dev/tweet`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: body }),
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      debugger;
    });
};
