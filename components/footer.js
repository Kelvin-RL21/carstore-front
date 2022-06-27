export default function Footer({ children }) {
    return (
        <footer className="footer bg-primary text-white pt-2 pb-2">
            <div className="container">
                <div className="row mt-4">
                    <div className="col-xl-6 mb-3 mb-xl-0 text-center">
                        <img
                            src="/assets/img/brand/logo.png"
                            className="mb-3"
                            alt="The Car Store logo"
                            width="230"
                        />
                        <div className="pt-lg-2 text-light">
                        <small>VAT Number: 389 2437 53</small><br/>
                        <small>Company Number: 01482233</small>
                        </div>
                    </div>
                    <div className="col-5 col-xl-2 mb-5 mb-xl-0">
                        <ul className="footer-links mt-2">
                            <li>
                                <a href="/pages/6/faq">FAQ's</a>
                            </li>
                            <li>
                                <a href="/pages/7/terms-and-conditions">Terms and Conditions</a>
                            </li>
                            <li>
                                <a href="/pages/10/privacy-policy">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-7 col-xl-4 mb-5 mb-xl-0">
                        <ul className="footer-links mt-2">
                            <li>
                                <a href="/blog">Blog</a>
                            </li>
                            <li>
                                <a href="/pages/5/press">Press</a>
                            </li>
                            <li>
                                <a href="/pages/3/what-is-the-car-store-club">About Us</a>
                            </li>
                            <li>
                                <a href="/contact">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col mb-md-0">
                        <div
                            className="d-flex text-center justify-content-center align-items-center"
                            role="contentinfo"
                        >
                            <div className="font-weight-normal font-small mb-0">
                                <p>
                                    <i className="fas fa-envelope mr-1"></i>{' '}
                                    <a href="mailto:help@carstoreclub.com">
                                        help@carstoreclub.com
                                    </a>
                                </p>
                                Copyright © The Car Store Club - All rights
                                reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
