import React, { useState } from 'react';
import { Col, Container, Row, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTelegram,
    faFacebook,
    faTwitter,
    faInstagram,

} from '@fortawesome/free-brands-svg-icons';
import { faEye, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import VINftsTooltip from './Tooltip';
//marketplace single row
const MarketPlaceSingleRow = ({ item }) => {

    const { isLoggedIn, entityInfo } = useAuth();
    const [isApproveClicked, setIsApproveClicked] = useState(false);
    const noData = "No Data Provided"
    const sendMail = (email) => {
        if (email != "") {
            const mailto = `mailto:${email}?subject=New Beneficiary &body=`;
            window.location.href = mailto;
        } else {

        }

    }
    //mailTo
    console.log(item, "test te")
    return (
        <tr key={item.address}>
            <th scope='row'>

            </th>
            <td>{item.username}</td>
            <td>
                <a href={`${process.env.REACT_APP_CPR_LINK}${item.address}`} target="_blank">
                    {item.address}
                </a>
            </td>
            <td>
                <VINftsTooltip
                    title={`${item.mail == "" ? noData
                        : item.mail
                        } `}
                >
                    <a onClick={() => sendMail(item.mail)} className={item.mail == "" ? 'disable-social-media-anchor' : ""}>
                        <FontAwesomeIcon icon={faEnvelope} size="2x" />
                    </a>
                </VINftsTooltip>
            </td>

            <td>
                <VINftsTooltip
                    title={`${item.facebook == "" ? noData
                        : item.facebook
                        } `}
                >
                    <a href={item.facebook} target="_blank" className={item.facebook == "" ? 'disable-social-media-anchor' : ""}>
                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                    </a>
                </VINftsTooltip>
            </td>

            <td>
                <VINftsTooltip
                    title={`${item.twitter == "" ? noData
                        : item.twitter
                        } `}
                >
                    <a href={item.twitter} target="_blank" className={item.twitter == "" ? 'disable-social-media-anchor' : ""}>
                        <FontAwesomeIcon icon={faTwitter} size="2x" aria-disabled={true} />
                    </a>
                </VINftsTooltip>
            </td>
            <td>
                <VINftsTooltip
                    title={`${item.instagram == "" ? noData
                        : item.instagram
                        } `}
                >
                    <a href={item.instagram} target="_blank" className={item.instagram == "" ? 'disable-social-media-anchor' : ""}>
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                    </a>
                </VINftsTooltip>
            </td>
            <td>
                <VINftsTooltip
                    title={`${item.telegram == "" ? noData
                        : item.telegram
                        } `}
                >
                    <a href={item.telegram} target="_blank" className={item.telegram == "" ? 'disable-social-media-anchor' : ""}>
                        <FontAwesomeIcon icon={faTelegram} size="2x" />
                    </a>
                </VINftsTooltip>
            </td>
            <td>
                <VINftsTooltip
                    title={`${item.address == "" ? noData
                        : "Visit beneficiary page"
                        } `}
                >
                    <Link
                        to={`./BeneficiaryNFTs?beneficiary=${item.address}`}
                        className='dez-page'
                    >
                        <FontAwesomeIcon icon={faEye} size="2x" />
                    </Link>
                </VINftsTooltip>
            </td>
        </tr>
    );
};
export default MarketPlaceSingleRow