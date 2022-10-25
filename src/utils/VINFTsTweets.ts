export const SendTweetWithImage = async (img: string, status: string) => {
  const { REACT_APP_TWEET_API_BASE_URL, REACT_APP_TWEET_API_ENV } = process.env;
  const apiName = 'tweetImage';

  await fetch(
    `${REACT_APP_TWEET_API_BASE_URL}/${REACT_APP_TWEET_API_ENV}/${apiName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, img }),
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
    });
};

export const SendTweet = async (status: string) => {
  const { REACT_APP_TWEET_API_BASE_URL, REACT_APP_TWEET_API_ENV } = process.env;
  const apiName = 'tweet';

  await fetch(
    `${REACT_APP_TWEET_API_BASE_URL}/${REACT_APP_TWEET_API_ENV}/${apiName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
    });
};
export const SendTweetWithImage64 = async (image64Url: any, body: any) => {
  await fetch(
    `https://kr9d5y7ibh.execute-api.us-east-2.amazonaws.com/dev/tweetImageBase64`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: body, img: image64Url }),
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
    });
};
