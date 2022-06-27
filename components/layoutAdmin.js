import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import Footer from './footer'

const ADMIN_URL = '/admin'
const PROFILE_URL = `${ADMIN_URL}/profile`
const LEADS_URL = `${ADMIN_URL}/leads`

export default function LayoutAdmin({ children, user }) {
    const router = useRouter()

    const handleLogout = (e) => {
        e.preventDefault()

        fetch(`/api/logout`, {
            method: 'POST',
            body: JSON.stringify({
                jwt: user.jwt,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((json) => {
                router.push(`/`)
            })
            .catch((error) => {
                console.log('Error:', error.message)
            })
    }

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
                <meta name="description" content="Soon..." />
                <meta name="keywords" content="soon." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="The Car Store Club" />
                <meta property="og:description" content="Soon" />

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

            <header className="header-global">
                <nav
                    id="navbar-main"
                    className="navbar navbar-main navbar-expand-lg py-lg-3 px-lg-6 navbar-light navbar-theme-primary"
                    style={ {background: 'none'} }
                >
                    <div className="container" style={ {justifyContent: 'normal'} }>
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
                        <div className="d-flex d-lg-none align-items-right pl-10">
                            <a href="/" >
                                <img
                                    className="img-fluid"
                                    src="/assets/img/brand/logo.png"
                                    alt="Logo light"
                                    style={ {height: '40px'} }
                                />
                            </a>
                        </div>
                        
                        <ul className="navbar-nav navbar-nav-hover justify-content-center pt-lg-5 ml-lg-11 pt-4 d-none d-lg-block">
                            <h4>Welcome to your sales hub</h4>
                        </ul>

                        <a className="navbar-brand @@logo_classes logo-browser d-none d-lg-block" href="/">
                            <img
                                className="navbar-brand-light common"
                                src="/assets/img/brand/logo.png"
                                alt="Logo light"
                            />
                        </a>
                        <div
                            className="navbar-collapse collapse"
                            id="navbar_global"
                        >
                            <li className="nav-item d-block d-lg-none">
                                <a href={LEADS_URL} className="nav-link">
                                    <span className="nav-link-inner-text mr-1">
                                        Leads
                                    </span>
                                </a>
                            </li>
                            <li className="nav-item d-block d-lg-none">
                                <a href={PROFILE_URL} className="nav-link">
                                    <span className="nav-link-inner-text mr-1">
                                    Profile
                                    </span>
                                </a>
                            </li>
                            <li className="nav-item d-block d-lg-none">
                                <a href="" className="nav-link" onClick={handleLogout}>
                                    <span className="nav-link-inner-text mr-1">
                                    Logout
                                    </span>
                                </a>
                            </li>
                        </div>
                        <div className="d-none d-lg-block @@cta_button_classes">
                            <a
                                href={LEADS_URL}
                                className="btn btn-sm btn-primary animate-up-2 mr-3"
                            >
                                <span className="d-none d-xl-inline">
                                    Leads
                                </span>
                            </a>
                            <a
                                href={PROFILE_URL}
                                className="btn btn-sm btn-primary animate-up-2 mr-3"
                            >
                                <span className="d-none d-xl-inline">
                                    Profile
                                </span>
                            </a>
                            <a
                                href=""
                                className="btn btn-sm btn-primary animate-up-2 mr-3"
                                onClick={handleLogout}
                            >
                                <span className="d-none d-xl-inline">
                                    Logout
                                </span>
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
        </>
    )
}
