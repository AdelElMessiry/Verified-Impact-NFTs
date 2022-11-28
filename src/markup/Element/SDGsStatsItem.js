import React from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import VINftsTooltip from './Tooltip';

const SDGsStatsItem = ({ data ,nftLoaded}) => {
  return (
    <Link
      to={`./SDGGoalNFTs?id=${data.value.toString()}`}
      className="dez-page text-white"
    >
      <div className="sdgs-goals-card">
        <VINftsTooltip title={data.description}>
          <img
            src={process.env.PUBLIC_URL + 'images/sdgsGoals/' + data.image}
            alt=""
            className="img img-fluid fit-img fit-img-cover"
          />
        </VINftsTooltip>
        <div className="text-center">
          {(data.nftNumber !== undefined ||nftLoaded) ? (
            <VINftsTooltip title={`${data.nftNumber} NFTS`}>
              <span className="text-success fz-14">{data.nftNumber || '-'}</span>
            </VINftsTooltip>
          ) : (
            <>
              <Spinner
                animation="border"
                variant="success"
                className="stats-spinner"
              />
            </>
          )}
          {data.price && (
            <VINftsTooltip title={`Total Price of NFTS is ${data.price} CSPR`}>
              <span className="fz-14 text-gray-dark">-{data.price} CSPR</span>
            </VINftsTooltip>
          )}
        </div>
      </div>
    </Link>
  );
};
export default SDGsStatsItem;
