import React from 'react';
import { toast as VIToast } from 'react-toastify';

import copyIcon from './../../images/icon/copy.png';

//shared tooltip component
const CopyText = ({ link }) => {
  return (
    <img
      src={copyIcon}
      width="40px"
      onClick={() => {
        navigator.clipboard.writeText(link);VIToast.success('Text Copied successfully!');
      }}
      className="cursor-pointer"
    />
  );
};
export default CopyText;
