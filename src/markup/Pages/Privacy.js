import React, { useRef } from 'react';
import Layout from '../Layout';
import bnr1 from '../../images/banner/bnr1.jpg';
import PageTitle from '../Layout/PageTitle';
import { Link } from 'react-router-dom';

const scrollToRef = (ref) => {
  ref.current.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};
const Privacy = () => {
  const introRef = useRef(null);
  const typesOfDataRef = useRef(null);
  const personalDataRef = useRef(null);
  const disclosureRef = useRef(null);
  const thirdPartyWebSiteRef = useRef(null);
  const thirdPartyWalletRef = useRef(null);
  const choicesRef = useRef(null);
  const dataAccessRef = useRef(null);
  const retentionRef = useRef(null);
  const protectionRef = useRef(null);
  const minorsRef = useRef(null);
  const outsideUSARef = useRef(null);
  const privacyRef = useRef(null);
  const questionsRef = useRef(null);
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
          <PageTitle motherMenu="Privacy Policy" activeMenu="Privacy Policy" />
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
                          onClick={(e) => executeScroll(e, typesOfDataRef)}
                        >
                          Types of Data We Collect
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, personalDataRef)}
                        >
                          Use of Your Personal Data
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, disclosureRef)}
                        >
                          Disclosure of Your Personal Data
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) =>
                            executeScroll(e, thirdPartyWebSiteRef)
                          }
                        >
                          Third-Party Websites
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, thirdPartyWalletRef)}
                        >
                          Third-Party Wallets
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, choicesRef)}
                        >
                          Your Choices Regarding Information
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, dataAccessRef)}
                        >
                          Data Access and Control
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, retentionRef)}
                        >
                          Data Retention
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, protectionRef)}
                        >
                          Data Protection
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, minorsRef)}
                        >
                          Minors
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, outsideUSARef)}
                        >
                          Users Outside of the United States
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, privacyRef)}
                        >
                          Changes to This Privacy Policy
                        </div>
                      </li>
                      <li>
                        <div
                          className="side-bar-link"
                          onClick={(e) => executeScroll(e, questionsRef)}
                        >
                          Questions
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div ref={introRef}>
                    <h3 className="text-success">Introduction</h3>
                    <p>
                      Verified Impact NFT (“Verified Impact NFT,” “we”, “us”, or
                      “our”) is committed to protecting your privacy. We have
                      prepared this Privacy Policy to describe to you our
                      practices regarding the Personal Data (as defined below)
                      we collect, use, and share in connection with the Verified
                      Impact NFT website, mobile app, and other software
                      provided on or in connection with our services, as
                      described in our Terms of Service (collectively, the
                      “Service”). “NFT” in this Privacy Policy means a
                      non-fungible token or similar digital item implemented on
                      a blockchain (such as the Casper blockchain), which uses
                      smart contracts to link to or otherwise be associated with
                      certain content or data.
                    </p>
                  </div>
                  <div ref={typesOfDataRef} className="pt-5">
                    <h3 className="text-success">Types of Data We Collect</h3>
                    <p>
                      Types of Data We Collect. “Personal Data” means data that
                      allows someone to identify you individually, including,
                      for example, your name, email address, as well as any
                      other non-public information about you that is associated
                      with or linked to any of the foregoing. “Anonymous Data”
                      means data, including aggregated and de-identified data,
                      that is not associated with or linked to your Personal
                      Data; Anonymous Data does not, by itself, permit the
                      identification of individual persons. We collect Personal
                      Data and Anonymous Data as described below.
                    </p>
                    <div className="ml-5">
                      <ul>
                        <li>
                          a. Information You Provide Us.
                          <ul className="ml-5">
                            <li>
                              i. When you use our Service, update your account
                              profile, or contact us, we may collect Personal
                              Data from you, such as email address, first and
                              last name, user name, and other information you
                              provide. We also collect your blockchain address,
                              which may become associated with Personal Data
                              when you use our Service.
                            </li>
                            <li>
                              ii. Our Service lets you store preferences like
                              how your content is displayed, notification
                              settings, and favorites. We may associate these
                              choices with your ID, browser, or mobile device.
                            </li>
                            <li>
                              iii. If you provide us with feedback or contact
                              us, we will collect your name and contact
                              information, as well as any other content included
                              in the message.
                            </li>
                            <li>
                              iv. We may also collect Personal Data at other
                              points in our Service where you voluntarily
                              provide it or where we state that Personal Data is
                              being collected.
                            </li>
                          </ul>
                        </li>
                        <li>
                          b. Information Collected via Technology. As you
                          navigate through and interact with our Service, we may
                          use automatic data collection technologies to collect
                          certain information about your equipment, browsing
                          actions, and patterns, including:
                          <ul className="ml-5">
                            <li>
                              i. Information Collected by Our Servers. To
                              provide our Service and make it more useful to
                              you, we (or a third party service provider)
                              collect information from you, including, but not
                              limited to, your browser type, operating system,
                              Internet Protocol (“IP”) address, mobile device
                              ID, blockchain address, wallet type, and date/time
                              stamps.
                            </li>
                            <li>
                              ii. Log Files. As is true of most websites and
                              applications, we gather certain information
                              automatically and store it in log files. This
                              information includes IP addresses, browser type,
                              Internet service provider (“ISP”), referring/exit
                              pages, operating system, date/time stamps, and
                              clickstream data. We use this information to
                              analyze trends, administer the Service, track
                              users’ movements around the Service, and better
                              tailor our Services to our users’ needs. For
                              example, some of the information may be collected
                              so that when you visit the Service, it will
                              recognize you and the information can be used to
                              personalize your experience.
                            </li>
                            <li>
                              iii. Cookies. Like many online services, we use
                              cookies to collect information. We may use both
                              session Cookies (which expire once you close your
                              web browser) and persistent Cookies (which stay on
                              your computer until you delete them) to analyze
                              how users interact with our Service, make
                              improvements to our product quality, and provide
                              users with a more personalized experience.
                            </li>
                            <li>
                              iv. Pixel Tag. In addition, we use “Pixel Tags”
                              (also referred to as clear Gifs, Web beacons, or
                              Web bugs). Pixel Tags allow us to analyze how
                              users find our Service, make the Service more
                              useful to you, and tailor your experience with us
                              to meet your particular interests and needs.
                            </li>
                            <li>
                              v. How We Respond to Do Not Track Signals. Our
                              systems do not currently recognize “do not track”
                              signals or other mechanisms that might enable
                              Users to opt out of tracking on our site.
                            </li>
                            <li>
                              vi. Analytics Services. In addition to the
                              tracking technologies we place like Cookies and
                              Pixel Tags, other companies may set their own
                              cookies or similar tools when you visit our
                              Service. This includes third-party analytics
                              services (“Analytics Services”) that we engage to
                              help analyze how users use the Service. The
                              information generated by the Cookies or other
                              technologies about your use of our Service (the
                              “Analytics Information”) is transmitted to the
                              Analytics Services. The Analytics Services use
                              Analytics Information to compile reports on user
                              activity, which we may receive on an individual or
                              aggregate basis. We use the information we get
                              from Analytics Services to improve our Service.
                              The Analytics Services may also transfer
                              information to third parties where required to do
                              so by law, or where such third parties process
                              Analytics Information on their behalf. Each
                              Analytics Services’ ability to use and share
                              Analytics Information is restricted by such
                              Analytics Services’ terms of use and privacy
                              policy. By using our Service, you consent to the
                              processing of data about you by Analytics Services
                              in the manner and for the purposes set out above.
                            </li>
                          </ul>
                        </li>
                        <li>
                          c. Information Collected from Third-Party Companies.
                          We may receive Personal and/or Anonymous Data about
                          you from companies that offer their products and/or
                          services for use in conjunction with our Service or
                          whose products and/or services may be linked from our
                          Service. For example, third-party wallet providers
                          provide us with your blockchain address and certain
                          other information you choose to share with those
                          wallets providers. We may add this to the data we have
                          already collected from or about you through our
                          Service.
                        </li>
                        <li>
                          d. Public Information Observed from Blockchains. We
                          collect data from activity that is publicly visible
                          and/or accessible on blockchains. This may include
                          blockchain addresses and information regarding
                          purchases, sales, or transfers of NFTs, which may then
                          be associated with other data you have provided to us.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div ref={personalDataRef} className="pt-5">
                    <h3 className="text-success">Use of Your Personal Data</h3>
                    <div className="ml-5">
                      <ul>
                        <li>
                          a. We process your Personal Data to run our business,
                          provide the Service, personalize your experience on
                          the Service, and improve the Service. Specifically, we
                          use your Personal Data to:
                          <ul className="ml-5">
                            <li>
                              i. facilitate the creation of and secure your
                              account;
                            </li>
                            <li>ii. identify you as a user in our system;</li>
                            <li>
                              iii. provide you with our Service, including, but
                              not limited to, helping you view, explore, and
                              create NFTs using our tools and, at your own
                              discretion, connect directly with others to
                              purchase, sell, or transfer NFTs on public
                              blockchains;
                            </li>
                            <li>
                              iv. improve the administration of our Service and
                              quality of experience when you interact with our
                              Service, including, but not limited to, by
                              analyzing how you and other users find and
                              interact with the Service;
                            </li>
                            <li>
                              v. provide customer support and respond to your
                              requests and inquiries;
                            </li>
                            <li>
                              vi. investigate and address conduct that may
                              violate our Terms of Service;
                            </li>
                            <li>
                              vii. detect, prevent, and address fraud,
                              violations of our terms or policies, and/or other
                              harmful or unlawful activity;
                            </li>
                            <i>
                              viii. display your username next to the NFTs
                              currently or previously accessible in your
                              third-party wallet, and next to NFTs on which you
                              have interacted;
                            </i>
                            <i>
                              ix. send you a welcome email to verify ownership
                              of the email address provided when your account
                              was created;
                            </i>
                            <i>
                              x. send you administrative notifications, such as
                              security, support, and maintenance advisories;
                            </i>
                            <i>
                              xi. send you notifications related to actions on
                              the Service, including notifications of offers on
                              your NFTs;
                            </i>
                            <i>
                              xii. send you newsletters, promotional materials,
                              and other notices related to our Services or third
                              parties' goods and services;
                            </i>
                            <i>
                              xiii. respond to your inquiries related to
                              employment opportunities or other requests;
                            </i>
                            <i>
                              xiv. comply with applicable laws, cooperate with
                              investigations by law enforcement or other
                              authorities of suspected violations of law, and/or
                              to pursue or defend against legal threats and/or
                              claims; and
                            </i>
                            <i>
                              xv. act in any other way we may describe when you
                              provide the Personal Data.
                            </i>
                          </ul>
                        </li>
                        <i>
                          b. We may create Anonymous Data records from Personal
                          Data. We use this Anonymous Data to analyze request
                          and usage patterns so that we may improve our Services
                          and enhance Service navigation. We reserve the right
                          to use Anonymous Data for any purpose and to disclose
                          Anonymous Data to third parties without restriction.
                        </i>
                      </ul>
                    </div>
                  </div>
                  <div ref={disclosureRef} className="pt-5">
                    <h3 className="text-success">
                      Disclosure of Your Personal Data
                    </h3>
                    <p>
                      We disclose your Personal Data as described below and as
                      described elsewhere in this Privacy Policy.
                    </p>
                    <div className="ml-5">
                      <ul>
                        <li>
                          a. Third Party Service Providers. We may share your
                          Personal Data with third party service providers to:
                          provide technical infrastructure services; conduct
                          quality assurance testing; analyze how our Service is
                          used; prevent, detect, and respond to unauthorized
                          activities; provide technical and customer support;
                          and/or to provide other support to us and to the
                          Service.
                        </li>
                        <li>
                          b. Affiliates. We may share some or all of your
                          Personal Data with any subsidiaries, joint ventures,
                          or other companies under our common control
                          (“Affiliates”), in which case we will require our
                          Affiliates to honor this Privacy Policy.
                        </li>
                        <li>
                          c. Corporate Restructuring. We may share some or all
                          of your Personal Data in connection with or during
                          negotiation of any merger, financing, acquisition, or
                          dissolution transaction or proceeding involving sale,
                          transfer, divestiture, or disclosure of all or a
                          portion of our business or assets. In the event of an
                          insolvency, bankruptcy, or receivership, Personal Data
                          may also be transferred as a business asset. If
                          another company acquires our company, business, or
                          assets, that company will possess the Personal Data
                          collected by us and will assume the rights and
                          obligations regarding your Personal Data as described
                          in this Privacy Policy.
                        </li>
                        <li>
                          d. Legal Rights. Regardless of any choices you make
                          regarding your Personal Data (as described below),
                          Verified Impact NFT may disclose Personal Data if it
                          believes in good faith that such disclosure is
                          necessary: (a) in connection with any legal
                          investigation; (b) to comply with relevant laws or to
                          respond to subpoenas, warrants, or other legal process
                          served on Verified Impact NFT; (c) to protect or
                          defend the rights or property of Verified Impact NFT
                          or users of the Service; and/or (d) to investigate or
                          assist in preventing any violation or potential
                          violation of the law, this Privacy Policy, or our
                          Terms of Service.
                        </li>
                        <li>
                          e. Other Disclosures. We may also disclose your
                          Personal Data: to fulfill the purpose for which you
                          provide it; for any other purpose disclosed by us when
                          you provide it; or with your consent.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div ref={thirdPartyWebSiteRef} className="pt-5">
                    <h3 className="text-success">Third-Party Websites</h3>
                    <p>
                      Our Service may contain links to third-party websites.
                      When you click on a link to any other website or location,
                      you will leave our Service and go to another site, and
                      another entity may collect Personal Data from you. We have
                      no control over, do not review, and cannot be responsible
                      for these third-party websites or their content. Please be
                      aware that the terms of this Privacy Policy do not apply
                      to these third-party websites or their content, or to any
                      collection of your Personal Data after you click on links
                      to such third-party websites. We encourage you to read the
                      privacy policies of every website you visit. Any links to
                      third-party websites or locations are for your convenience
                      and do not signify our endorsement of such third parties
                      or their products, content, or websites.
                    </p>
                  </div>
                  <div ref={thirdPartyWalletRef} className="pt-5">
                    <h3 className="text-success">Third-Party Wallets</h3>
                    <p>
                      To use our Service, you must use a third-party wallet
                      which allows you to engage in transactions on public
                      blockchains. Your interactions with any third-party wallet
                      provider are governed by the applicable terms of service
                      and privacy policy of that third party.
                    </p>
                  </div>
                  <div ref={choicesRef} className="pt-5">
                    <h3 className="text-success">
                      Your Choices Regarding Information
                    </h3>
                    <p>
                      You have several choices regarding the use of information
                      on our Services:{' '}
                    </p>
                    <div className="ml-5">
                      <ul>
                        <li>
                          a. Email Communications. We may periodically send you
                          newsletters and/or emails that directly promote the
                          use of our Service or third parties’ goods and
                          services. When you receive newsletters or promotional
                          communications from us, you may indicate a preference
                          to stop receiving these communications from us by
                          following the unsubscribe instructions provided in the
                          email you receive or through the Notifications
                          preferences in your Settings page. Despite these
                          preferences, we may send you occasional transactional
                          service-related informational communications.
                        </li>
                        <li>
                          b. If you decide at any time that you no longer wish
                          to accept Cookies from our Service for any of the
                          purposes described above, then you can instruct your
                          browser, by changing its settings, to stop accepting
                          Cookies or to prompt you before accepting a Cookie
                          from the websites you visit. Consult your browser’s
                          technical information. If you do not accept Cookies,
                          however, you may not be able to use all portions of
                          the Service or all functionality of the Service
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div ref={dataAccessRef} className="pt-5">
                    <h3 className="text-success">Data Access and Control</h3>
                    <p>
                      You can view, access, edit, or delete your Personal Data
                      for certain aspects of the Service via your Settings page.
                      You may also have certain additional rights:
                    </p>
                    <div className="ml-5">
                      <ul>
                        <li>
                          a. If you are a user in the European Economic Area or
                          United Kingdom, you have certain rights under the
                          respective European and UK General Data Protection
                          Regulations (“GDPR”). These include the right to (i)
                          request access and obtain a copy of your personal
                          data; (ii) request rectification or erasure; (iii)
                          object to or restrict the processing of your personal
                          data; and (iv) request portability of your personal
                          data. Additionally, if we have collected and processed
                          your personal data with your consent, you have the
                          right to withdraw your consent at any time.
                        </li>
                      </ul>
                    </div>
                    <li>
                      b. If you are a California resident, you have certain
                      rights under the California Consumer Privacy Act (“CCPA”).
                      These include the right to (i) request access to, details
                      regarding, and a copy of the personal information we have
                      collected about you and/or shared with third parties; (ii)
                      request deletion of the personal information that we have
                      collected about you; and (iii) the right to opt-out of
                      sale of your personal information. As the terms are
                      defined under the CCPA, we do not “sell” your “personal
                      information.”
                    </li>
                    <li>
                      c. If you wish to exercise your rights under the GDPR,
                      CCPA, or other applicable data protection or privacy laws,
                      please contact us by using the{' '}
                      <Link to={'/request-form'} className="btn-link text-success  cursor-pointer">
                        “Submit a request” link here
                      </Link>{' '}
                      or at the address provided in Section 13 below, specify
                      your request, and reference the applicable law. We may ask
                      you to verify your identity, or ask for more information
                      about your request. We will consider and act upon any
                      above request in accordance with applicable law. We will
                      not discriminate against you for exercising any of these
                      rights.
                    </li>
                    <li>
                      d. Notwithstanding the above, we cannot edit or delete any
                      information that is stored on a blockchain, for example
                      the Casper blockchain, as we do not have custody or
                      control over any blockchains. The information stored on
                      the blockchain may include purchases, sales, and transfers
                      related to your blockchain address and NFTs held at that
                      address.
                    </li>
                  </div>
                  <div ref={retentionRef} className="pt-5">
                    <h3 className="text-success">Data Retention</h3>
                    <p>
                      We may retain your Personal Data as long as you continue
                      to use the Service, have an account with us, or for as
                      long as is necessary to fulfill the purposes outlined in
                      this Privacy Policy. We may continue to retain your
                      Personal Data even after you deactivate your account
                      and/or cease to use the Service if such retention is
                      reasonably necessary to comply with our legal obligations,
                      to resolve disputes, prevent fraud and abuse, enforce our
                      Terms or other agreements, and/or protect our legitimate
                      interests. Where your Personal Data is no longer required
                      for these purposes, we will delete it.
                    </p>
                  </div>
                  <div ref={protectionRef} className="pt-5">
                    <h3 className="text-success">Data Protection</h3>
                    <p>
                      We care about the security of your information and use
                      physical, administrative, and technological safeguards to
                      preserve the integrity and security of information
                      collected through our Service. However, no security system
                      is impenetrable and we cannot guarantee the security of
                      our systems. In the event that any information under our
                      custody and control is compromised as a result of a breach
                      of security, we will take steps to investigate and
                      remediate the situation and, in accordance with applicable
                      laws and regulations, notify those individuals whose
                      information may have been compromised.
                    </p>
                    <ul className="ml-5">
                      <li>
                        a. You are responsible for the security of your digital
                        wallet, and we urge you to take steps to ensure it is
                        and remains secure. If you discover an issue related to
                        your wallet, please contact your wallet provider.
                      </li>
                    </ul>
                  </div>
                  <div ref={minorsRef} className="pt-5">
                    <h3 className="text-success">Minors</h3>
                    <p>
                      We do not intentionally gather Personal Data from visitors
                      who are under the age of 13. Our Terms of Service require
                      all users to be at least 18 years old. Minors who are at
                      least 13 years old but are under 18 years old may use a
                      parent or guardian’s Verified Impact NFT account, but only
                      with the involvement of the account holder. If a child
                      under 13 submits Personal Data to Verified Impact NFT and
                      we learn that the Personal Data is the information of a
                      child under 13, we will attempt to delete the information
                      as soon as possible. If you believe that we might have any
                      Personal Data from a child under 13, please contact us by
                      using the{' '}
                      <Link to={'/request-form'} className="btn-link text-success  cursor-pointer">
                        “Submit a request” link here
                      </Link>{' '}
                      or at the address indicated in Section 13 below.
                    </p>
                  </div>
                  <div ref={outsideUSARef} className="pt-5">
                    <h3 className="text-success">
                      Users Outside of the United States
                    </h3>
                    <p>
                      If you are a non-U.S. user of the Service, by visiting the
                      Service and providing us with data, you acknowledge and
                      agree that your Personal Data may be processed for the
                      purposes identified in the Privacy Policy. In addition,
                      your Personal Data may be processed in the country in
                      which it was collected and in other countries, including
                      the United States, where laws regarding processing of
                      Personal Data may be less stringent than the laws in your
                      country. By providing your Personal Data, you consent to
                      such transfer.
                    </p>
                  </div>
                  <div ref={privacyRef} className="pt-5">
                    <h3 className="text-success">
                      Changes to This Privacy Policy
                    </h3>
                    <p>
                      This Privacy Policy may be updated from time to time for
                      any reason. We will notify you of any changes to our
                      Privacy Policy by posting the new Privacy Policy at
                      <Link to={'/privacy'}>Verified Impact NFTs WebSite</Link>.
                      The date the Privacy Policy was last revised is identified
                      at the beginning of this Privacy Policy. You are
                      responsible for periodically visiting our Service and this
                      Privacy Policy to check for any changes.
                    </p>
                  </div>
                  <div ref={minorsRef} className="pt-5">
                    <h3 className="text-success">Questions</h3>
                    <p>
                      Contacting Verified Impact NFT; Reporting Violations. If
                      you have any questions or concerns or complaints about our
                      Privacy Policy or our data collection or processing
                      practices, or if you want to report any security
                      violations to us, please contact us by using the{' '}
                      <Link to={'/request-form'} className="btn-link text-success cursor-pointer">
                        “Submit a request” link here
                      </Link>{' '}
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

export default Privacy;
