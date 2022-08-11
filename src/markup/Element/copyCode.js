import React from 'react';
import { toast as VIToast } from 'react-toastify';
import VINftsTooltip from './Tooltip';
//shared tooltip component
const CopyCode = ({ link }) => {
  return (
    <VINftsTooltip title={`Copy a snapshot of NFT code`}>
      <i
        className="ti-shortcode copy "
        onClick={() => {
          navigator.clipboard.writeText(link);
          VIToast.success('Snapshot code copied successfully!');
        }}
      />
    </VINftsTooltip>
  );
};
export default CopyCode;
