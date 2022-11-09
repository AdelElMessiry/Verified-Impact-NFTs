import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import VINftsTooltip from './Tooltip';

const SingleSDGsMultiSelectImage = ({ data, SDGsChanged, isClear }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isClearData, setIsClearData] = useState(isClear);
  useEffect(()=>{
    setIsClearData(isClear)
  },[isClear])
  return (
    <>
      <VINftsTooltip title={data.label}>
        <div className="position-relative">
          <img
            src={process.env.PUBLIC_URL + 'images/sdgsGoals/' + data.image}
            style={{ width: 40 }}
            onClick={() => {
              SDGsChanged(
                isSelected && !isClearData ? 'remove' : 'add',
                data.value
              );
              setIsSelected(!isSelected);
              setIsClearData(false)
            }}
            className={
              isSelected && !isClearData ? 'selectedSDG' : 'notSelectedSDG'
            }
          />
          {isSelected && !isClearData && (
            <FontAwesomeIcon
              icon={faClose}
              className="remove-select"
              onClick={() => {
                SDGsChanged(
                  isSelected && !isClearData ? 'remove' : 'add',
                  data.value
                );
                setIsSelected(!isSelected);
                setIsClearData(false)
              }}
            />
          )}
        </div>
      </VINftsTooltip>
    </>
  );
};

export default SingleSDGsMultiSelectImage;
