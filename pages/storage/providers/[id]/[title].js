import Head from 'next/head'
import getConfig from 'next/config'
import Layout from '../../../../components/layout'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const API_RESOURCE_NAME = '/storage-providers'
const RESOURCE_URL = '/providers'

const Resource = ({ provider }) => {
    const logo =
        provider?.logo?.formats?.medium?.url ||
        provider?.logo?.formats?.thumbnail?.url
    return (
        <>
            <Head>
                <title>{provider?.title || 'The Car Store Club'}</title>
                <meta
                    name="title"
                    content={provider?.title || 'The Car Store Club'}
                />
                <meta
                    name="description"
                    content={
                        provider?.description?.slice(0, 50) || 'The Car Store Club'
                    }
                />
                <meta
                    name="keywords"
                    content={provider?.seoKeywords || 'The Car Store Club'}
                />
                <meta
                    property="og:title"
                    content={provider?.title || 'The Car Store Club'}
                />
                <meta
                    property="og:description"
                    content={
                        provider?.description?.slice(0, 50) || 'The Car Store Club'
                    }
                />
            </Head>
            <section>
                <section className="section section-header text-white pt-8 pb-2 pb-md-2"></section>

                <section className="section section-lg pt-5">
                    <div className="container">
                        <div className="row mb-6">
                            <div
                                className={`col-${
                                    provider?.featuredImages?.length > 0
                                        ? '8'
                                        : '12'
                                } text-left card border-light pt-6 pb-0 pl-5 pr-5`}
                            >
                                <div className="row">
                                    {logo && (
                                        <div className="col-12 text-center mb-6">
                                            <img
                                                className="img-responsive"
                                                src={logo}
                                                alt={provider?.title}
                                                title={provider?.title}
                                            />
                                        </div>
                                    )}
                                    <div className="col-12 mb-4">
                                        <h1>{provider?.title}</h1>
                                        {/* {provider?.phone && (
                                            <small className="mr-2">
                                                <span className="icon icon-xs icon-primary">
                                                    <span className="fas fa-phone mr-1"></span>
                                                </span>
                                                {provider?.phone}
                                            </small>
                                        )}
                                        {provider?.email && (
                                            <small className="mr-2">
                                                <span className="icon icon-xs icon-primary">
                                                    <span className="fas fa-envelope mr-1"></span>
                                                </span>
                                                {provider?.email}
                                            </small>
                                        )}
                                        {provider?.website && (
                                            <small className="mr-2">
                                                <span className="icon icon-xs icon-primary">
                                                    <span className="fas fa-sitemap mr-1"></span>
                                                </span>
                                                {provider?.website}
                                            </small>
                                        )}
                                        {provider?.postcode && (
                                            <small className="mr-2">
                                                <span className="icon icon-xs icon-primary">
                                                    <span className="fas fa-map-marker-alt mr-1"></span>
                                                </span>
                                                {provider?.postcode}
                                            </small>
                                        )} */}
                                    </div>

                                    <div className="col-12">
                                        <p>{provider?.description}</p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="card card-body bg-soft border-light p-2 mt-6 mb-4">
                                        <div className="card-group bg-soft">
                                            {!!provider?.storageCapacity && (
                                                <div className="card mb-0">
                                                    <div className="card-body text-center px-0 px-md-3">
                                                        <div className="icon icon-primary">
                                                            <span className="fas fa-ruler-combined"></span>
                                                        </div>
                                                        <div className="h5 mt-3 mb-0">
                                                            Capacity
                                                        </div>
                                                        <span className="text-muted h6 font-weight-normal mb-0">
                                                            {
                                                                provider?.storageCapacity
                                                            }{' '}
                                                            Vehicles
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {!!provider?.temporaryRemovalNotice && (
                                                <div className="card mb-0 border-left">
                                                    <div className="card-body text-center px-0 px-md-3">
                                                        <div className="icon icon-primary">
                                                            <span className="fas fa-hourglass-half"></span>
                                                        </div>
                                                        <div className="h5 mt-3 mb-0">
                                                            Access
                                                        </div>
                                                        <span className="text-muted h6 font-weight-normal mb-0">
                                                            {
                                                                provider?.temporaryRemovalNotice
                                                            }{' '}
                                                            hours Notice
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {!!provider?.permanentRemovalNotice && (
                                                <div className="card mb-0 border-left">
                                                    <div className="card-body text-center px-0 px-md-3">
                                                        <div className="icon icon-primary">
                                                            <span className="fas fa-sign-out-alt"></span>
                                                        </div>
                                                        <div className="h5 mt-3 mb-0">
                                                            Terminate
                                                        </div>
                                                        <span className="text-muted h6 font-weight-normal mb-0">
                                                            {
                                                                provider?.permanentRemovalNotice
                                                            }{' '}
                                                            weeks Notice
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {!!provider?.minimumDuration && (
                                                <div className="card mb-0 border-left">
                                                    <div className="card-body text-center px-0 px-md-3">
                                                        <div className="icon icon-primary">
                                                            <span className="fas fa-calendar-alt"></span>
                                                        </div>
                                                        <div className="h5 mt-3 mb-0">
                                                            Minimum
                                                        </div>
                                                        <span className="text-muted h6 font-weight-normal mb-0">
                                                            {
                                                                provider?.minimumDuration
                                                            }{' '}
                                                            months
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {!!provider?.minMonthlyFee && (
                                                <div className="card mb-0 border-left">
                                                    <div className="card-body text-center px-0 px-md-3">
                                                        <div className="icon icon-primary">
                                                            <span className="fas fa-pound-sign"></span>
                                                        </div>
                                                        <div className="h5 mt-3 mb-0">
                                                            Min Weekly Fee{' '}
                                                            <small>
                                                                (ex VAT)
                                                            </small>
                                                        </div>
                                                        <span className="text-muted h6 font-weight-normal mb-0">
                                                        £{(
                                                                provider?.minMonthlyFee ||
                                                                0
                                                            ).toFixed(2)}{' '}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {provider?.featuredImages?.length > 0 && (
                                <div className="col-md-4 text-center">
                                    {provider?.featuredImages?.map(
                                        (featured, index) => (
                                            <img
                                                key={index}
                                                className="img-responsive rounded mb-2 animate-up-5"
                                                src={
                                                    featured?.formats?.medium
                                                        ?.url
                                                }
                                                alt={provider?.title}
                                                title={provider?.title}
                                                width="320"
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}

export async function getServerSideProps({ params }) {
    const provider = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}${API_RESOURCE_NAME}/${params.id}`
        )
    ).json()

    return {
        props: {
            provider,
        },
    }
}

Resource.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export default Resource
