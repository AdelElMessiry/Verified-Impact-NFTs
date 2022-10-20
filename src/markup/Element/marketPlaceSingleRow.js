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
//marketplace single row
const MarketPlaceSingleRow = ({ item }) => {

    const { isLoggedIn, entityInfo } = useAuth();
    const [isApproveClicked, setIsApproveClicked] = useState(false);

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
            <td>{item.address}</td>
            <td>
                <a onClick={() => sendMail(item.mail)} className={item.mail == "" ? 'disable-social-media-anchor': ""}>
                    <FontAwesomeIcon icon={faEnvelope} size="2x" />
                </a>
            </td>
            <td>
                <a onClick={() => console.log('test')} className={item.facebook == "" ? 'disable-social-media-anchor': ""}>
                    <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
            </td>
            <td>
                <a href={item.twitter} target="_blank" className={item.twitter == "" ?  'disable-social-media-anchor': ""}>
                    <FontAwesomeIcon icon={faTwitter} size="2x" aria-disabled={true} />
                </a>
            </td>
            <td>
                <a href={item.instagram} target="_blank" className={item.instagram == "" ? 'disable-social-media-anchor': ""}>
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
            </td>
            <td>
                <a href={item.telegram} target="_blank" className={item.telegram == "" ? 'disable-social-media-anchor': ""}>
                    <FontAwesomeIcon icon={faTelegram} size="2x" />
                </a>
            </td>
            <td>
                <Link
                    to={`./BeneficiaryNFTs?beneficiary=${item.address}`}
                    className='dez-page'
                >
                    <FontAwesomeIcon icon={faEye} size="2x" />
                </Link>
            </td>
        </tr>
    );
};
export default MarketPlaceSingleRow