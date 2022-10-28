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
            <ul key={item.address} className='list-inline portfolio-fullscreen mt-4'>
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
                                <FontAwesomeIcon icon={faFacebook} size="2x" />
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
                                <FontAwesomeIcon icon={faInstagram} size="2x" />
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
                                <FontAwesomeIcon icon={faTelegram} size="2x" />
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
                        <img src={item.imgUrl != "" ? item.imgUrl : type == "beneficiary"? Beneficiary: Creator} className="img img-fluid fit-img fit-img-cover" />
                        <div className='overlay-bx'>
                            <div className='overlay-icon align-b text-white text-left'>
                                <div className='text-white text-left port-box'>
                                    <h4 >{item.username}</h4>
                                    <h6 >{item.bio}</h6>
                                    <a href={`${process.env.REACT_APP_CPR_LINK}${item.address}`} target="_blank" style={{ wordBreak: "break-all" }}>
                                        {item.address}
                                    </a>
                                    <div>
                                        <IconImage />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {item?.sdgs_ids?.length > 0 && item?.sdgs_ids !== '0' && (
                <div className='mt-3 px-2'>
                    <a href='https://sdgs.un.org/goals' target='_blank'>
                        <img
                            src={unitedNation}
                            style={{ width: 40, pointerEvents: 'none', cursor: 'default' }}
                        />
                    </a>
                    :{' '}
                    {SDGsData?.filter(({ value }) =>
                        item?.sdgs_ids?.split(',').includes(value.toString())
                    )?.map((sdg, index) => (
                        <VINftsTooltip title={sdg.label} key={index}>
                            <label className="sdgs-icon">
                                <img
                                    src={process.env.PUBLIC_URL + 'images/sdgsIcons/' + sdg.icon}
                                />
                            </label>
                        </VINftsTooltip>
                    ))}
                </div>
            )}
        </>
    )
}
