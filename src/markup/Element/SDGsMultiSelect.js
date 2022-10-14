import React, { useEffect, useRef, useState } from 'react';
import Select, { components } from 'react-select';
import { toast as VIToast } from 'react-toastify';

const { Option } = components;

const SDGsMultiSelect = ({
  data,
  SDGsChanged,
  defaultValues,
  isClear = false,
  mandatorySDGs = [],
  isAddBeneficiary=false
}) => {
  const selectInputRef = useRef();
  const [selectedOptions, setSelectedOptions] = useState();
  useEffect(() => {
    let defaults=defaultValues !== '' && defaultValues !== undefined &&data.length > 0
    ? data.filter((sdg) =>
        defaultValues?.split(',')?.includes(sdg.value.toString())
      )
    : isAddBeneficiary?data[18]:[]
    defaults&& setSelectedOptions(defaults);
  }, [data]);
  useEffect(() => {
    isClear && selectInputRef.current.clearValue();
    if(isAddBeneficiary){
      setSelectedOptions(data[18]);
    }
  }, [isClear]);

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

  const handleSDGsChange = (data, ActionTypes) => {
    if (mandatorySDGs &&mandatorySDGs.length>0 && ActionTypes.action == 'remove-value') {
      var savedSDGs = mandatorySDGs.includes(
        ActionTypes.removedValue.value.toString()
      );
    }
    let finalData = [];
    if (savedSDGs) {
      VIToast.warning(
        `You can't remove ${ActionTypes.removedValue.label} option becuase there is saved data associated to it`
      );
      setSelectedOptions([...data, ActionTypes.removedValue]);
      finalData = [...data, ActionTypes.removedValue];
    } else {
      setSelectedOptions(data);
      finalData = [...data];
    }
    let SDGsValues = finalData.map((d) => d.value);
    SDGsChanged(SDGsValues);
  };

  return (
    <>
    <div className="required-field">
      <Select
        defaultValue={
          defaultValues !== '' && data.length > 0
            ? data.filter((sdg) =>
                defaultValues?.split(',')?.includes(sdg.value.toString())
              )
            : data[18]
        }
        options={data}
        components={{ Option: IconOption }}
        isMulti
        onChange={(v, ActionTypes) => {
          handleSDGsChange(v, ActionTypes);
        }}
        styles={customStyles}
        placeholder="Select your SDGs..."
        ref={selectInputRef}
        isClearable={false}
        value={selectedOptions}
      />
      <span className="text-danger required-field-symbol">*</span>
      </div>
      {(selectedOptions?.length < 0 || selectedOptions == undefined) && (
        <span className="text-danger">Required</span>
      )}
    </>
  );
};

export default SDGsMultiSelect;
