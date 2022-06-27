import Head from 'next/head'
import Layout from '../components/layout'
import SearchBar from '../components/storage/searchBar'
import BlogPostFeatured from '../components/blogPostFeatured'
import { convert } from 'url-slug'
import getConfig from 'next/config'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

const Home = ({ homepage, posts, top100, howItWorks, guideToUk }) => {
    return (
        <section>
            <Head>
                <title>{homepage?.title || 'The Car Store Club'}</title>
                <meta
                    name="title"
                    content={homepage?.title || 'The Car Store Club'}
                />
                <meta
                    name="description"
                    content={
                        homepage?.description?.slice(0, 50) || 'The Car Store Club'
                    }
                />
                <meta
                    name="keywords"
                    content={homepage?.seoKeywords || 'The Car Store Club'}
                />
                <meta
                    property="og:title"
                    content={homepage?.title || 'The Car Store Club'}
                />
                <meta
                    property="og:description"
                    content={
                        homepage?.description?.slice(0, 50) || 'The Car Store Club'
                    }
                />
            </Head>
            <section
                className="section section-header section-image bg-white text-white mb-9"
                id="section-header-position"
                style={{
                    backgroundImage: `url('${
                        homepage?.mainImage?.formats?.large?.url ||
                        '/assets/img/home/banner-home-page.png'
                    }')`,
                }}
            >
                <SearchBar />
                
                
            </section>

            <section className="section section-lg pt-0 pb-4 pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div
                                className="tab-content mt-lg-2"
                                id="tabcontentexample-3"
                            >
                                <div
                                    className="tab-pane fade show active"
                                    id="find-space"
                                    role="tabpanel"
                                    aria-labelledby="tab-find-space"
                                >
                                    <div className="row">
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <div className="card border-light mb-4 mb-lg-0 text-center card-min-height bg-white text-white animate-up-3">
                                                <div className="card-body p-4 px-xl-4 py-xl-4">
                                                    <div className="icon icon-shape icon-lg icon-shape-primary mb-4 mt-2 rounded-circle">
                                                        <span className="fas fa-paper-plane text-orange"></span>
                                                    </div>
                                                    <h4 className="text-primary">
                                                        Give us the details of
                                                        your car storage needs.
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <div className="card border-light mb-4 mb-lg-0 text-center card-min-height bg-white text-white animate-up-3">
                                                <div className="card-body p-4 px-xl-4 py-xl-4">
                                                    <div className="icon icon-shape icon-lg icon-shape-primary mb-4 mt-2 rounded-circle">
                                                        <span className="fas fa-tasks text-orange"></span>
                                                    </div>
                                                    <h4 className="text-primary">
                                                        We’ll match your needs
                                                        to a selection of
                                                        trusted car storage
                                                        facilities.
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <div className="card border-light mb-4 mb-lg-0 text-center card-min-height bg-white text-white animate-up-3">
                                                <div className="card-body p-4 px-xl-4 py-xl-4">
                                                    <div className="icon icon-shape icon-lg icon-shape-primary mb-4 mt-2 rounded-circle">
                                                        <span className="fas fa-hourglass-half text-orange"></span>
                                                    </div>
                                                    <h4 className="text-primary">
                                                        Sit back as your chosen
                                                        suppliers get in
                                                        touch...
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-lg bg-gray-home pt-6 pb-4 mt-0 mb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-md-4 text-center mb-4 mb-md-0 px-lg-4">
                            <a href={`/pages/1/${convert(top100?.title)}`}>
                                <img
                                    className="img-fluid image-lg mb-4 rounded"
                                    src={
                                        top100?.mainImage?.formats?.small
                                            ?.url ||
                                        '/assets/img/home/banner-home-featured-1.jpg'
                                    }
                                    alt={top100?.title}
                                    width="332"
                                />
                                <h6>{top100?.title}</h6>
                            </a>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 text-center mb-4 mb-md-0 px-lg-4">
                            <a href={`/pages/3/${convert(howItWorks?.title)}`}>
                                <img
                                    className="img-fluid image-lg mb-4 rounded"
                                    src={
                                        howItWorks?.mainImage?.formats?.small
                                            ?.url ||
                                        '/assets/img/home/banner-home-featured-2.jpg'
                                    }
                                    alt={howItWorks?.title}
                                    width="332"
                                />
                                <h6>{howItWorks?.title}</h6>
                            </a>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 text-center mb-4 mb-md-0 px-lg-4">
                            <a href={`/pages/2/${convert(guideToUk?.title)}`}>
                                <img
                                    className="img-fluid image-lg mb-4 rounded"
                                    src={
                                        guideToUk?.mainImage?.formats?.small
                                            ?.url ||
                                        '/assets/img/home/banner-home-featured-2.jpg'
                                    }
                                    alt={guideToUk?.title}
                                    width="332"
                                />
                                <h6>{guideToUk?.title}</h6>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-lg pt-2 mt-0 pb-2">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <BlogPostFeatured posts={posts} />
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}

Home.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
    const posts = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}/blog-posts?_sort=created_at:DESC&_limit=3`
        )
    ).json()

    const homepage = await (
        await fetch(`${serverRuntimeConfig.apiUrl}/static-pages/9`)
    ).json()

    const top100 = await (
        await fetch(`${serverRuntimeConfig.apiUrl}/static-pages/1`)
    ).json()

    const howItWorks = await (
        await fetch(`${serverRuntimeConfig.apiUrl}/static-pages/3`)
    ).json()

    const guideToUk = await (
        await fetch(`${serverRuntimeConfig.apiUrl}/static-pages/2`)
    ).json()

    return {
        props: {
            posts,
            homepage,
            top100,
            howItWorks,
            guideToUk,
        },
    }
}

export default Home
