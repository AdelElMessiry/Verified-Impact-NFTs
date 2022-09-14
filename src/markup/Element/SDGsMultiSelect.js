import React from 'react';
import Select, { components } from 'react-select';

const { Option } = components;

const SDGsMultiSelect = ({ data, SDGsChanged }) => {
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
      defaultValue={data[0]}
      options={data}
      components={{ Option: IconOption }}
      isMulti
      onChange={(v) => {
        handleSDGsChange(v);
      }}
      styles={customStyles}
    />
  );
};

export default SDGsMultiSelect;
