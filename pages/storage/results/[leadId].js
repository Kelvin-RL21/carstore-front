import { useState } from 'react'
import { useRouter } from 'next/router'
import getConfig from 'next/config'
import geodist from 'geodist'
import Layout from '../../../components/layout'
import { convert } from 'url-slug'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const API_RESOURCE_LEAD = '/storage-leads'
const API_RESOURCE_PROVIDERS = 'storage-providers'
const RESOURCE_URL = '/storage/results'

const Resource = ({ providers, lead }) => {
    const router = useRouter()

    const initialState = {
        lead: lead,
        providers: providers,
        loading: false,
        error: '',
        quoting: lead.quoting.length
            ? lead.quoting.map((provider) => String(provider.id))
            : providers.map((provider) => String(provider.id)),
    }

    const [query, setQuery] = useState(initialState)

    const handleParam = () => (e) => {
        const name = e.target.name
        let value = e.target.value

        if (Array.isArray(query[name])) {
            let listValues = [...query[name]]
            listValues.indexOf(value) > -1
                ? (listValues = listValues.filter((item) => item !== value))
                : listValues.push(value)
            value = listValues
        }

        setQuery((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const formSubmit = (e) => {
        e.preventDefault()

        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            error: '',
        }))

        fetch(`${publicRuntimeConfig.apiUrl}/storage-leads/${query.lead.id}`, {
            method: 'PUT',
            body: JSON.stringify({ quoting: query.quoting }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((json) => {
                setQuery((prevState) => ({
                    ...prevState,
                    lead: json,
                }))
            })
            .then(() => {
                // Email an alert to all providers.
                fetch(`/api/leadalert`, {
                    method: 'POST',
                    body: JSON.stringify({ lead: query.lead, quoting: query.quoting }),
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then((res) => res.json())
                    .then((json) => {
                        if (json?.error) {
                            return setQuery((prevState) => ({
                                ...prevState,
                                loading: false,
                                error: json?.error,
                            }))
                        }

                        //window.location.href = `/pages/8/confirmation`
                        // router.push(`/pages/8/confirmation`)
                    })
            })
    }

    return (
        <section>
            <div
                className="modal fade"
                id="modal-default"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modal-default"
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title">Why we recommend it</h6>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>
                                Car Store Club has suggested you allow your
                                search criteria to be shared with 10 companies
                                to maximize the chance of being contacted,
                                especially at peak times of year.
                            </p>
                            <p>
                                There are reasons why a vehicle storage company
                                may not contact you:
                            </p>
                            <ol>
                                <li>Their facility is full.</li>
                                <li>
                                    They decide they are not able to store your
                                    specific request.
                                </li>
                                <li>They miss the alert.</li>
                                <li>
                                    They do not respond within our 3 Day
                                    relevance window.
                                </li>
                            </ol>
                            <p>
                                It is our priority that you are always matched
                                with the most relevant facility so for all the
                                above reasons we suggest leaving the 10 pre
                                selected companies in place.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-link text-danger ml-auto"
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <section className="section section-header section-image bg-primary overlay-primary text-white pt-5 pb-2 pb-md-2">
                <div className="container z-2">
                    <div className="row justify-content-center pt-6">
                        <div className="col-12 text-center"></div>
                    </div>
                </div>
            </section> */}

            <section className="section section-lg bg-black pt-4 mt-6 pb-4">
                <div className="container">
                    <div className="row justify-content-center mb-4 pt-2">
                        <div className="col-12 col-md-10 text-center">
                            <h5 className="lead mt-4 mb-0 text-center text-light">
                                The Car Store Club is pleased to present the
                                best matches to your search query.
                            </h5>
                        </div>
                    </div>
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
                                            <div className="card border-light mb-4 mb-lg-0 text-center card-min-height">
                                                <div className="card-body p-4 px-xl-4 py-xl-4">
                                                    <div className="icon icon-shape icon-lg icon-shape-primary mb-4 rounded-circle">
                                                        <span className="fas fa-paper-plane"></span>
                                                    </div>
                                                    <p>
                                                        <strong>Step 1.</strong>{' '}
                                                        Review the list of
                                                        trusted facilities we
                                                        have matched against
                                                        your search.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <div className="card border-light mb-4 mb-lg-0 text-center card-min-height">
                                                <div className="card-body p-4 px-xl-4 py-xl-4">
                                                    <div className="icon icon-shape icon-lg icon-shape-primary mb-4 rounded-circle">
                                                        <span className="fas fa-tasks"></span>
                                                    </div>
                                                    <p>
                                                        <strong>Step 2.</strong>{' '}
                                                        Press Request quote and
                                                        we will make sure the
                                                        top 10 listed car
                                                        storage facilities will
                                                        receive your details and
                                                        be in touch very
                                                        shortly.
                                                        <br />
                                                        <br />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <div className="card border-light mb-4 mb-lg-0 text-center card-min-height">
                                                <div className="card-body p-4 px-xl-4 py-xl-4">
                                                    <div className="icon icon-shape icon-lg icon-shape-primary mb-4 rounded-circle">
                                                        <span className="fas fa-hourglass-half"></span>
                                                    </div>
                                                    <p>
                                                        <strong>Step 3.</strong>{' '}
                                                        Your enquiry will be
                                                        live for 5 days and the
                                                        automatically deleted.
                                                        <br />
                                                        <br />
                                                        <br />
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

            <div className="section section-lg pt-2 mb-6">
                <div className="container">
                    <form onSubmit={formSubmit}>
                        <div className="row mt-5">
                            <div className="col-12 mb-5">
                                <div className="row mb-4">
                                    <div className="col-12 col-md-9">
                                        <h2 className="h5 mb-3 mb-md-0">
                                            Car Storage Results for:{' '}
                                            <b>{query.lead.postcode}</b>
                                            <hr />
                                            <small>
                                                We{' '}
                                                <a
                                                    data-toggle="modal"
                                                    data-target="#modal-default"
                                                >
                                                    <b>recommend</b>{' '}
                                                    <i className="fas fa-info-circle mr-1"></i>
                                                </a>{' '}
                                                that you request quotes from the
                                                below number of facilities
                                                however <br /> if you would like
                                                to hear from less, please
                                                uncheck the quote box.
                                            </small>
                                        </h2>
                                    </div>
                                    <div className="col-12 col-md-3 text-center text-lg-right pt-4 pt-lg-0">
                                        {query.loading === false && (
                                            <button
                                                className="btn btn-lg btn-secondary animate-up-2"
                                                type="submit"
                                            >
                                                Request Quotes
                                                {'  '}
                                                <i className="fas fa-paper-plane mr-1"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {query.loading === true && (
                                    <p className="m-4 text-center">
                                        <img
                                            src="/assets/img/loading.gif"
                                            width="16"
                                            height="16"
                                        />{' '}
                                        Processing
                                    </p>
                                )}

                                {query.loading === false &&
                                    query.providers?.map((provider, index) => (
                                        <div key={index}
                                            className={`card border-light mb-2 animate-right-2 ${
                                                provider.sponsored
                                                    ? 'prime-search-card'
                                                    : ''
                                            }`}
                                        >
                                            <div className="row p-3 no-glutters align-items-center">
                                                <div className="col-12 col-md-3 text-center">
                                                    <a
                                                        href={
                                                            provider.sponsored
                                                                ? `/storage/providers/${
                                                                      provider?.id
                                                                  }/${convert(
                                                                      provider?.title ||
                                                                          'provider'
                                                                  )}`
                                                                : ''
                                                        }
                                                        target={
                                                            provider.sponsored
                                                                ? '_blank'
                                                                : ''
                                                        }
                                                    >
                                                        <img
                                                            src={
                                                                provider?.logo?.formats?.small?.url ||
                                                                provider?.logo?.formats?.thumbnail?.url ||
                                                                '/assets/img/home/overlay.jpeg'
                                                            }
                                                            alt="private office"
                                                            className={`card-img card-img-listing${
                                                                provider.sponsored
                                                                    ? '-sponsored'
                                                                    : ''
                                                            } rounded-xl`}
                                                        />

                                                        {provider.sponsored && (
                                                            <p className="mt-2">
                                                                <b>
                                                                    Click to
                                                                    view profile
                                                                </b>
                                                            </p>
                                                        )}
                                                    </a>
                                                </div>
                                                <div className="col-12 col-md-9">
                                                    <div className="row">
                                                        <div className="col-12 col-md-8 text-center text-lg-left">
                                                            <h2>
                                                                <a
                                                                    className="card-link-results-title"
                                                                    href={
                                                                        provider.sponsored
                                                                            ? `/storage/providers/${
                                                                                  provider?.id
                                                                              }/${convert(
                                                                                  provider?.title ||
                                                                                      'provider'
                                                                              )}`
                                                                            : ''
                                                                    }
                                                                    target={
                                                                        provider.sponsored
                                                                            ? '_blank'
                                                                            : ''
                                                                    }
                                                                >
                                                                    {
                                                                        provider.title
                                                                    }
                                                                </a>
                                                            </h2>

                                                            {provider.sponsored && (
                                                                <small className="text-left card-featured ml-2">
                                                                    <i className="fas fa-star mr-1"></i>{' '}
                                                                    Featured
                                                                    Facility
                                                                </small>
                                                            )}
                                                        </div>
                                                        <div className="col-12 col-md-4 form-check text-center text-lg-right">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`quote${index}`}
                                                                name="quoting"
                                                                onChange={handleParam()}
                                                                value={String(
                                                                    provider.id
                                                                )}
                                                                checked={
                                                                    query.quoting.indexOf(
                                                                        String(
                                                                            provider.id
                                                                        )
                                                                    ) > -1
                                                                }
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`quote${index}`}
                                                            >
                                                                Quote
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {
                                                                provider?.description
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row mt-2">
                                                        <div className="col-12 d-flex flex-wrap align-items-start pt-0">
                                                            <div className="col-6 col-lg-2 text-center pl-0 pr-0 pt-4">
                                                                <small className="mr-1 text-center">
                                                                    <b>
                                                                        Storage
                                                                        Proximity
                                                                    </b>
                                                                    <br />
                                                                    <span className="h6 text-dark font-weight-bold">
                                                                        <i
                                                                            className={`fas fa-${
                                                                                lead?.maxDistance >=
                                                                                provider?.distance
                                                                                    ? 'check'
                                                                                    : 'times'
                                                                            } mr-1`}
                                                                        ></i>
                                                                    </span>{' '}
                                                                    {
                                                                        provider?.distance
                                                                    }{' '}
                                                                    Miles
                                                                </small>
                                                            </div>
                                                            <div className="col-6 col-lg-2 text-center pl-0 pr-0 pt-4">
                                                                <small className="mr-1 text-center">
                                                                    <b>
                                                                        Minimum
                                                                        term
                                                                    </b>
                                                                    <br />
                                                                    <span className="h6 text-dark font-weight-bold">
                                                                        <i
                                                                            className={`fas fa-${
                                                                                lead?.duration >=
                                                                                provider?.minimumDuration
                                                                                    ? 'check'
                                                                                    : 'times'
                                                                            } mr-1`}
                                                                        ></i>
                                                                    </span>
                                                                    {
                                                                        provider?.minimumDuration
                                                                    }{' '}
                                                                    Months
                                                                </small>
                                                            </div>
                                                            <div className="col-6 col-lg-2 text-center pl-0 pr-0 pt-4">
                                                                <small className="mr-1 text-center">
                                                                    <b>
                                                                        Multiple
                                                                        Vehicles
                                                                    </b>
                                                                    <br />
                                                                    <span className="h6 text-dark font-weight-bold">
                                                                        <i
                                                                            className={`fas fa-${
                                                                                provider?.multipleVehicles
                                                                                    ? 'check'
                                                                                    : 'times'
                                                                            } mr-1`}
                                                                        ></i>
                                                                    </span>
                                                                </small>
                                                            </div>

                                                            {lead?.storage_features?.map(
                                                                (
                                                                    feature,
                                                                    fIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            fIndex
                                                                        }
                                                                        className="col-6 col-lg-2 text-center pl-0 pr-0 pt-4"
                                                                    >
                                                                        <span className="text-muted font-small d-block mb-2">
                                                                            <b>
                                                                                {
                                                                                    feature?.title
                                                                                }
                                                                            </b>
                                                                            <br />
                                                                            <span className="h6 text-dark font-weight-bold">
                                                                                <i
                                                                                    className={`fas fa-${
                                                                                        provider?.storage_features.find(
                                                                                            (
                                                                                                data
                                                                                            ) =>
                                                                                                data?.id ===
                                                                                                feature?.id
                                                                                        )
                                                                                            ? 'check'
                                                                                            : 'times'
                                                                                    } mr-1`}
                                                                                ></i>
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                            {lead?.storage_types?.map(
                                                                (
                                                                    type,
                                                                    fIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            fIndex
                                                                        }
                                                                        className="col-6 col-lg-2 text-center pl-0 pr-0 pt-4"
                                                                    >
                                                                        <span className="text-muted font-small d-block mb-2">
                                                                            <b>
                                                                                Accept{' '}
                                                                                {
                                                                                    type?.title
                                                                                }
                                                                            </b>
                                                                            <br />
                                                                            <span className="h6 text-dark font-weight-bold">
                                                                                <i
                                                                                    className={`fas fa-${
                                                                                        provider?.storage_types.find(
                                                                                            (
                                                                                                data
                                                                                            ) =>
                                                                                                data?.id ===
                                                                                                type?.id
                                                                                        )
                                                                                            ? 'check'
                                                                                            : 'times'
                                                                                    } mr-1`}
                                                                                ></i>
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                {query.providers.length > 4 && (
                                    <div className="row mt-4">
                                        <div className="col-12 text-left">
                                            <small>
                                                We would welcome and encourage
                                                feedback on the process and
                                                companies through this feedback
                                                link here.
                                            </small>
                                        </div>
                                        <div className="col-12 text-center text-lg-right pt-4 pt-lg-0">
                                            {query.loading === false && (
                                                <button
                                                    className="btn btn-lg btn-secondary animate-up-2"
                                                    type="submit"
                                                >
                                                    Request Quotes
                                                    {'  '}
                                                    <i className="fas fa-paper-plane mr-1"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export async function getServerSideProps({ params }) {
    const leadResponse = await fetch(
        `${serverRuntimeConfig.apiUrl}${API_RESOURCE_LEAD}/${params.leadId}`
    )
    const lead = await leadResponse.json()

    let allProviders =
        (await (
            await fetch(
                `${serverRuntimeConfig.apiUrl}/${API_RESOURCE_PROVIDERS}?_limit=9999999999`
            )
        ).json()) || []

    if (allProviders?.statusCode === 500) {
        return {
            props: {
                providers: [],
                lead: [],
            },
        }
    }

    // Ensure disabled/incomplete providers doesn't take the space of relevant ones.
    allProviders = allProviders.filter(
        (provider) => provider.email && provider.emailLeads
    )

    // Sort all by closest geolocation
    allProviders = allProviders
        .map((provider) => {
            provider.distance = geodist(
                { lat: lead.latitude, lon: lead.longitude },
                {
                    lat: provider.latitude,
                    lon: provider.longitude,
                },
                { unit: 'miles' }
            )

            provider.sponsored = provider.sponsorEnd
                ? new Date() < new Date(provider.sponsorEnd)
                : false

            return provider
        })
        .sort((a, b) => {
            if (a.distance < b.distance) {
                return -1
            }
            if (a.distance > b.distance) {
                return 1
            }
            return 0
        })

    const leadFeatureIds = lead.storage_features.map((feature) => feature.id)
    const leadTypeIds = lead.storage_types.map((type) => type.id)

    let allFilteredProviders = allProviders
        .filter((provider) =>
            provider?.storage_types?.find(
                (data) => leadTypeIds.indexOf(data.id) !== -1
            )
        )
        .map((provider) => {
            provider.score = 0

            if (provider?.distance <= lead?.maxDistance) {
                provider.score++
            }

            if (provider?.minimumDuration <= lead?.duration) {
                provider.score++
            }

            if (
                provider?.storage_features?.find((data) =>
                    leadFeatureIds.indexOf(data.id)
                )
            ) {
                provider.score++
            }

            if (lead?.multipleVehicles && provider?.multipleVehicles) {
                provider.score++
            }

            return provider
        })
        .sort((a, b) => {
            if (a.distance < b.distance && a.score > b.score) {
                return -1
            }
            if (a.distance > b.distance && a.score < b.score) {
                return 1
            }
            return 0
        })

    // As it should always provide at least 10 results, it will first list the best match and then the closest match.
    if (allFilteredProviders.length < 10) {
        const allClosestProviders = allProviders.filter(
            (provider) =>
                !allFilteredProviders.find(
                    (data) => data?.id === provider?.id
                ) &&
                provider?.storage_types?.find(
                    (data) => leadTypeIds.indexOf(data.id) !== -1
                )
        )

        allFilteredProviders.push(
            ...allClosestProviders.slice(0, 10 - allFilteredProviders.length)
        )
    }

    allFilteredProviders = allFilteredProviders.sort(function (a, b) {
        if (a.sponsored > b.sponsored) {
            return -1
        }
        if (a.sponsored < b.sponsored) {
            return 1
        }
        return 0
    })

    return {
        props: {
            providers: allFilteredProviders.slice(0, 10),
            lead,
        },
    }
}

Resource.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export default Resource
