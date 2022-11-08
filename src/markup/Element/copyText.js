import React from 'react';
import { toast as VIToast } from 'react-toastify';

import copyIcon from './../../images/icon/copy.png';

//shared tooltip component
const CopyText = ({ link }) => {
  return (
   <div onClick={(e) => {
       e.stopPropagation(); navigator.clipboard.writeText(link);VIToast.success('Text Copied successfully!');
      }}> <img
      src={copyIcon}
      width="40"
      className="cursor-pointer not-clickable-link"
    /></div>
  );
};
export default CopyText;
