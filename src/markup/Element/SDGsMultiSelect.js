import React, { useEffect, useRef } from 'react';
import Select, { components } from 'react-select';

const { Option } = components;

const SDGsMultiSelect = ({ data, SDGsChanged,defaultValues,isClear=false }) => {
  const selectInputRef = useRef();
useEffect(()=>{
 isClear&& selectInputRef.current.clearValue();
},[isClear])

  const IconOption = (props) => {
    return (
      <Option {...props}>
        <img
          src={process.env.PUBLIC_URL + 'images/sdgsIcons/' + props.data.icon}
          style={{ width: 25 }}
        />{' '}
         {props.data.label}
      </Option>
    );
  };
  const customStyles = {
    control: (provided, state) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      background: '#efefef none repeat scroll 0 0',
      boxShadow: '2px 2px 4px 0 rgb(0 0 0 / 5%)',
      fontSize: '14px',
    }),
    multiValue: (provided, state) => ({
      ...provided,
      background: '#6cc000',
      color: '#fff',
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: '#fff',
    }),
  };

  const handleSDGsChange = (data) => {
    let SDGsValues = data.map(d => d.value);
    SDGsChanged(SDGsValues);
  };

  return (
    <Select 
      defaultValue={(defaultValues!==""&&data.length>0)?data.filter((sdg)=>(defaultValues?.split(",")?.includes(sdg.value.toString()))):undefined}
      options={data}
      components={{ Option: IconOption }}
      isMulti
      onChange={(v) => {
        handleSDGsChange(v);
      }}
      styles={customStyles}
      placeholder="Select your SDGs..."
      ref={selectInputRef}
    /> 
  );
};

export default SDGsMultiSelect;
