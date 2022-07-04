import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Header1 from "../Header1";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Header1/></BrowserRouter>,div)
})