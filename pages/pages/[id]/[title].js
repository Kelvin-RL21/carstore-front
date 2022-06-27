import Head from 'next/head'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import Layout from '../../../components/layout'
import BlogPostFeatured from '../../../components/blogPostFeatured'
import SearchBar from '../../../components/storage/searchBar'
import Ebook from '../../../components/ebook'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const API_RESOURCE_NAME = '/static-pages'

const Resource = ({ page, posts }) => {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>{page?.title || 'The Car Store Club'}</title>
                <meta name="title" content={page?.title || 'The Car Store Club'} />
                <meta
                    name="description"
                    content={page?.seoDescription || 'The Car Store Club'}
                />
                <meta
                    name="keywords"
                    content={page?.seoKeywords || 'The Car Store Club'}
                />
                <meta
                    property="og:title"
                    content={page?.title || 'The Car Store Club'}
                />
                <meta
                    property="og:description"
                    content={page?.seoDescription || 'The Car Store Club'}
                />
            </Head>
            <section>
                {page?.page_features?.find(feature => feature.id === 3) && (
                    <section
                        className="section section-header section-image bg-primary overlay-primary text-white mb-9"
                        style={{
                            backgroundImage: `url(${page?.mainImage?.url})`,
                        }}
                        id="section-header-position"
                    >
                        <SearchBar />
                    </section>
                )}

                {!page?.page_features?.find(feature => feature.id === 3) && (<section
                    className="section section-header section-image bg-primary overlay-primary text-white pt-8 pb-2 pb-md-2"
                    style={{
                        backgroundImage: `url(${page?.mainImage?.url || '/assets/img/home/banner-home-page.png'})`
                    }}
                    id="section-header-position"
                >
                    <div className="container">
                        <div className="row justify-content-center mt-6 mb-6">
                            <div className="col-12 col-xl-8 text-center">
                                <h1>{page?.title}</h1>
                            </div>
                        </div>
                    </div>
                </section>)}

                <section className="section section-lg mb-0 pb-0">
                    <div className="container">
                        <div className="row mb-6 justify-content-center">
                            <div className="col-12 col-md-8">
                                <ReactMarkdown children={page.content} />
                            </div>
                        </div>
                    </div>
                </section>

                {page?.page_features?.find(feature => feature.id === 1) && (
                    <Ebook router={router} feature={page?.page_features?.find(feature => feature.id === 1)} />
                )}

                {page?.page_features?.find(feature => feature.id === 2) && (
                    <section className="section section-lg pb-0 mb-0 pt-0 mt-0">
                        <div className="container">
                            <div className="row mb-6">
                                <BlogPostFeatured posts={posts} />
                            </div>
                        </div>
                    </section>
                )}
            </section>
        </>
    )
}

export async function getServerSideProps({ params }) {
    const page = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}${API_RESOURCE_NAME}/${params.id}`
        )
    ).json()

    const posts =
        !page?.page_features?.find(feature => feature.id === 2)
            ? null
            : await (
                await fetch(
                    `${serverRuntimeConfig.apiUrl}/blog-posts?_sort=created_at:DESC&_limit=3`
                )
            ).json()

    return {
        props: {
            page,
            posts,
        },
    }
}

Resource.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export default Resource
