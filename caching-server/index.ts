import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from 'redis';
import { cep47 } from './cep47';

const app = express();

app.use(bodyParser.json());

//Redis connection
var client: any = createClient({
  url: 'rediss://default:ba50e22dbca849bcbd2cae68bdb2f6a8@us1-humble-slug-38588.upstash.io:38588',

  // url: 'redis://us1-humble-slug-38588.upstash.io',
  // username: 'test',
  // password: 'ba50e22dbca849bcbd2cae68bdb2f6a8',
});

client.on('error', function (err) {
  console.log(err);

  throw err;
});

client.on('connect', function () {
  console.log('Connected!');
});

const getNFTsList = async () => {
  const nftsCount: any = await cep47.totalSupply();
  // console.log(parseInt(nftsCount));

  const nftsList = [];
  for (let tokenId of Array.from(Array(1).keys())) {
    tokenId = tokenId + 1;

    const nft_metadata = await cep47.getMappedTokenMeta(tokenId.toString());
    await client.rPush(['nfts_list', { ...nft_metadata, tokenId }]);
    nftsList.push({ ...nft_metadata, tokenId });

    console.log(nftsList);
  }

  return nftsList;
};

app.get('/api/nfts', async (req, res, next) => {
  await client.connect();
  const result = await client.lRange('nfts_list', 0, -1);
  console.log(result);

  if (result?.length) {
    res.status(200).json({
      list: result,
    });
  } else {
    const list = await getNFTsList();
    res.status(200).json({
      list,
    });
  }

  // client.lRange('nfts_list', 0, -1, async function (err, reply) {
  //   console.log('x');

  //   if (reply.length > 0)
  //   else await getNFTsList().then((list) => res(list));
  // });
});

app.post('/api/nft', (req, res, next) => {
  const { nft } = req.params;

  client
    .rPush('nfts_list', nft)
    .then(() => res({ success: 'nft saved successfully' }));
});

app.listen(3000, () => console.log('Server running at port 3000'));
