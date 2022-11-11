import React from 'react'

import { useHistory } from "react-router-dom";
import {
    faTelegram,
    faFacebook,
    faTwitter,
    faInstagram,

} from '@fortawesome/free-brands-svg-icons';
import { faEye, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SDGsData } from '../../data/SDGsGoals';
import VINftsTooltip from './Tooltip'
import unitedNation from '../../images/icon/unitedNation.png';
import Creator from "../../images/icon/Creator.png"
import Beneficiary from "../../images/icon/Beneficiary.png"
import Bronze from '../../images/icon/Bronze.png';
import Gold from '../../images/icon/Gold.png';
import Platinum from '../../images/icon/Platinum.png';
import Silver from '../../images/icon/Silver.png';
import CopyText from './copyText';
export default function UserCard({ item, type = 'beneficiary' }) {
    const history = useHistory();
    const noData = "No Data Provided"
    const sendMail = (email) => {
        if (email != "") {
            const mailto = `mailto:${email}?subject=New ${type} &body=`;
            window.open(mailto, '_blank');
        } else {

        }

    }
    const visitPage = (item) => {
        history.push(type == "beneficiary" ? `./BeneficiaryNFTs?beneficiary=${item.address}` : `./CreatorNFTs?creator=${item.address}`)
    }
    const IconImage = () => {
        return (
            <ul key={item.address} className='list-inline portfolio-fullscreen mt-4' onClick={(e)=>{
                if(e && e.stopPropagation) e.stopPropagation(); 
              }}>
                <li className='text-success mr-1 align-items-center'>
                    <VINftsTooltip
                        title={`${item.mail == "" ? noData
                            : item.mail
                            } `}
                    >
                        <label>
                            <a onClick={() => sendMail(item.mail)} className={item.mail == "" ? 'disable-social-media-anchor' : ""}>
                                <FontAwesomeIcon icon={faEnvelope} size="2x" />
                            </a>
                        </label>

                    </VINftsTooltip>
                </li>
                <li className='text-success mr-1 align-items-center'>
                    <VINftsTooltip
                        title={`${item.facebook == "" ? noData
                            : item.facebook
                            } `}
                    >
                        <label>
                            <a href={item.facebook} target="_blank" className={item.facebook == "" ? 'disable-social-media-anchor' : ""}>
                                <FontAwesomeIcon icon={faFacebook} size="2x" className={item.facebook == "" ? '': "facebook-icon"}/>
                            </a>
                        </label>

                    </VINftsTooltip>
                </li>
                <li className='text-success mr-1 align-items-center'>
                    <VINftsTooltip
                        title={`${item.twitter == "" ? noData
                            : item.twitter
                            } `}
                    >
                        <label>
                            <a href={item.twitter} target="_blank" className={item.twitter == "" ? 'disable-social-media-anchor' : ""}>
                                <FontAwesomeIcon icon={faTwitter} size="2x" />
                            </a>
                        </label>
                    </VINftsTooltip>
                </li>
                <li className='text-success mr-1 align-items-center'>
                    <VINftsTooltip
                        title={`${item.instagram == "" ? noData
                            : item.instagram
                            } `}
                    >
                        <label>
                            <a href={item.instagram} target="_blank" className={item.instagram == "" ? 'disable-social-media-anchor' : ""}>
                                <FontAwesomeIcon icon={faInstagram} size="2x" className={item.instagram == "" ? '': "instagram-icon"}/>
                            </a>
                        </label>
                    </VINftsTooltip>
                </li>
                <li className='text-success mr-1 align-items-center'>
                    <VINftsTooltip
                        title={`${item.telegram == "" ? noData
                            : item.telegram
                            } `}
                    >
                        <label>
                            <a href={item.telegram} target="_blank" className={item.telegram == "" ? 'disable-social-media-anchor' : ""}>
                                <FontAwesomeIcon icon={faTelegram} size="2x" className={item.telegram == "" ? '': "telegram-icon"}/>
                            </a>
                        </label>
                    </VINftsTooltip>
                </li>
                <li className='text-success mr-1 align-items-center'>
                    <VINftsTooltip
                        title={`${item.externalLink == "" ? noData
                            : `Visit ${type} website.`
                            } `}
                    >
                        <label>
                            <a href={item.externalLink} target="_blank" className={item.externalLink == "" ? 'disable-social-media-anchor' : ""}>
                                <FontAwesomeIcon icon={faEye} size="2x" />
                            </a>
                        </label>
                    </VINftsTooltip>
                </li>
            </ul>

        );
    };
    return (
        <>
            <div className='mb-3 nftcard-parent m-3'  onClick={()=>visitPage(item)}>
                <div className='dlab-box dlab-gallery-box'>
                    <div className='dlab-media dlab-img-overlay1 position-relative dlab-img-effect'>
                        <img src={item.imgUrl != "" ? item.imgUrl : type == "beneficiary"? Beneficiary: Creator} className="img img-fluid fit-img fit-img-contain" />
                        {type == 'creator' && (
                        <div className="sold-icon">
                            <img
                            src={
                                item.percentage == 0
                                ? Platinum
                                : item.percentage > 0 && item.percentage <= 5
                                ? Gold
                                : item.percentage > 5 && item.percentage <= 20
                                ? Silver
                                : Bronze
                            }
                            />
                       </div>
                        )}
                        <div className='overlay-bx'>
                            <div className='overlay-icon align-b text-white text-left'>
                                <div className='text-white text-left port-box'>
                                    <h4 >{item.username}</h4>
                                    <ul className="pl-3">
                                        <li>{item.collectionsNumber} collection(s)</li>
                                        <li>{item.nftNumber} NFT(s)</li>
                                        <li>{item.campaignsNumber} Campaign(s)</li>
                                        {type == 'creator' ? (
                                        <li>{item.beneficiriesNumber} Beneficiary(s)</li>
                                        ) : (
                                        <li>{item.creatorsNumber} Creator(s)</li>
                                        )}
                                    </ul>
                                    <h6 className='VI-text-truncate'>{item.bio}</h6>
                                    <div onClick={(e)=>{if(e && e.stopPropagation) e.stopPropagation(); }}>
                                        <a href={`${process.env.REACT_APP_CPR_LINK}${item.address}`} target="_blank" style={{ wordBreak: "break-all" }}>
                                            {item.address}
                                        </a>
                                        <VINftsTooltip title={'Copy Public Address'}>
                                           <div className="address-link">
                                                <CopyText link={item.address}/>
                                            </div>
                                        </VINftsTooltip>
                                    </div>
                                    <div>
                                        <IconImage />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='mt-3 px-2'>
                {item?.sdgs_ids?.length > 0 && item?.sdgs_ids !== '0' ? (
                <>
                  <VINftsTooltip title={"Click for more info"}>  
                    <a href='https://sdgs.un.org/goals' target='_blank'>
                        <img
                            src={unitedNation}
                            style={{ width: 40, pointerEvents: 'none', cursor: 'default' }}
                        />
                    </a>
                    </VINftsTooltip>
                    :{' '}
                    {SDGsData?.filter(({ value }) =>
                        item?.sdgs_ids?.split(',').includes(value.toString())
                    )?.map((sdg, index) => (
                        <VINftsTooltip title={<div>{sdg.label} <br/> List of the campaign SDGs, click for more info</div> } key={index}>
                          {(sdg.value!=18&&sdg.value!=19)? ( <a className="sdgs-icon" href={`https://sdgs.un.org/goals/goal${sdg.value}`} target='_blank'>
                                <img
                                    src={process.env.PUBLIC_URL + 'images/sdgsIcons/' + sdg.icon}
                                />
                            </a>) :(
                            <label className="sdgs-icon">
                                <img
                                    src={process.env.PUBLIC_URL + 'images/sdgsIcons/' + sdg.icon}
                                />
                            </label>)
                         }
                        </VINftsTooltip>
                    ))}
                </>
                ):<div className='h-25p'></div>}
            </div>
        </>
    )
}
