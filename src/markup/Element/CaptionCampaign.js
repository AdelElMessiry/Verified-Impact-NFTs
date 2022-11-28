import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import VINftsTooltip from '../Element/Tooltip';
import CopyText from './copyText';

import soldIcon from '../../images/icon/sold.png';
import CopyCode from './copyCode';
import unitedNation from '../../images/icon/unitedNation.png';
import { SDGsData } from '../../data/SDGsGoals';

export const CaptionCampaign = (data, IconImage) => (
  <div className="text-white text-left port-box">
    <h5>
      {data.title} &nbsp;&nbsp;{' '}
      {data.isCreatorOwner === false && data.isForSale === 'false' && (
        <img src={soldIcon} width="40px" />
      )}
    </h5>
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
          to={`./BeneficiaryNFTs?beneficiary=${data.beneficiary}`}
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
            to={`./BeneficiaryNFTs?beneficiary=${data.beneficiary}&campaign=${data.campaign}`}
            className='dez-page text-white'
          >
            {data.campaignName}
          </Link>
        ) : (
          <Link
            to={`./CreatorNFTs?creator=${data.creator}&collection=${data.collection}`}
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
          to={`./CreatorNFTs?creator=${data.creator}`}
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
        to={`./CreatorNFTs?creator=${data.creator}&collection=${data.collection}`}
        className='dez-page text-white'
      >
        {' '}
        {data.collectionName}
      </Link>
    </p>

    <p className='d-flex align-content-center align-items-center'>
      {data.isCreatorOwner !== false && data.isForSale !== 'false' && (
        <>
          <b>Price: </b>
          {data.price} {data.currency}
        </>
      )}
      &nbsp;&nbsp; <IconImage nft={data} />
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
      &nbsp;&nbsp;{' '}
      <CopyText
        link={`${window.location.origin}/#/nft-detail?id=${data.tokenId}`}
      />
      &nbsp;&nbsp;{' '}
      <CopyCode
        link={`<iframe src='${window.location.origin}/#/nft-card?id=${data.tokenId}'></iframe>`}
      />
    </p>
    <p>
      {data?.sdgs_ids?.length > 0 && data?.sdgs_ids !== '0' && (
        <div className='mt-3 px-2'>
          <a href='https://sdgs.un.org/goals' target='_blank'>
            <img
              src={unitedNation}
              style={{ width: 40, pointerEvents: 'none', cursor: 'default' }}
            />
          </a>
          :{' '}
          {SDGsData?.filter(({ value }) =>
            data?.sdgs_ids?.split(',').includes(value.toString())
          )?.map((sdg, index) => (
            <VINftsTooltip title={sdg.label} key={index}>
              <label>
                <img
                  src={process.env.PUBLIC_URL + 'images/sdgsIcons/' + sdg.icon}
                  style={{
                    width: 25,
                    pointerEvents: 'none',
                    cursor: 'default',
                  }}
                />
              </label>
            </VINftsTooltip>
          ))}
        </div>
      )}
    </p>
  </div>
);
