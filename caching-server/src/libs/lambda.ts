import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

export const middyfy = (handler) => {
  return middy(handler)
    .use(
      doNotWaitForEmptyEventLoop({
        runOnError: true,
        runOnBefore: true,
        runOnAfter: true,
      })
    )
    .use(middyJsonBodyParser());
};
