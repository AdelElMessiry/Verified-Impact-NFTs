import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import HeaderMenu from "../HeaderMenu";
import { NFTProvider } from "../../../contexts/NFTContext";
it("renders without crashing", () => {
    const div = document.createElement("div");
    render(<BrowserRouter>
    <NFTProvider>
        <HeaderMenu />
        </NFTProvider>
    </BrowserRouter>
        , div)
})