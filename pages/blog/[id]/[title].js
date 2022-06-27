import Head from 'next/head'
import getConfig from 'next/config'
import Layout from '../../../components/layout'
import ReactMarkdown from 'react-markdown'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const API_RESOURCE_NAME = '/blog-posts'
const RESOURCE_URL = '/blog'

const Resource = ({ post }) => {
    return (
        <>
            <Head>
                <title>{post?.title || 'The Car Store Club'}</title>
                <meta name="title" content={post?.title || 'The Car Store Club'} />
                <meta
                    name="description"
                    content={post?.seoDescription || 'The Car Store Club'}
                />
                <meta
                    name="keywords"
                    content={post?.seoKeywords || 'The Car Store Club'}
                />
                <meta
                    property="og:title"
                    content={post?.title || 'The Car Store Club'}
                />
                <meta
                    property="og:description"
                    content={post?.seoDescription || 'The Car Store Club'}
                />
            </Head>

            <section>
                <section
                    className="section section-header section-header-image section-image bg-primary overlay-primary text-white pt-8 pb-2 pb-md-2"
                    style={{
                        backgroundImage: `url(${post?.mainImage?.url})`,
                    }}
                >
                    <div className="container">
                        <div className="row justify-content-center mt-6 mb-6">
                            <div className="col-12 col-xl-8 text-center">
                                <h1>{post.title}</h1>
                                {post.blog_categories?.map(
                                    (category, index) => (
                                        <small
                                            key={index}
                                            className="ml-2 mt-6 badge badge-primary"
                                        >
                                            <span className="fas fa-tag"></span>{' '}
                                            {category.title}
                                        </small>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section section-lg">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8">
                                <ReactMarkdown children={post.content} />
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}

export async function getServerSideProps({ params }) {
    const post = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}${API_RESOURCE_NAME}/${params.id}`
        )
    ).json()

    return {
        props: {
            post,
        },
    }
}

Resource.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export default Resource
