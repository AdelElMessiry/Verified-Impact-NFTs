import React from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const SDGsStatsItem = ({ data }) => {
  return (
    <Link
    to={`./SDGGoalNFTs?id=${data.value}`}
    className='dez-page text-white'
  >
    <div className="sdgs-goals-card">
      <img
        src={process.env.PUBLIC_URL + 'images/sdgsGoals/' + data.image}
        alt=""
        className="img img-fluid fit-img fit-img-cover"
      />
      <div className="text-center">
        {data.nftNumber !== undefined ? (
          <>
            <span className='text-success'>{data.nftNumber || 0}</span> 
          </>
        ) : (
          <>
            <Spinner
              animation="border"
              variant="success"
              className="stats-spinner"
            />
          </>
        )}<span className='ml-1 text-gray-dark'>NFTS</span>
      </div>
    </div>
    </Link>
  );
};
export default SDGsStatsItem;
