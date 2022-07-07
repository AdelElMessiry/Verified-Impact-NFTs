import React from "react";
import { Tooltip } from "@mui/material";
//shared tooltip component
/**
 * @module VINFTsTooltip
 */
/** 
 * shared component to allow use tooltip popup from anywhere
 * @property {component} children - detect the shared label
 * @property {string} title - set the tool tip title
 */
const VINFTsTooltip = ({ children, title }) => {
  return (
    <Tooltip
      classes={{
        tooltip: "vinft-tooltip",
        arrow: "vinft-tooltip-arrow",
      }}
      className=""
      arrow
      placement="top"
      title={title}
    >
      {children}
    </Tooltip>
  );
};
export default VINFTsTooltip;
