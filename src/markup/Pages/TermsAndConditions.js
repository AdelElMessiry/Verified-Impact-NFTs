import React, { useRef } from 'react';
import Layout from '../Layout';
import bnr1 from '../../images/banner/bnr1.jpg';
import PageTitle from '../Layout/PageTitle';

const scrollToRef = (ref) => {
  ref.current.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};
const TermsOfServices = () => {
  const introRef = useRef(null);
  const modifyRef = useRef(null);
  const AssumptionRef = useRef(null);
  const DisclaimerRef = useRef(null);
  const ProprietaryRef = useRef(null);
  const EligibilityRef = useRef(null);
  const PrivacyRef = useRef(null);
  const ProhibitedRef = useRef(null);
  const LimitationRef = useRef(null);
  const executeScroll = (e, refName) => {
    console.log(e);
    scrollToRef(refName);
  };
  return (
    <Layout>
      <div className="page-content bg-white">
        {/* <!-- inner page banner --> */}
        <div
          className="dlab-bnr-inr overlay-primary bg-pt"
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <PageTitle
            motherMenu="Terms of Service"
            activeMenu="Terms of Service"
          />
        </div>
        <div className="section-full content-inner shop-account">
          {/* <!-- Product --> */}
          <div className="container">
            <div className=" m-auto m-b30">
              <div className="row">
                <div className="col-lg-4 dg__sidebar">
                  <div className="single__widget sid-catrgory">
                    <ul>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, introRef)}
                        >
                          Introduction
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, modifyRef)}
                        >
                          Modification of this Agreement
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, AssumptionRef)}
                        >
                          Assumption of Risk
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, DisclaimerRef)}
                        >
                          Disclaimers
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, ProprietaryRef)}
                        >
                          Proprietary Rights
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, EligibilityRef)}
                        >
                          Eligibility
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, PrivacyRef)}
                        >
                          Privacy
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, ProhibitedRef)}
                        >
                          Prohibited Activity
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, LimitationRef)}
                        >
                          Limitation of Liability
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div ref={introRef}>
                    <h3 className="text-success">Introduction</h3>
                    <p>
                      Introduction "Verified Impact NFTs" is an NFT marketplace
                      interface maintained by a decentralized team of
                      developers. It facilitates interaction with the “Verified
                      Impact” Protocol, an NFT ecosystem deployed on the Casper
                      blockchain.
                    </p>
                  </div>
                  <div ref={modifyRef} className="pt-5">
                    <h3 className="text-success">
                      Modification of this Agreement
                    </h3>
                    <p>
                      Modification of this Agreement We reserve the right, in
                      our sole discretion, to modify this Agreement. All
                      modifications become effective when they are posted, and
                      we will notify you by updating the date at the top of the
                      Agreement.
                    </p>
                  </div>
                  <div ref={AssumptionRef} className="pt-5">
                    <h3 className="text-success">Assumption of Risk</h3>
                    <p>
                      Assumption of Risk By accessing "Verified Impact NFTs"’s
                      software, you accept and acknowledge: The prices of
                      blockchain assets are extremely volatile and we cannot
                      guarantee purchasers will not lose money. Assets available
                      to trade on "Verified Impact NFTs" should not be viewed as
                      investments: their prices are determined by the market and
                      fluctuate considerably. You are solely responsible for
                      determining any taxes that apply to your transactions.
                      "Verified Impact NFTs"’s services are non-custodial, such
                      that we do not at any time have custody of the NFTs owned
                      by our users. We do not store, send, or receive Digital
                      Assets, as they respectively exist on the blockchain. As
                      such, and due to the decentralized nature of the services
                      provided, you are fully responsible for protecting your
                      wallets and assets from any and all potential risks. Our
                      software indexes NFTs on the Casper blockchain as they are
                      created, and we are not responsible for any assets that
                      users may mistakenly or willingly access or purchase
                      through the software. You accept responsibility for any
                      risks associated with purchasing such user-generated
                      content, including (but not limited to) the risk of
                      purchasing counterfeit assets, mislabeled assets, assets
                      that are vulnerable to metadata decay, assets on faulty
                      smart contracts, and assets that may become
                      untransferable.
                    </p>
                  </div>
                  <div ref={DisclaimerRef} className="pt-5">
                    <h3 className="text-success">Disclaimers</h3>
                    <p>
                      Disclaimers We do not represent or warrant that access to
                      the front-end interface will be continuous, uninterrupted,
                      timely, or secure; that the information contained in the
                      interface will be accurate, reliable, complete, or
                      current; or that the Interface will be free from errors,
                      defects, viruses, or other harmful elements.
                    </p>
                  </div>
                  <div ref={ProprietaryRef} className="pt-5">
                    <h3 className="text-success">Proprietary Rights</h3>
                    <p>
                      Proprietary Rights We own the intellectual property
                      generated by core contributors to "Verified Impact NFTs"
                      for the use of "Verified Impact NFTs", including (but not
                      limited to) software, text, designs, images, and
                      copyrights. Unless otherwise stated, "Verified Impact
                      NFTs" reserves exclusive rights to its intellectual
                      property. Refer to our Brand Assets Documentation for
                      guidance on the use of "Verified Impact NFTs"’s
                      copyrighted materials.
                    </p>
                  </div>
                  <div ref={EligibilityRef} className="pt-5">
                    <h3 className="text-success">Eligibility</h3>
                    <p>
                      Eligibility To access or use the front-end interface, you
                      represent that you are at least the age of majority in
                      your jurisdiction. You further represent that your access
                      and use of the front-end interface will fully comply with
                      all applicable laws and regulations and that you will not
                      access or use the front-end interface to conduct, promote,
                      or otherwise facilitate any illegal activity.
                    </p>
                    <p>
                      Furthermore, you represent that neither you nor any entity
                      you represent are included in any trade embargoes or
                      sanctions list (“Subject to Restrictions”), nor resident,
                      citizen, national or agent of, or an entity organized,
                      incorporated, or doing business in such territories
                      (“Restricted Territories”).
                    </p>
                  </div>
                  <div ref={PrivacyRef} className="pt-5">
                    <h3 className="text-success">Privacy</h3>
                    <p>
                      Privacy When you use the front-end interface, the only
                      information we collect from you is your blockchain wallet
                      address, completed transaction hashes, and token
                      identifiers. We do not collect any personal information
                      from you. We do, however, use third-party services like
                      Google Analytics, which may receive your publicly
                      available personal information. We do not take
                      responsibility for any information you make public on the
                      Casper blockchain by taking actions through the front-end
                      interface.
                    </p>
                  </div>
                  <div ref={ProhibitedRef} className="pt-5">
                    <h3 className="text-success">Prohibited Activity</h3>
                    <p>
                      Prohibited Activity You agree not to engage in any of the
                      following categories of prohibited activity in relation to
                      your access and use of the front-end interface:
                      Intellectual property infringement, such as violations to
                      copyright, trademark, service mark or patent. Interaction
                      with assets, listings, smart contracts, and collections
                      that include metadata that may be deemed harmful or
                      illegal, including (but not limited to): metadata that
                      promotes suicide or self-harm, incites hate or violence
                      against others, degrades or doxxes another individual,
                      depicts minors in sexually suggestive situations, or
                      raises funds for terrorist organizations. Transacting in
                      any Restricted Territory or interacting with any
                      blockchain addresses controlled indirectly or directly by
                      persons or entities Subject to Restrictions, that is,
                      included in any trade embargoes or sanctions list.
                    </p>
                  </div>
                  <div ref={LimitationRef} className="pt-5">
                    <h3 className="text-success">Limitation of Liability</h3>
                    <p>
                      Limitation of Liability "Verified Impact NFTs" is in no
                      way liable for any damages of any form resulting from your
                      access or use of "Verified Impact NFTs" software,
                      including (but not limited to) any loss of profit, digital
                      assets, or intangible property, and assumes no liability
                      or responsibility for any errors, omissions, mistakes, or
                      inaccuracies in the content provided on "Verified Impact
                      NFTs"-controlled software or media; unauthorized access or
                      use of any server or database controlled by "Verified
                      Impact NFTs"; bugs, viruses etc. in the software;
                      suspension of service; or any conduct of any third party
                      whatsoever. Furthermore, any hyperlink or reference to a
                      third party website, product, or person that is shared or
                      published in any software or other channel by "Verified
                      Impact NFTs" is for your convenience only, and does not
                      constitute an endorsement. We accept no legal
                      responsibility for content or information of such third
                      party sites.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfServices;
