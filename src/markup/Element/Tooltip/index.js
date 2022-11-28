import React from 'react';
import { Tooltip } from '@mui/material';

//shared tooltip component
const VINftsTooltip = ({ children, title }) => {
  return (
    <Tooltip
      classes={{
        tooltip: 'vinft-tooltip',
        arrow: 'vinft-tooltip-arrow',
      }}
      className=''
      arrow
      placement='top'
      title={title}
    >
      {children}
    </Tooltip>
  );
};
export default VINftsTooltip;
