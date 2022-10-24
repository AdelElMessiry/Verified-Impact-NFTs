import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import Axios, { AxiosResponse } from 'axios';
import { MediaUpload } from 'twitter-api-client';

import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { HttpStatusCode } from '@libs/HttpStatusCode';
import { twitterClient } from '@utils/twitterApiClient';

const tweetImage: APIGatewayProxyHandler = async (_event) => {
  const { status, img }: any = _event.body;
  let tweet: string = '';

  if (!status || !img) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'status or img are missed'
    );
  }

  try {
    //get status
    tweet = status;
    const image: AxiosResponse = await Axios.get(img, {
      responseType: 'arraybuffer',
    });

    //Upload media to twitter
    const media: MediaUpload = await twitterClient.media.mediaUpload({
      media: Buffer.from(image.data, 'binary').toString('base64'),
    });

    //Send a tweet with status and media
    await twitterClient.tweets.statusesUpdate({
      status: tweet,
      media_ids: media.media_id_string,
    });

    return MessageUtil.success({
      tweet,
      length: tweet.length,
      message: 'Tweet published successfully',
    });
  } catch (error) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      JSON.parse(error.data).errors[0].message
    );
  }
};

export const main = middyfy(tweetImage);
