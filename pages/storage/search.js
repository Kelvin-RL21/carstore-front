import getConfig from 'next/config'
import Layout from '../../components/layout'
import SearchBox from '../../components/storage/searchBox'
import { useRouter } from 'next/router'
import Script from 'next/script'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

const Search = ({ types, features }) => {
    const router = useRouter()

    return (
        <section>
            <Script
                strategy='lazyOnload' 
                id='ga-adwords-search-storage'>
                {
                    `gtag('event', 'conversion', {'send_to': 'AW-10828018147/RWlVCKvAmosDEOPjmaso'});`
                }
            </Script>
            <Script
                strategy='lazyOnload' 
                id='ga-adwords-search-storage'>
                {
                    `gtag('event', 'conversion', {'send_to': 'AW-10828018147/RWlVCKvAmosDEOPjmaso'});`
                }
            </Script>
            <section
                className="section section-header section-image bg-primary overlay-primary text-white pt-4 pb-12 pb-md-12"
                style={{
                    backgroundImage: `url('/assets/img/home/banner-search.jpg')`,
                }}
            >
                <div className="container z-2">
                    <div className="row justify-content-center pt-0">
                        <div className="col-12 text-center"></div>
                    </div>
                </div>
            </section>

            {router.query.postcode && (
                <SearchBox
                    types={types}
                    features={features}
                    router={router}
                    publicRuntimeConfig={publicRuntimeConfig}
                />
            )}

            <div className="section section-lg pt-0 mb-6">
                <div className="container">
                    <div className="row"></div>
                </div>
            </div>
        </section>
    )
}

export async function getServerSideProps({ params }) {
    const typesResponse = await fetch(
        `${serverRuntimeConfig.apiUrl}/storage-types?_sort=order:ASC`
    )
    const types = await typesResponse.json()

    const featuresResponse = await fetch(
        `${serverRuntimeConfig.apiUrl}/storage-features?_sort=order:ASC`
    )
    const features = await featuresResponse.json()

    return {
        props: {
            types,
            features,
        },
    }
}

Search.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export default Search
