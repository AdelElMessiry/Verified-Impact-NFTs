import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Layout/Header1';
import Footer from '../Layout/Footer1';
import PageTitle from '../Layout/PageTitle';
import ImgCarousel from '../Element/ImgCarousel'
import ClientCarousel from '../Element/ClientCarousel'

//Images 
import bnr1 from './../../images/banner/bnr2.jpg';
import NFTCard from '../Element/NFTCard';
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { imageBlog } from "../NFTData";

const NFTDetail =()=> {
    const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get("id");
  let item=imageBlog.filter((nft)=>(nft.id=id))
        return (
            <>
                <Header />
                <div className="page-content bg-white">
                    {/* <!-- inner page banner --> */}
                    <div className="dlab-bnr-inr overlay-primary" style={{ backgroundImage: "url(" + bnr1 + ")" }}>
                        <PageTitle motherMenu='NFT Details' activeMenu='NFT Details' />  
                    </div>
                    {/* <!-- inner page banner END --> */}
                    <div className="content-block">
                        {/* <!-- Project Details --> */}
                        <div className="section-full content-inner-2">
                            <div className="container">
                               <div className='row'>
                                   <div className='col'>
                                       <NFTCard item={item[0]}/>
                                   </div>
                               </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- contact area END --> */}
                </div>
                <Footer />
            </>
        )
}
export default NFTDetail;