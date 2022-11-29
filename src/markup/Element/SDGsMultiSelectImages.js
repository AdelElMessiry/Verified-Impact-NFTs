import React, { useState } from 'react';
import SingleSDGsMultiSelectImage from './SingleSDGsMultiSelectImage';
import VINftsTooltip from './Tooltip';

const SDGsMultiSelectImages = ({ data, SDGsChanged, isClear }) => {
  const [selectedSDGs, setSelectedSDGs] = useState([]);
  const hendleDataChange = (action, v) => {
    if (action == 'remove') {
      const index = selectedSDGs.indexOf(v);
      if (index > -1) {
        // only splice array when item is found
        selectedSDGs.splice(index, 1);
        setSelectedSDGs(selectedSDGs); // 2nd parameter means remove one item only
        SDGsChanged(selectedSDGs);

      }
    }else{
    setSelectedSDGs([...selectedSDGs, v]);
    SDGsChanged([...selectedSDGs, v]);
    }
  };

  return (
    <>
      {data.map((d) => (
        <SingleSDGsMultiSelectImage
          data={d}
          key={d.value}
          SDGsChanged={(action, v) => {
            hendleDataChange(action, v);
          }}
          isClear={isClear}
        />
      ))}
    </>
  );
};

export default SDGsMultiSelectImages;
