import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Footer1 from '../Footer1'

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Footer1/></BrowserRouter>,div)
})