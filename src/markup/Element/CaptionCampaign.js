import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import VINftsTooltip from '../Element/Tooltip';

export const CaptionCampaign = (data, IconImage) => (
  <div className='text-white text-left port-box'>
    <h5>{data.title}</h5>
    <p>
      <b>Description: </b>
      {data.description}
    </p>
    <p>
      <b>Beneficiary: </b>
      <VINftsTooltip
        title={`Click to see all NFTs for "${data.beneficiaryName}" beneficiary`}
      >
        <Link
          to={`./BeneficiaryNFTs?beneficiary=${data.beneficiaryName}`}
          className='dez-page text-white'
        >
          {data.beneficiaryName}
        </Link>
      </VINftsTooltip>
      <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
        {data.beneficiaryPercentage}%
      </span>

      <b className='ml-4'>Campaign: </b>
      <VINftsTooltip
        title={`Click to see all NFTs for "${data.campaignName}" campaign`}
      >
        {data.beneficiary ? (
          <Link
            to={`./BeneficiaryNFTs?beneficiary=${data.beneficiaryName}&campaign=${data.campaignName}`}
            className='dez-page text-white'
          >
            {data.campaignName}
          </Link>
        ) : (
          <Link
            to={`./CreatorNFTs?creator=${data.creatorName}&collection=${data.collectionName}`}
            className='dez-page text-white'
          >
            {data.campaignName}
          </Link>
        )}
      </VINftsTooltip>
      <b className='ml-4'>Creator: </b>
      <VINftsTooltip
        title={`Click to see all NFTs created by "${data.creatorName}"`}
      >
        <Link
          to={`./CreatorNFTs?creator=${data.creatorName}`}
          className='dez-page text-white'
        >
          {data.creatorName}
        </Link>
      </VINftsTooltip>
      <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
        {data.creatorPercentage}%
      </span>

      <b className='ml-4'>Collection: </b>
      <Link
        to={`./CreatorNFTs?creator=${data.creatorName}&collection=${data.collectionName}`}
        className='dez-page text-white'
      >
        {' '}
        {data.collectionName}
      </Link>
    </p>

    <p className='d-flex align-content-center align-items-center'>
      <b>Price: </b>
      {data.price} {data.currency}
      &nbsp;&nbsp; {data.isForSale === 'true' && <IconImage nft={data} />}
      {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
        <NFTTwitterShare item={data} />
      )}
      &nbsp;&nbsp;{' '}
      <Link
        to={`./nft-detail?id=${data.tokenId}`}
        className="mr-1 text-success text-underline"
      >
        <QRCode
          value={`${window.location.origin}/#/nft-detail?id=${data.tokenId}`}
          size={80}
        />
      </Link>
    </p>
  </div>
);
