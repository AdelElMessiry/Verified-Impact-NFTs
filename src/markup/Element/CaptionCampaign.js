import { Link } from 'react-router-dom';

import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import VINftsTooltip from '../Element/Tooltip';

export const CaptionCampaign = (data, item, IconImage) => (
  <div className='text-white text-left port-box'>
    <h5>{data[item].title}</h5>
    <p>
      <b>Description: </b>
      {data[item].description}
    </p>
    <p>
      <b>Beneficiary: </b>
      <VINftsTooltip
        title={`Click to see all NFTs for "${data[item].beneficiaryName}" beneficiary`}
      >
        <Link
          to={`./BeneficiaryNFTs?beneficiary=${data[item].beneficiaryName}`}
          className='dez-page text-white'
        >
          {data[item].beneficiaryName}
        </Link>
      </VINftsTooltip>
      <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
        {data[item].beneficiaryPercentage}%
      </span>

      <b className='ml-4'>Campaign: </b>
      <VINftsTooltip
        title={`Click to see all NFTs for "${data[item].campaignName}" campaign`}
      >
        {data[item].beneficiary ? (
          <Link
            to={`./BeneficiaryNFTs?beneficiary=${data[item].beneficiaryName}&campaign=${data[item].campaignName}`}
            className='dez-page text-white'
          >
            {data[item].campaignName}
          </Link>
        ) : (
          <Link
            to={`./CreatorNFTs?creator=${data[item].creatorName}&collection=${data[item].collectionName}`}
            className='dez-page text-white'
          >
            {data[item].campaignName}
          </Link>
        )}
      </VINftsTooltip>
      <b className='ml-4'>Creator: </b>
      <VINftsTooltip
        title={`Click to see all NFTs created by "${data[item].creatorName}"`}
      >
        <Link
          to={`./CreatorNFTs?creator=${data[item].creatorName}`}
          className='dez-page text-white'
        >
          {data[item].creatorName}
        </Link>
      </VINftsTooltip>
      <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
        {data[item].creatorPercentage}%
      </span>

      <b className='ml-4'>Collection: </b>
      <Link
        to={`./CreatorNFTs?creator=${data[item].creatorName}&collection=${data[item].collectionName}`}
        className='dez-page text-white'
      >
        {' '}
        {data[item].collectionName}
      </Link>
    </p>

    <p className='d-flex align-content-center align-items-center'>
      <b>Price: </b>
      {data[item].price} {data[item].currency}
      &nbsp;&nbsp; <IconImage nft={data[item]} />
      {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
        <NFTTwitterShare item={data[item]} />
      )}
    </p>
  </div>
);
