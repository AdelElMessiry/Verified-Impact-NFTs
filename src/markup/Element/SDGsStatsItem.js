import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

import VINftsTooltip from './Tooltip';
import BuyNFTModal from './BuyNFT';
import ListForSaleNFTModal from './ListForSaleNFT';
import NFTTwitterShare from './TwitterShare/NFTTwitterShare';
import CopyCode from './copyCode';
import soldIcon from '../../images/icon/sold.png';
import { faStoreAlt, faStoreAltSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SDGsStatsItem = ({
data
}) => {
  return (
        <div className='sdgs-goals-card'>
          <img
            src={process.env.PUBLIC_URL + 'images/sdgsGoals/' + data.icon}
            alt=''
            className='img img-fluid fit-img fit-img-cover'
          />
          <div className='text-center'>{data.nftNumber}</div>
    </div>
  );
};
export default SDGsStatsItem;
