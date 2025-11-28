import React from "react";
import Layout from "../../Layout/Layout";
import Styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
    return (
        <Layout>
            <div className={Styles.privacyContainer}>
                <h1>Privacy Policy</h1>
                <p>Effective April 1, 2025</p>
                <div className={Styles.sectionContainer}>
                    <h2>Introduction</h2>
                    <p>
                        Welcome to <strong>Abe Garage</strong>. We value your privacy and
                        are committed to protecting your personal information. This Privacy
                        Policy explains how we collect, use, and protect your information when
                        you use our site at{" "}
                        <a href="https://abe-garage.henokyohanes.com/" target="_blank">
                            https://abe-garage.henokyohanes.com
                        </a>
                        .
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Information We Collect</h2>
                    <ul>
                        <li>
                            <strong>Account Information:</strong> Name, email, username, and
                            password when you create an account.
                        </li>
                        <li>
                            <strong>Content:</strong> The content you enter, such as vehicle
                            details, service requests, and comments.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> IP address, browser type, pages
                            visited, and interaction times.
                        </li>
                        <li>
                            <strong>Cookies:</strong> We use cookies to enhance your experience
                            and track usage.
                        </li>
                    </ul>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>How We Use Your Information</h2>
                    <ul>
                        <li>To provide and improve the site services</li>
                        <li>To personalize your experience</li>
                        <li>To communicate with you about your account or support requests</li>
                        <li>To monitor and analyze usage patterns</li>
                    </ul>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Sharing Your Information</h2>
                    <p>
                        We do not sell your personal information. We may share it with third
                        parties only when necessary to:
                    </p>
                    <ul>
                        <li>Comply with legal obligations</li>
                        <li>Enforce our Terms of Service</li>
                        <li>Protect the rights, property, or safety of the site or others</li>
                    </ul>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Cookies and Tracking Technologies</h2>
                    <p>
                        We use cookies and similar technologies to improve site functionality
                        and user experience. You can control cookies through your browser
                        settings.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Data Security</h2>
                    <p>
                        We implement reasonable security measures to protect your information,
                        but no system is 100% secure. Please protect your login credentials
                        and notify us of any unauthorized use.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Your Choices</h2>
                    <ul>
                        <li>You may access or update your profile at any time</li>
                        <li>You may request deletion of your account by contacting us</li>
                        <li>You may opt out of marketing emails via unsubscribe links</li>
                    </ul>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Children’s Privacy</h2>
                    <p>
                        Our Site is not intended for children under 16. We do not knowingly
                        collect personal information from children under 16. If we become
                        aware of such data, we will delete it immediately.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy periodically. Changes will be posted
                        on this page with the updated date. Continued use of the Site after
                        updates means you accept the new policy.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Contact Us</h2>
                    <p>If you have questions or concerns about this policy, contact us at:</p>
                    <ul className={Styles.contactList}>
                        <li>
                            📧 {" "}
                            <a href="mailto: henokyohanes8@gmail.com" target="_blank">
                                henokyohanes8@gmail.com
                            </a>
                        </li>
                        <li>
                            🌐{" "}
                            <a href="https://abe-garage.henokyohanes.com" target="_blank">
                                https://abe-garage.henokyohanes.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicy;