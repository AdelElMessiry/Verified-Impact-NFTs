import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';

import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { HttpStatusCode } from '@libs/HttpStatusCode';
import { twitterClient } from '@utils/twitterApiClient';

const tweet: APIGatewayProxyHandler = async (_event) => {
  const { status }: any = _event.body;
  let tweet: string = '';

  if (!status) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'status is missed'
    );
  }

  try {
    //get status
    tweet = status;

    //Send a tweet with status and media
    await twitterClient.tweets.statusesUpdate({
      status: tweet,
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

export const main = middyfy(tweet);
