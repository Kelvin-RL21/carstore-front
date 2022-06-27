import getConfig from 'next/config'
import { useState } from 'react'
import { useRouter } from 'next/router'
import LayoutAdmin from '../../components/layoutAdmin'
import withSession from '../../lib/session'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const ADMIN_URL = '/admin'
const RESOURCE_URL = `${ADMIN_URL}/leads`
const API_RESOURCE_NAME = '/storage-leads'

const Leads = ({ user, quoting, purchased }) => {
    const router = useRouter()

    const initialState = {
        purchased: purchased,
        quoting: quoting,
        cart: [],
        loading: false,
        message: '',
    }

    const [query, setQuery] = useState(initialState)

    const handleParam = (e) => {
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

    // Strapi callback possibilities.
    if (!query?.message && router.query?.success) {
        fetch(`${publicRuntimeConfig.FRONTEND_API_URL}/api/purchased`, {
            method: 'POST',
            body: JSON.stringify({ secret: router.query.success }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.error) {
                    setQuery((prevState) => ({
                        ...prevState,
                        loading: false,
                        message: json.error,
                    }))
                } else if (json.length) {
                    setQuery((prevState) => ({
                        ...prevState,
                        loading: false,
                        message:
                            'Thank you! you can now see your purchase under "Purchased Leads".',
                    }))

                    window.location.href = `/admin/confirmation?message=Transaction Confirmed! Now you can see your purchased lead.${
                        typeof json === 'object' && json !== null
                            ? json.map( leadId => `&lead=${leadId}`).join('')
                            : ''
                    }`

                    // router.push(
                    //     `/admin/confirmation?leads=${
                    //         typeof json === 'object' && json !== null
                    //             ? JSON.stringify(json)
                    //             : 'none'
                    //     }&message=Transaction Confirmed! Now you can see your purchased lead.`
                    // )
                } else {
                    console.log('Debug:', router.query?.success, json)
                    setQuery((prevState) => ({
                        ...prevState,
                        loading: false,
                        message: 'No new purchases.',
                    }))

                    window.location.href = '/admin/confirmation?message=No new purchases.'
                    // router.push('/admin/confirmation?message=No new purchases.')
                }

                console.log('Purchase Result:', json)
            })
    } else if (!query?.message && router.query?.canceled) {
        setQuery((prevState) => ({
            ...prevState,
            loading: false,
            message: 'Payment fail! Contact the support.',
        }))
    } else if (!query?.message && router.query?.error) {
        setQuery((prevState) => ({
            ...prevState,
            loading: false,
            message:
                router.query?.error === 'invalid_request'
                    ? 'Apologies, there has been an issue. Contact the support.'
                    : router.query?.error,
        }))
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
                            <h6 className="modal-title">
                                How did we come to 12.99?
                            </h6>
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
                                Our founders have worked extensively in Car
                                storage sales and are experienced marketeers.
                                They have years of digital marketing and Return
                                on Investment experience that resulted in the
                                following assumptions:
                            </p>
                            <p>
                                - The average lead value is between £300-£500.
                            </p>
                            <p>
                                - A lead from Google Adwords can cost upwards of
                                £30.
                            </p>
                            <p>
                                On top of that there is the time to plan, set up
                                and manage marketing activities across many
                                platforms that Car Store Club will help you
                                minimise or even negate. Our matching engine
                                means we will only bring you qualified, relevant
                                leads
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

            <div className="section section-lg bg-gray pt-lg-10">
                <div className="container">
                    <div className="row pt-5 pt-md-0">
                        <div className="col-12 col-lg-12">
                            <div className="row mb-4 mt-0">
                                <div className="col-12 col-md-12">
                                    <div className="col-12 col-md-12 mb-4">
                                        <div className="card border-light">
                                            <div className="card-body bg-light d-block d-md-flex align-items-center">
                                                <div>
                                                    <p className="ml-2 mr-4">
                                                        <small>
                                                            <b>
                                                                How this works
                                                            </b>
                                                            : We have matched
                                                            your service
                                                            capabilities to the
                                                            customers storage
                                                            requirements
                                                            resulting in high
                                                            quality sales leads
                                                            listed below. You
                                                            now have the
                                                            opportunity to get
                                                            in touch with the
                                                            customer and close
                                                            the sale.
                                                        </small>
                                                    </p>
                                                    <p className="ml-2 mr-4">
                                                        <small>
                                                            Each lead will cost{' '}
                                                            <a
                                                                data-toggle="modal"
                                                                data-target="#modal-default"
                                                            >
                                                                <b>£12.99</b>{' '}
                                                                <i className="fas fa-info-circle mr-1"></i>
                                                            </a>{' '}
                                                            - Press ‘Buy Now’
                                                            for a single lead or
                                                            ‘add to cart’ for
                                                            multiple leads ,
                                                            then Check out. As
                                                            soon as you pay for
                                                            the lead, we will
                                                            immediately reveal
                                                            the details of the
                                                            customer for you to
                                                            contact.
                                                        </small>
                                                    </p>
                                                    <p className="ml-2 mr-4">
                                                        <small>
                                                            In order to keep
                                                            sales leads fresh,
                                                            they will be
                                                            available to
                                                            purchase for 3 days
                                                            and then be deleted,
                                                            we recommend
                                                            responding within
                                                            24hrs.
                                                        </small>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {query?.message && (
                                <div className="row m-5">
                                    <div className="col-12 text-center">
                                        <h4 className="text-danger">
                                            {query?.message}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            <div className="row">
                                <div className="col-12 col-md-8 text-left">
                                    <h1 className="h5 mb-3">
                                        {user?.providerTitle} Sales Leads
                                    </h1>
                                </div>
                                <div className="col-12 col-md-4 text-right">
                                    <form method="post" action="/api/checkout">
                                        <button
                                            type="submit"
                                            className="btn btn-md btn-secondary"
                                            value={query?.cart?.join(',')}
                                            name="leads"
                                            disabled={query?.cart?.length === 0}
                                        >
                                            Checkout ({query?.cart?.length || 0}
                                            ){' '}
                                            <i className="fas fa-shopping-cart mr-1"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <nav>
                                        <div
                                            className="nav nav-tabs mb-4"
                                            id="nav-tab"
                                            role="tablist"
                                        >
                                            <a
                                                className="nav-item nav-link active"
                                                id="nav-active-leads-tab"
                                                data-toggle="tab"
                                                href="#nav-active-leads"
                                                role="tab"
                                                aria-controls="nav-active-leads"
                                                aria-selected="true"
                                            >
                                                Active Leads ({quoting?.length})
                                            </a>
                                            <a
                                                className="nav-item nav-link"
                                                id="nav-purchased-leads-tab"
                                                data-toggle="tab"
                                                href="#nav-purchased-leads"
                                                role="tab"
                                                aria-controls="nav-purchased-leads"
                                                aria-selected="false"
                                            >
                                                Purchased Leads (
                                                {purchased?.length})
                                            </a>
                                        </div>
                                    </nav>
                                    <div
                                        className="tab-content"
                                        id="nav-tabContent"
                                    >
                                        <div
                                            className="tab-pane fade show active"
                                            id="nav-active-leads"
                                            role="tabpanel"
                                            aria-labelledby="nav-active-leads-tab"
                                        >
                                            <div className="mt-4">
                                                {quoting?.map((lead, index) => (
                                                    <div
                                                        key={index}
                                                        className="card border-light mb-2"
                                                    >
                                                        <div className="card-body bg-light pt-4 pb-3">
                                                            <div className="row">
                                                                <div className="col-4 col-md-2 text-left">
                                                                    <b>
                                                                    <i class="fas fa-user"></i> {lead.name.slice(
                                                                            0,
                                                                            4
                                                                        )}
                                                                        ...
                                                                    </b>
                                                                    <br />
                                                                    <small>
                                                                    <i class="fas fa-phone"></i> {lead.phone.slice(
                                                                            0,
                                                                            4
                                                                        )}
                                                                        ...
                                                                    </small>
                                                                    <br />
                                                                    <small>
                                                                    <i class="fas fa-map-marker-alt"></i> {lead.postcode.slice(
                                                                            0,
                                                                            4
                                                                        )}
                                                                    </small>
                                                                </div>
                                                                <div className="col-8 col-md-4 text-left">
                                                                    <span className="badge badge-info text-uppercase ml-1">
                                                                        Starting
                                                                        this{' '}
                                                                        {
                                                                            lead.startPeriod === 'semester' ? 'within 6 months' : lead.startPeriod
                                                                        }
                                                                    </span>
                                                                    <span className="badge badge-info text-uppercase ml-1">
                                                                        {lead.duration >
                                                                        12
                                                                            ? 'More than 12 months'
                                                                            : `For about ${lead.duration} months`}
                                                                    </span>
                                                                    <span className="badge badge-info text-uppercase ml-1">
                                                                        {lead.multipleVehicles
                                                                            ? 'Multiple'
                                                                            : 'Single'}{' '}
                                                                        Vehicle
                                                                    </span>

                                                                    {lead?.storage_types?.map(
                                                                        (
                                                                            type,
                                                                            typeIndex
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    typeIndex
                                                                                }
                                                                                className="badge badge-info text-uppercase ml-1"
                                                                            >
                                                                                {
                                                                                    type.title
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}

                                                                    {lead?.storage_features?.map(
                                                                        (
                                                                            feature,
                                                                            featureIndex
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    featureIndex
                                                                                }
                                                                                className="badge badge-info text-uppercase ml-1"
                                                                            >
                                                                                {
                                                                                    feature.title
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                                <div className="col-12 col-md-3 text-left">
                                                                    <small>
                                                                        {lead.observations.slice(
                                                                            0,
                                                                            150
                                                                        )}
                                                                    </small>
                                                                </div>
                                                                <div className="col-12 col-md-3">
                                                                    <div className='row'>
                                                                        <div className='col-12 text-right'>
                                                                            <h6
                                                                                className={`text-${
                                                                                    lead.daysLeft >
                                                                                    1
                                                                                        ? 'primary'
                                                                                        : 'danger'
                                                                                }`}
                                                                            >
                                                                                Expire
                                                                                in{' '}
                                                                                {
                                                                                    lead.daysLeft
                                                                                }{' '}
                                                                                day{lead.daysLeft >= 2 ? 's' : ''}.
                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className='row'>
                                                                        <div className='col-12 col-md-7 text-right p-1 m-0'>
                                                                            <form
                                                                                method="POST"
                                                                                action="/api/checkout"
                                                                            >
                                                                                <button
                                                                                    type="submit"
                                                                                    className="btn btn-sm btn-secondary mr-1"
                                                                                    name="leads"
                                                                                    value={
                                                                                        lead?.id
                                                                                    }
                                                                                >
                                                                                    buy
                                                                                    now
                                                                                </button>
                                                                            </form>
                                                                        </div>
                                                                        <div className='col-12 col-md-5 text-right p-1 m-0'>
                                                                            <button
                                                                                name="cart"
                                                                                value={String(
                                                                                    lead.id
                                                                                )}
                                                                                className="btn btn-sm btn-outline-primary"
                                                                                onClick={
                                                                                    handleParam
                                                                                }
                                                                            >
                                                                                {query.cart.indexOf(
                                                                                    String(
                                                                                        lead.id
                                                                                    )
                                                                                ) === -1
                                                                                    ? 'add to'
                                                                                    : 'remove from'}{' '}
                                                                                cart
                                                                            </button>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                    <div className='row pt-4'>
                                                                        <div className='col-12 text-right'>
                                                                            <small>Request Date: {lead.createdAt}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div
                                            className="tab-pane fade"
                                            id="nav-purchased-leads"
                                            role="tabpanel"
                                            aria-labelledby="nav-purchased-leads-tab"
                                        >
                                            {purchased?.map((lead, index) => (
                                                <div
                                                    key={index}
                                                    className="card border-gray mb-3 py-3"
                                                >
                                                    <div
                                                        className="
                    card-body
                    d-flex
                    align-items-center
                    flex-wrap flex-lg-nowrap
                    py-0
                  "
                                                    >
                                                        <div className="col-auto col-lg-2 d-flex align-items-center px-0">
                                                            {/* <div className="form-check inbox-check mr-2"></div> */}
                                                            {/* <div className="rating-star d-none d-sm-inline-block"></div> */}
                                                            {lead?.receipts?.find( data => data.name?.indexOf( `lead-${lead?.id}-provider-${user?.providerId}` ) > -1)?.url ? 
                                                            <a className='btn btn-sm btn-primary' href={lead?.receipts?.find( data => data.name?.indexOf( `lead-${lead?.id}-provider-${user?.providerId}` ) > -1)?.url} target="_blank">
                                                                View Receipt
                                                            </a> :
                                                            `Purchased Lead #${lead.id}`}
                                                        </div>
                                                        <div className="col-lg-2 col-2 pl-0 ml-2">
                                                            {lead.name}
                                                            <br />
                                                            <small>
                                                                {lead.phone}
                                                            </small>
                                                            <br />
                                                            <small>
                                                                {lead.email}
                                                            </small>
                                                        </div>
                                                        <div className="col-12 col-lg-9 d-flex align-items-center px-0">
                                                            <div className="col-12 col-lg-12 px-0">
                                                                <div
                                                                    className="
                                                        d-flex
                                                        flex-wrap flex-lg-nowrap
                                                        align-items-center
                                                        "
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            <span className="badge badge-light text-uppercase ml-1">
                                                                                Starting
                                                                                this{' '}
                                                                                {
                                                                                    lead.startPeriod
                                                                                }
                                                                            </span>
                                                                            <span className="badge badge-light text-uppercase ml-1">
                                                                                {lead.duration >
                                                                                12
                                                                                    ? 'More than 12 months'
                                                                                    : `For about ${lead.duration} months`}
                                                                            </span>
                                                                            <span className="badge badge-light text-uppercase ml-1">
                                                                                {lead.multipleVehicles
                                                                                    ? 'Multiple'
                                                                                    : 'Single'}{' '}
                                                                                Vehicle
                                                                            </span>

                                                                            {lead?.storage_types?.map(
                                                                                (
                                                                                    type,
                                                                                    typeIndex
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            typeIndex
                                                                                        }
                                                                                        className="badge badge-light text-uppercase ml-1"
                                                                                    >
                                                                                        {
                                                                                            type.title
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}

                                                                            {lead?.storage_features?.map(
                                                                                (
                                                                                    feature,
                                                                                    featureIndex
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            featureIndex
                                                                                        }
                                                                                        className="badge badge-light text-uppercase ml-1"
                                                                                    >
                                                                                        {
                                                                                            feature.title
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            <small>
                                                                                {lead.observations.slice(
                                                                                    0,
                                                                                    150
                                                                                )}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center mt-5">
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            Previous
                                        </a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="#">
                                            1
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            2
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            3
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            4
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            5
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            Next
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                         */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

Leads.getLayout = function getLayout(page) {
    return <LayoutAdmin user={page.props.user}>{page}</LayoutAdmin>
}

export const getServerSideProps = withSession(async function ({ req, res, query }) {
    const user = req.session.get('user')

    if (!user) {
        return {
            redirect: {
                destination: `${ADMIN_URL}/login`,
                permanent: false,
            },
        }
    }

    let d = new Date()
    d.setDate(d.getDate() - 2)

    let quoting = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}${API_RESOURCE_NAME}?created_at_gte=${
                d.toISOString().split('T')[0]
            }&quoting_in=${user.providerId}&_sort=created_at:DESC&_limit=50`
        )
    ).json()

    const purchased = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}${API_RESOURCE_NAME}?purchased_in=${user.providerId}`
        )
    ).json()

    if (quoting.length) {
        quoting = quoting
            .map((lead) => {
                var today = new Date()
                var leadDate = new Date(lead.created_at.split('T')[0])
                var difference = Math.abs(today - leadDate)
                lead.daysLeft = 4 - Math.round(difference / (1000 * 3600 * 24))
                lead.createdAt = (new Date(lead.created_at)).toDateString();
                return lead
            })
            .filter(
                (lead) => !purchased.find((purchase) => purchase.id === lead.id)
            )
    }

    return {
        props: {
            user,
            quoting,
            purchased,
        },
    }
})

export default Leads
