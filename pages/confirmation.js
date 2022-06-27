import Layout from '../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import getConfig from 'next/config'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default function Confirmation({ feature }) {
    const router = useRouter()
    const initialState = {
        loading: false,
        message: '',
    }

    const [query, setQuery] = useState(initialState)

    return (
        <section>
            <Head>
                <title>Confirmation Page</title>
                <meta name="title" content="Confirmation Page" />
            </Head>
            <section
                className="section section-header section-image bg-primary overlay-primary text-white pt-8 pb-2 pb-md-2"
                data-background="/assets/img/home/banner-contact.jpg"
            >
                <div className="container">
                    <div className="row justify-content-center mt-6 mb-6">
                        <div className="col-12 col-xl-8 text-center">
                            <h1 className="display-2"></h1>
                            <p className="lead"></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-lg pt-4 pb-0">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">
                            <div className="card border-0 p-2 p-md-3">
                                <div className="card-body px-0">
                                    <div className="row justify-content-center">
                                        <div className="col-12">
                                            <div className="card border-0 p-0 p-md-5">
                                                <div className="card-body p-0 text-center">
                                                    <p>
                                                        {router.query.message}
                                                    </p>

                                                    {feature && feature?.media?.url && (<p className="mt-2">
                                                        <a
                                                            href={feature?.media?.url}
                                                            className="btn btn-sm btn-outline-primary"
                                                            target="_blank"
                                                        >
                                                            Download File
                                                        </a>
                                                    </p>)}

                                                    <p className="mt-6">
                                                        <a
                                                            href="/"
                                                        >
                                                            Click here to return
                                                            to the home page
                                                        </a>
                                                    </p>
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
        </section>
    )
}

Confirmation.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export async function getServerSideProps({ query }) {
    const feature = !query.feature ? null : await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}/page-features/${query.feature}`
        )
    ).json()

    return {
        props: {
            feature,
        },
    }
}