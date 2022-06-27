import Head from 'next/head'
import Script from 'next/script'
import Footer from './footer'
import CookieConsent from "react-cookie-consent";

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <title>The Car Store Club</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta name="title" content="The Car Store Club" />
                <meta name="description" content="We're the UK's first and only online search engine for managed car storage." />
                <meta name="keywords" content="car, storage, price, guide, local, uk, costs" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="The Car Store Club" />
                <meta property="og:description" content="We're the UK's first and only online search engine for managed car storage." />

                <link
                    type="text/css"
                    href="/vendor/@fortawesome/fontawesome-free/css/all.min.css"
                    rel="stylesheet"
                />
                <link
                    type="text/css"
                    href="/vendor/leaflet/dist/leaflet.css"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="/vendor/@fancyapps/fancybox/dist/jquery.fancybox.min.css"
                />
                <link
                    rel="stylesheet"
                    href="/vendor/jqvmap/dist/jqvmap.min.css"
                />
                <link type="text/css" href="/spaces.css" rel="stylesheet" />
            </Head>
            <CookieConsent overlay>
                This website uses cookies to enhance the user experience.
            </CookieConsent>
            <header className="header-global">
                <nav
                    id="navbar-main"
                    className="navbar navbar-main navbar-theme-primary navbar-expand-lg navbar-dark bg-dark navbar-transparent"
                >
                    <div className="container">
                        <a
                            className="navbar-brand @@logo_classes logo-browser d-none d-lg-block"
                            href="/"
                        >
                            <img
                                className="navbar-brand-dark common img-fluid"
                                src="/assets/img/brand/logo.png"
                                alt="Logo light"
                            />
                        </a>
                        <div
                            className="navbar-collapse collapse"
                            id="navbar_global"
                        >
                            <ul className="navbar-nav navbar-nav-hover justify-content-center">
                                <li className="nav-item">
                                    <a
                                        href="/"
                                        id="mainPagesDropdown"
                                        className="nav-link dropdown-toggle"
                                    >
                                        <span className="nav-link-inner-text mr-1">
                                            Home
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="/blog" className="nav-link">
                                        <span className="nav-link-inner-text mr-1">
                                            Blog
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a
                                        id="supportDropdown"
                                        className="nav-link dropdown-toggle"
                                        aria-expanded="false"
                                        data-toggle="dropdown"
                                    >
                                        <span className="nav-link-inner-text mr-1">
                                            About Us
                                        </span>
                                        {/* <i className="fas fa-angle-down nav-link-arrow"></i> */}
                                    </a>
                                    <div
                                        className="dropdown-menu"
                                        aria-labelledby="supportDropdown"
                                    >
                                        <div className="col-auto px-0">
                                            <div className="list-group list-group-flush">
                                                <a
                                                    href="/pages/3/what-is-the-car-store-club"
                                                    className="list-group-item list-group-item-action d-flex align-items-center p-0 py-3 px-lg-4"
                                                    rel="noreferrer"
                                                >
                                                    <div className="ml-4">
                                                        <span className="text-dark d-block">
                                                            The Car Store Club
                                                        </span>
                                                    </div>
                                                </a>
                                                <a
                                                    href="/pages/6/faq"
                                                    className="list-group-item list-group-item-action d-flex align-items-center p-0 py-3 px-lg-4"
                                                    rel="noreferrer"
                                                >
                                                    <div className="ml-4">
                                                        <span className="text-dark d-block">
                                                            FAQs
                                                        </span>
                                                    </div>
                                                </a>
                                                <a
                                                    href="/pages/5/press"
                                                    className="list-group-item list-group-item-action d-flex align-items-center p-0 py-3 px-lg-4"
                                                    rel="noreferrer"
                                                >
                                                    <div className="ml-4">
                                                        <span className="text-dark d-block">
                                                            Press
                                                        </span>
                                                    </div>
                                                </a>
                                                <a
                                                    href="/contact"
                                                    className="list-group-item list-group-item-action d-flex align-items-center p-0 py-3 px-lg-4"
                                                    rel="noreferrer"
                                                >
                                                    <div className="ml-4">
                                                        <span className="text-dark d-block">
                                                            Contact
                                                        </span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-item d-block d-lg-none">
                                    <a href="/admin/leads" className="nav-link">
                                        <span className="nav-link-inner-text mr-1">
                                            Login / Register
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="d-none d-lg-block @@cta_button_classes">
                            <a
                                href="/admin/leads"
                                className="mr-3 text-white nav-link btn btn-outline-white"
                            >
                                <span className="d-none d-xl-inline">
                                    Login / Register
                                </span>
                            </a>
                        </div>
                        <div className="d-none d-lg-block @@cta_button_classes">
                            <a
                                href="https://www.instagram.com/thecarstoreclub"
                                className="mr-3"
                                target="_blank"
                            >
                                <span className="d-none d-xl-inline">
                                    <span className="fab fa-instagram text-white"></span>
                                </span>
                            </a>
                        </div>
                        <div className="d-none d-lg-block @@cta_button_classes">
                            <a
                                href="https://twitter.com/carstoreclub"
                                className="mr-3"
                                target="_blank"
                            >
                                <span className="d-none d-xl-inline">
                                    <span className="fab fa-twitter text-white"></span>
                                </span>
                            </a>
                        </div>
                        <div className="d-flex d-lg-none align-items-center">
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbar_global"
                                aria-controls="navbar_global"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>
                        <div className="d-flex d-lg-none align-items-right">
                            <a
                                className="navbar-brand @@logo_classes"
                                href="/"
                            >
                                <img
                                    className="navbar-brand-dark common img-fluid"
                                    src="/assets/img/brand/logo.png"
                                    alt="Logo light"
                                    style={ {height: '40px'} }
                                />
                            </a>
                        </div>
                    </div>
                </nav>
            </header>

            <main style={{ minHeight: '100%' }}>{children}</main>

            <Footer />

            <Script
                src="/vendor/jquery/dist/jquery.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/popper.js/dist/umd/popper.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/bootstrap/dist/js/bootstrap.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/headroom.js/dist/headroom.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/onscreen/dist/on-screen.umd.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/nouislider/distribute/nouislider.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/waypoints/lib/jquery.waypoints.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/owl.carousel/dist/owl.carousel.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/@fancyapps/fancybox/dist/jquery.fancybox.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/sticky-sidebar/dist/sticky-sidebar.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/leaflet/dist/leaflet.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/chartist/dist/chartist.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/chartist-plugin-tooltips/dist/chartist-plugin-tooltip.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/jqvmap/dist/jquery.vmap.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/vendor/jqvmap/dist/maps/jquery.vmap.usa.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/assets/js/jquery.slideform.js"
                strategy="beforeInteractive"
            />
            <Script src="/assets/js/spaces.js" strategy="beforeInteractive" />

            <Script
                strategy='lazyOnload'
                src={`https://www.googletagmanager.com/gtag/js?id=G-MRKXFC0J14`}
            />
            <Script id='ga-analytics'>
                {
                    `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-MRKXFC0J14');
                `
                }
            </Script>

            <Script
                strategy='lazyOnload'
                src={`https://www.googletagmanager.com/gtag/js?id=UA-213374797-1`}
            />
            <Script id='ua-analytics'>
                {
                    `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'UA-213374797-1');
                `
                }
            </Script>

            <Script 
                strategy='lazyOnload' 
                src={`https://www.googletagmanager.com/gtag/js?id=AW-10828018147`}
            />
            <Script id='ga-adwords'>
            {
                    `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'AW-10828018147');
                    `
            }
            </Script>

            <Script
                strategy='lazyOnload' 
                id='hotjar-search-storage'>
                    {
                        `(function(h,o,t,j,a,r){
                            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                            h._hjSettings={hjid:2766202,hjsv:6};
                            a=o.getElementsByTagName('head')[0];
                            r=o.createElement('script');r.async=1;
                            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                            a.appendChild(r);
                        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
                    }
            </Script>
        </>
    )
}
