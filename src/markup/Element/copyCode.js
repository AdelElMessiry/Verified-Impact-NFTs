import React from 'react';
import { toast as VIToast } from 'react-toastify';
import VINftsTooltip from './Tooltip';
//shared tooltip component
const CopyCode = ({ link }) => {
  return (
    <div
    onClick={() => {
        navigator.clipboard.writeText(link);VIToast.success('Snapshot code copied successfully!');
      }}
    >
        <VINftsTooltip
          title={`Copy a snapshot of NFT code`}
          >
    <i className='ti-shortcode copy portfolio-fullscreen'/>
    </VINftsTooltip>
    </div>
  );
};
export default CopyCode;
