import getConfig from 'next/config'
import { useState } from 'react'
import { useRouter } from 'next/router'
import LayoutAdmin from '../../components/layoutAdmin'
import withSession from '../../lib/session'
import { convert } from 'url-slug'
import moment from 'moment'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const ADMIN_URL = '/admin'
const API_RESOURCE_NAME = '/storage-providers'

const Profile = ({ user, provider, features, types, securities }) => {
    const router = useRouter()

    const initialState = {
        emailLeads: provider?.emailLeads || false,
        title: provider?.title || '',
        email: provider?.email || '',
        postcode: provider?.postcode || '',
        latitude: provider?.latitude || '',
        longitude: provider?.longitude || '',
        phone: provider?.phone || '',
        website: provider?.website || '',
        minimumDuration: provider?.minimumDuration || 0,
        multipleVehicles:
            typeof provider.multipleVehicles !== undefined
                ? provider.multipleVehicles
                : true,
        description: provider?.description || '',
        temporaryRemovalNotice: provider?.temporaryRemovalNotice || 0,
        permanentRemovalNotice: provider?.permanentRemovalNotice || 0,
        storageCapacity: provider?.storageCapacity || 0,
        minMonthlyFee: provider?.minMonthlyFee || 0,
        sponsorStart: provider?.sponsorStart || '',
        sponsorEnd: provider?.sponsorEnd || '',
        storage_types:
            provider?.storage_types?.length === 0
                ? []
                : provider?.storage_types?.map((data) => String(data.id)),
        storage_features:
            provider?.storage_features?.length === 0
                ? []
                : provider?.storage_features?.map((data) => String(data.id)),
        storage_securities:
            provider?.storage_securities?.length === 0
                ? []
                : provider?.storage_securities?.map((data) => String(data.id)),

        loading: false,
        message: '',

        isSponsored:
            !!provider.sponsorEnd &&
            moment(provider.sponsorEnd).format('YYYY-MM-DD') >=
                moment().format('YYYY-MM-DD'),

        logo: provider.logo,
        featuredImages: provider.featuredImages,

        newLogo: null,
        featured1: null,
        featured2: null,
        featured3: null,

        imagesLoading: false,
        imagesMessage: '',
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

        if (name === 'phone') {
            value = isNaN(Number(value))
                ? query[name] || ''
                : String(value).replace(/\D/gi, '')
        }

        setQuery((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleEmailLeads = (e) => {
        const name = e.target.name
        let value = !(e.target.value === 'true')

        setQuery((prevState) => ({
            ...prevState,
            [name]: value,
        }))

        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            message: '',
        }))

        updateProvider(JSON.stringify({ emailLeads: value }), (error, body) => {
            if (error) {
                return setQuery((prevState) => ({
                    ...prevState,
                    loading: false,
                    message: error.message,
                }))
            }

            setQuery((prevState) => ({
                ...prevState,
                ...body,
                storage_types:
                    body?.storage_types?.length === 0
                        ? []
                        : body?.storage_types?.map((data) => String(data.id)),
                storage_features:
                    body?.storage_features?.length === 0
                        ? []
                        : body?.storage_features?.map((data) =>
                              String(data.id)
                          ),
                storage_securities:
                    body?.storage_securities?.length === 0
                        ? []
                        : body?.storage_securities?.map((data) =>
                              String(data.id)
                          ),
                loading: false,
                message: 'Details updated!',
            }))
        })
    }

    const uploadLogo = (e) => {
        const file = e.target.files[0]

        if (!file || file.type.indexOf('image') === -1) {
            return setQuery((prevState) => ({
                ...prevState,
                imagesLoading: false,
                imagesMessage: 'File must be a valid .jpg/.jpeg/.png image!',
            }))
        }

        setQuery((prevState) => ({
            ...prevState,
            imagesLoading: true,
            imagesMessage: '',
        }))

        const formData = new FormData()
        formData.append('files', file)

        fetch(`${publicRuntimeConfig.apiUrl}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${user.jwt}`,
            },
        })
            .then((res) => res.json())
            .then((json) => {
                // console.log('response:', json)

                if (!json?.[0]?.id) {
                    return setQuery((prevState) => ({
                        ...prevState,
                        imagesLoading: false,
                        imagesMessage:
                            'Apologies, there has been an error while uploading the image.',
                    }))
                }

                updateProvider(
                    JSON.stringify({ logo: json[0]?.id }),
                    (error, body) => {
                        if (error) {
                            return setQuery((prevState) => ({
                                ...prevState,
                                imagesLoading: false,
                                imagesMessage: error.message,
                            }))
                        }

                        setQuery((prevState) => ({
                            ...prevState,
                            ...body,
                            imagesLoading: false,
                            imagesMessage: 'Images updated!',
                        }))
                    }
                )
            })
            .catch((error) => {
                setQuery((prevState) => ({
                    ...prevState,
                    imagesLoading: false,
                    imagesMessage: error.message,
                }))
            })
    }

    const uploadFeaturedImage = (e) => {
        const name = e.target.name
        const file = e.target.files[0]

        if (!file || file.type.indexOf('image') === -1) {
            return setQuery((prevState) => ({
                ...prevState,
                imagesLoading: false,
                imagesMessage: 'File must be a valid .jpg/.jpeg/.png image!',
            }))
        }

        setQuery((prevState) => ({
            ...prevState,
            imagesLoading: true,
            imagesMessage: '',
        }))

        const formData = new FormData()
        formData.append('files', file)

        let featuredImages = [
            query?.featuredImages?.[0]?.id,
            query?.featuredImages?.[1]?.id,
            query?.featuredImages?.[2]?.id,
        ]

        fetch(`${publicRuntimeConfig.apiUrl}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${user.jwt}`,
            },
        })
            .then((res) => res.json())
            .then((json) => {
                // console.log('response:', json)

                if (!json?.[0]?.id) {
                    return setQuery((prevState) => ({
                        ...prevState,
                        imagesLoading: false,
                        imagesMessage:
                            'Apologies, there has been an error while uploading the image.',
                    }))
                }

                switch (name) {
                    case 'featured1':
                        featuredImages[0] = json[0].id
                        break
                    case 'featured2':
                        featuredImages[1] = json[0].id
                        break
                    case 'featured3':
                        featuredImages[2] = json[0].id
                        break
                }

                updateProvider(
                    JSON.stringify({ featuredImages: featuredImages }),
                    (error, body) => {
                        if (error) {
                            return setQuery((prevState) => ({
                                ...prevState,
                                imagesLoading: false,
                                imagesMessage: error.message,
                            }))
                        }

                        setQuery((prevState) => ({
                            ...prevState,
                            ...body,
                            imagesLoading: false,
                            imagesMessage: 'Images updated!',
                        }))
                    }
                )
            })
            .catch((error) => {
                setQuery((prevState) => ({
                    ...prevState,
                    imagesLoading: false,
                    imagesMessage: error.message,
                }))
            })
    }

    const updateProvider = (jsonBody, callBack) => {
        fetch(
            `${publicRuntimeConfig.apiUrl}${API_RESOURCE_NAME}/${provider.id}`,
            {
                method: 'PUT',
                body: jsonBody,
                headers: {
                    Authorization: `Bearer ${user.jwt}`,
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((res) => res.json())
            .then((json) => callBack(null, json))
            .catch((error) => callBack(error, null))
    }

    const postcodeLookup = (postcode, callBack) => {
        fetch(`${publicRuntimeConfig.postcodeServiceUrl}/${postcode}`)
            .then((res) => res.json())
            .then((json) => callBack(null, json))
            .catch((error) => callBack(error, null))
    }

    const formSubmit = (e) => {
        e.preventDefault()

        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            message: '',
        }))

        postcodeLookup(query.postcode.replace(/ /gi, ''), (error, body) => {
            if (error || !body.result) {
                // console.log('postcodeLookup: ', body, error)
                return setQuery((prevState) => ({
                    ...prevState,
                    loading: false,
                    message: 'Invalid Postcode, please review and try again.',
                }))
            }

            const updateData = {
                ...(query?.title?.length > 2 &&
                    query?.title?.length < 100 && { title: query.title }),
                ...(query?.email?.length > 2 &&
                    query?.email?.length < 100 && { email: query.email }),
                ...(query?.postcode && { postcode: query.postcode }),
                ...(body?.result?.latitude && {
                    latitude: body.result.latitude,
                }),
                ...(body?.result?.longitude && {
                    longitude: body.result.longitude,
                }),
                ...(query?.phone && { phone: query.phone }),
                ...(query?.minimumDuration && {
                    minimumDuration: query.minimumDuration,
                }),
                ...(query?.minimumDuration && {
                    minimumDuration: query.minimumDuration,
                }),
                ...(typeof query?.multipleVehicles !== undefined &&
                    query?.multipleVehicles !== null && {
                        multipleVehicles: query.multipleVehicles,
                    }),
                ...(query?.description && { description: query.description }),
                ...(typeof query?.temporaryRemovalNotice !== undefined &&
                    query?.temporaryRemovalNotice !== null && {
                        temporaryRemovalNotice: query.temporaryRemovalNotice,
                    }),
                ...(typeof query?.permanentRemovalNotice !== undefined &&
                    query?.permanentRemovalNotice !== null && {
                        permanentRemovalNotice: query.permanentRemovalNotice,
                    }),
                ...(typeof query?.storageCapacity !== undefined &&
                    query?.storageCapacity !== null && {
                        storageCapacity: query.storageCapacity,
                    }),
                ...(typeof query?.minMonthlyFee !== undefined &&
                    query?.minMonthlyFee !== null && {
                        minMonthlyFee: query.minMonthlyFee,
                    }),
                ...(typeof query?.storage_types !== undefined &&
                    query?.storage_types !== null && {
                        storage_types: query.storage_types,
                    }),
                ...(typeof query?.storage_features !== undefined &&
                    query?.storage_features !== null && {
                        storage_features: query.storage_features,
                    }),
                ...(typeof query?.storage_securities !== undefined &&
                    query?.storage_securities !== null && {
                        storage_securities: query.storage_securities,
                    }),
                ...(query?.website?.length > 4 &&
                    query?.website?.length < 100 && { website: query.website }),
            }

            updateProvider(JSON.stringify(updateData), (error, body) => {
                if (error) {
                    return setQuery((prevState) => ({
                        ...prevState,
                        loading: false,
                        message: error.message,
                    }))
                }

                setQuery((prevState) => ({
                    ...prevState,
                    ...body,
                    storage_types:
                        body?.storage_types?.length === 0
                            ? []
                            : body?.storage_types?.map((data) =>
                                  String(data.id)
                              ),
                    storage_features:
                        body?.storage_features?.length === 0
                            ? []
                            : body?.storage_features?.map((data) =>
                                  String(data.id)
                              ),
                    storage_securities:
                        body?.storage_securities?.length === 0
                            ? []
                            : body?.storage_securities?.map((data) =>
                                  String(data.id)
                              ),
                    loading: false,
                    message: 'Details updated!',
                }))
            })
        })
    }

    const handleImageDelete = (e) => {
        e.preventDefault()

        const name = e.target.name
        let updateData

        setQuery((prevState) => ({
            ...prevState,
            imagesLoading: true,
            imagesMessage: '',
        }))

        switch (name) {
            case 'logo':
                updateData = { logo: null }
                break
            case 'featured1':
                updateData = {
                    featuredImages:
                        query?.featuredImages?.length < 2
                            ? null
                            : [
                                  query?.featuredImages[1]?.id,
                                  query?.featuredImages[2]?.id,
                              ].filter((data) => !!data),
                }
                break
            case 'featured2':
                updateData = {
                    featuredImages:
                        query?.featuredImages?.length < 2
                            ? null
                            : [
                                  query?.featuredImages[0]?.id,
                                  query?.featuredImages[2]?.id,
                              ].filter((data) => !!data),
                }
                break
            case 'featured3':
                updateData = {
                    featuredImages:
                        query?.featuredImages?.length < 2
                            ? null
                            : [
                                  query?.featuredImages[0]?.id,
                                  query?.featuredImages[1]?.id,
                              ].filter((data) => !!data),
                }
                break
        }

        updateProvider(JSON.stringify(updateData), (error, body) => {
            if (error) {
                return setQuery((prevState) => ({
                    ...prevState,
                    imagesLoading: false,
                    imagesMessage: error.message,
                }))
            }

            setQuery((prevState) => ({
                ...prevState,
                ...body,
                imagesLoading: false,
                imagesMessage: 'Details updated!',
            }))
        })
    }

    const hasPaymentData =
        router.query?.success || router.query?.canceled || router.query?.error

    if (!query.loading && !query.message && hasPaymentData) {
        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            message: '',
        }))
    }

    if (query.loading && !query.message && hasPaymentData) {
        // Strapi callback possibilities.
        if (router.query?.success) {
            fetch(
                `${publicRuntimeConfig.FRONTEND_API_URL}/api/purchased-featured`,
                {
                    method: 'POST',
                    body: JSON.stringify({ secret: router.query.success }),
                    headers: { 'Content-Type': 'application/json' },
                }
            )
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
                            sponsorStart: json[0].sponsorStart,
                            sponsorEnd: json[0].sponsorEnd,
                            loading: false,
                            message: 'Success!',
                        }))

                        window.location.href = `/admin/confirmation?${
                            typeof json === 'object' && json !== null
                                ? JSON.stringify(json)
                                : 'none'
                        }&message=Transaction Confirmed! Now you have all the benefits of a Featured Acccount!`

                        // router.push(
                        //     `/admin/confirmation?${
                        //         typeof json === 'object' && json !== null
                        //             ? JSON.stringify(json)
                        //             : 'none'
                        //     }&message=Transaction Confirmed! Now you have all the benefits of a Featured Acccount!`
                        // )
                    } else {
                        console.log('Debug:', router.query?.success, json)
                        setQuery((prevState) => ({
                            ...prevState,
                            loading: false,
                            message: 'No new purchases.',
                        }))
                    }
                })
        } else if (router.query?.canceled) {
            setQuery((prevState) => ({
                ...prevState,
                loading: false,
                message: 'Payment fail! Contact the support.',
            }))
        } else if (router.query?.error) {
            setQuery((prevState) => ({
                ...prevState,
                loading: false,
                message:
                    router.query?.error === 'invalid_request'
                        ? 'Apologies, there has been an issue. Contact the support.'
                        : router.query?.error,
            }))
        }
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
                    className="modal-dialog modal-dialog-centered modal-lg"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title">Featured Advantages</h6>
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
                            <p>Dear supplier</p>
                            <p>
                                We are always looking for ways to help you stand
                                out for your customers and as such we have build
                                a <b>Featured Listing</b> option for your
                                appearance in the search results.
                            </p>
                            <p>
                                A featured listing includes the following
                                benefits:
                            </p>
                            <ol>
                                <li>
                                    You will have a search result which is
                                    highlighted with colour so that it
                                    immediately stands out.
                                </li>
                                <li>
                                    The search result will be tagged Featured
                                    listing to again add the Car Store Club
                                    support to your result.
                                </li>
                                <li>
                                    There will be a link through to your Public
                                    Profile page where the searcher can find
                                    more detail about your car storage facility.
                                </li>
                                <li>
                                    Your search listing will have a photo of
                                    your choosing vs a generic Car Store logo.
                                </li>
                            </ol>
                            <p>
                                The featured listing can be bought for
                                increments of one week, two weeks or a month.
                                Simply choose the time period you want and pay
                                the fee and your listing will automatically be
                                Featured for that period of time.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <form method="POST" action="/api/checkout-featured">
                                <button
                                    type="submit"
                                    className="btn btn-md btn-secondary ml-auto mr-2"
                                    name="featured"
                                    value="oneWeek"
                                >
                                    <i className="fas fa-shopping-cart"></i> One
                                    Week (£25)
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-md btn-secondary ml-auto mr-2"
                                    name="featured"
                                    value="twoWeek"
                                >
                                    <i className="fas fa-shopping-cart"></i> Two
                                    Weeks (£40)
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-md btn-secondary ml-auto mr-2"
                                    name="featured"
                                    value="oneMonth"
                                >
                                    <i className="fas fa-shopping-cart"></i> One
                                    Month (£70)
                                </button>
                            </form>
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

            <div className="section section-lg bg-gray pt-lg-10 pb-0">
                <div className="container">
                    <div className="row pt-5 pt-md-0">
                        <div className="col-12 col-lg-12">
                            <div className="card card-body bg-light border-light mb-4">
                                <div className="text-right mb-4">
                                    <div className="row">
                                        <div className="col-12 col-md-6 text-left">
                                            {query.loading === true && (
                                                <div>
                                                    <img
                                                        src="/assets/img/loading.gif"
                                                        width="16"
                                                        height="16"
                                                    />{' '}
                                                    Processing
                                                </div>
                                            )}
                                            {query.loading !== true && (
                                                <div className="custom-control custom-switch">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id="customSwitch1"
                                                        name="emailLeads"
                                                        onChange={
                                                            handleEmailLeads
                                                        }
                                                        value={
                                                            query?.emailLeads
                                                        }
                                                        checked={
                                                            query?.emailLeads
                                                        }
                                                    />
                                                    <label
                                                        className={`custom-control-label text-${
                                                            query?.emailLeads
                                                                ? 'success'
                                                                : 'danger'
                                                        }`}
                                                        htmlFor="customSwitch1"
                                                    >
                                                        <i
                                                            className="fas fa-info-circle"
                                                            data-toggle="tooltip"
                                                            data-placement="top"
                                                            title="Use this to turn new lead alert emails on or off"
                                                        />{' '}
                                                        {query?.emailLeads
                                                            ? 'Open'
                                                            : 'Closed'}{' '}
                                                        to receive new leads.
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-12 col-md-6 text-right">
                                            {query.loading === false &&
                                                query.isSponsored && (
                                                    <a className="btn btn-sm btn-outline-success disabled animate-up-2 mr-3">
                                                        Featured from{' '}
                                                        {moment(
                                                            query.sponsorStart
                                                        ).format(
                                                            'DD/MM/YYYY'
                                                        )}{' '}
                                                        to{' '}
                                                        {moment(
                                                            query.sponsorEnd
                                                        ).format('DD/MM/YYYY')}
                                                    </a>
                                                )}
                                            {query.loading === false &&
                                                !query.isSponsored && (
                                                    <a
                                                        data-toggle="modal"
                                                        data-target="#modal-default"
                                                        className="btn btn-sm btn-secondary animate-up-2 mr-3"
                                                    >
                                                        Featured Advantages
                                                    </a>
                                                )}
                                            {query.loading === true && (
                                                <a className="mr-2">
                                                    <img
                                                        src="/assets/img/loading.gif"
                                                        width="16"
                                                        height="16"
                                                    />{' '}
                                                    Processing
                                                </a>
                                            )}
                                            <a
                                                href={`/storage/providers/${
                                                    user?.providerId
                                                }/${convert(
                                                    user?.providerTitle ||
                                                        'provider'
                                                )}`}
                                                className="btn btn-sm btn-primary animate-up-2 mr-3"
                                                target="_blank"
                                            >
                                                View Public Profile
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="mb-3 text-left" title={`Provider ID ${provider.id}`}>
                                    My Company Profile
                                </h4>
                                <p className="mb-6 text-left">
                                    Please edit or populate as much information
                                    as possible so Car Store Club can help
                                    generate the most qualified leads for your
                                    business, some of this information will be
                                    available in your Public Profile that
                                    customers will see.
                                </p>

                                <form onSubmit={formSubmit}>
                                    <div className="row align-items-center">
                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="title">
                                                    Company Name
                                                </label>
                                                <input
                                                    className="form-control"
                                                    id="title"
                                                    type="text"
                                                    name="title"
                                                    onChange={handleParam}
                                                    value={query.title}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-8 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="description">
                                                    Short Description (up to 50
                                                    words)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="description"
                                                    onChange={handleParam}
                                                    value={query.description}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="email">
                                                    Email
                                                </label>
                                                <input
                                                    className="form-control"
                                                    id="email"
                                                    type="text"
                                                    name="email"
                                                    onChange={handleParam}
                                                    value={query.email}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="phone">
                                                    Phone
                                                </label>
                                                <input
                                                    type="string"
                                                    className="form-control"
                                                    name="phone"
                                                    onChange={handleParam}
                                                    value={query.phone}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="website">
                                                    Website
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="website"
                                                    onChange={handleParam}
                                                    value={query.website}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="postcode">
                                                    Postcode{' '}
                                                    <small>
                                                        (not publicly visible)
                                                    </small>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="postcode"
                                                    onChange={handleParam}
                                                    value={query.postcode}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12 mb-6 mt-6">
                                            <h5 className="text-center">
                                                About your Storage facility and
                                                service
                                            </h5>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="temporaryRemovalNotice">
                                                    <i
                                                        className="fas fa-info-circle"
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title="How much notice do you require to remove a vehicle from your facility temporarily eg a weekend."
                                                    />{' '}
                                                    Temporary Removal Notice?
                                                    (hours)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="temporaryRemovalNotice"
                                                    onChange={handleParam}
                                                    value={
                                                        query.temporaryRemovalNotice
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="permanentRemovalNotice">
                                                    <i
                                                        className="fas fa-info-circle"
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title="How much notice do you require to remove a vehicle from your facility permanently eg terminating contract."
                                                    />{' '}
                                                    Permanent Removal Notice?
                                                    (weeks)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="permanentRemovalNotice"
                                                    onChange={handleParam}
                                                    value={
                                                        query.permanentRemovalNotice
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="storageCapacity">
                                                    Storage Vehicle Capacity
                                                    (approx)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="storageCapacity"
                                                    onChange={handleParam}
                                                    value={
                                                        query.storageCapacity
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="minMonthlyFee">
                                                    <i
                                                        className="fas fa-info-circle"
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title="Please enter your preferred, basic or minimum weekly fee"
                                                    />{' '}
                                                    Weekly fee
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    name="minMonthlyFee"
                                                    onChange={handleParam}
                                                    value={query.minMonthlyFee}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="minimumDuration">
                                                    Minimum Storage Duration
                                                    (months)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="minimumDuration"
                                                    onChange={handleParam}
                                                    value={
                                                        query.minimumDuration
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="multipleVehicles">
                                                    Multiple vehicles accepted
                                                </label>
                                                <select
                                                    className="custom-select"
                                                    name="multipleVehicles"
                                                    onChange={handleParam}
                                                    value={
                                                        query.multipleVehicles
                                                    }
                                                >
                                                    <option value={false}>
                                                        No
                                                    </option>
                                                    <option value={true}>
                                                        Yes
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="features">
                                                <i
                                                    className="fas fa-info-circle"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Please tick all that apply"
                                                />{' '}
                                                Available Features
                                            </label>
                                            <div className="form-group multi-select-option">
                                                {features.map((data, index) => (
                                                    <div
                                                        key={index}
                                                        className="pl-4"
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`feature${index}`}
                                                            name="storage_features"
                                                            onChange={
                                                                handleParam
                                                            }
                                                            value={String(
                                                                data.id
                                                            )}
                                                            checked={
                                                                query?.storage_features?.indexOf(
                                                                    String(
                                                                        data.id
                                                                    )
                                                                ) > -1
                                                            }
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={`feature${index}`}
                                                        >
                                                            {data.title}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="types">
                                                <i
                                                    className="fas fa-info-circle"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Please tick all that apply"
                                                />{' '}
                                                Vehicle Types
                                            </label>
                                            <div className="form-group multi-select-option">
                                                {types.map((data, index) => (
                                                    <div
                                                        key={index}
                                                        className="pl-4"
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`type${index}`}
                                                            name="storage_types"
                                                            onChange={
                                                                handleParam
                                                            }
                                                            value={String(
                                                                data.id
                                                            )}
                                                            checked={
                                                                query?.storage_types?.indexOf(
                                                                    String(
                                                                        data.id
                                                                    )
                                                                ) > -1
                                                            }
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={`type${index}`}
                                                        >
                                                            {data.title}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="securities">
                                                <i
                                                    className="fas fa-info-circle"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Please tick all that apply"
                                                />{' '}
                                                Storage Security
                                            </label>
                                            <div className="form-group multi-select-option">
                                                {securities.map(
                                                    (data, index) => (
                                                        <div
                                                            key={index}
                                                            className="pl-4"
                                                        >
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`security${index}`}
                                                                name="storage_securities"
                                                                onChange={
                                                                    handleParam
                                                                }
                                                                value={String(
                                                                    data.id
                                                                )}
                                                                checked={
                                                                    query?.storage_securities?.indexOf(
                                                                        String(
                                                                            data.id
                                                                        )
                                                                    ) > -1
                                                                }
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`security${index}`}
                                                            >
                                                                {data.title}
                                                            </label>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <div className="mt-3 text-center">
                                                {query.loading === true && (
                                                    <p className="m-4">
                                                        <img
                                                            src="/assets/img/loading.gif"
                                                            width="16"
                                                            height="16"
                                                        />{' '}
                                                        Processing
                                                    </p>
                                                )}
                                                {query.loading === false && (
                                                    <button
                                                        className="btn btn-primary btn-block animate-up-2"
                                                        type="submit"
                                                    >
                                                        Save
                                                    </button>
                                                )}
                                                {query.message.length > 0 && (
                                                    <p className="m-4 warning">
                                                        {query.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section section-lg bg-gray pt-0">
                <div className="container">
                    <div className="row pt-5 pt-md-0">
                        <div className="col-12 col-lg-12">
                            <div className="card card-body bg-light border-light mb-4">
                                {query.imagesMessage.length > 0 && (
                                    <p className="m-4 warning text-center">
                                        {query.imagesMessage}
                                    </p>
                                )}

                                {query.imagesLoading === true && (
                                    <p className="m-4 text-center">
                                        <img
                                            src="/assets/img/loading.gif"
                                            width="16"
                                            height="16"
                                        />{' '}
                                        Processing
                                    </p>
                                )}
                                {query.imagesLoading === false && (
                                    <div className="row">
                                        <div
                                            className={`col-12 col-md-${
                                                query.isSponsored ? '6' : '12'
                                            } p-5`}
                                        >
                                            <h2 className="h3 text-center">
                                                Company Logo
                                            </h2>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="profile-image-small fmxw-100 mr-4">
                                                    <img
                                                        className="rounded"
                                                        src={
                                                            query?.logo?.formats
                                                                ?.thumbnail
                                                                ?.url ||
                                                            '/assets/img/home/overlay.jpeg'
                                                        }
                                                        alt={query?.title}
                                                    />
                                                </div>
                                                <div className="custom-file">
                                                    <input
                                                        name="newLogo"
                                                        id="newLogo"
                                                        type="file"
                                                        className="custom-file-input"
                                                        onChange={uploadLogo}
                                                    />
                                                    <label
                                                        className="custom-file-label"
                                                        htmlFor="newLogo"
                                                    >
                                                        Choose file
                                                    </label>
                                                </div>
                                            </div>
                                            <small className="text-gray font-weight-light font-xs d-block pt-5 text-center">
                                                Only *.jpg, *.png and *.jpeg
                                                formats are accepted. |{' '}
                                                <a
                                                    onClick={handleImageDelete}
                                                    name="logo"
                                                >
                                                    [
                                                    <i className="fas fa-trash mr-1"></i>
                                                    Remove]
                                                </a>
                                            </small>
                                        </div>
                                        {query.isSponsored && (
                                            <>
                                                <div className="col-md-6 p-5">
                                                    <h2 className="h3 text-center">
                                                        Featured Image #1
                                                    </h2>
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <div className="profile-image-small fmxw-100 mr-4">
                                                            <img
                                                                className="rounded"
                                                                src={
                                                                    query
                                                                        ?.featuredImages?.[0]
                                                                        ?.formats
                                                                        ?.thumbnail
                                                                        ?.url ||
                                                                    '/assets/img/home/overlay.jpeg'
                                                                }
                                                                alt={
                                                                    query?.title
                                                                }
                                                            />
                                                        </div>
                                                        <div className="custom-file">
                                                            <input
                                                                name="featured1"
                                                                id="featured1"
                                                                type="file"
                                                                className="custom-file-input"
                                                                onChange={
                                                                    uploadFeaturedImage
                                                                }
                                                            />
                                                            <label
                                                                className="custom-file-label"
                                                                htmlFor="featured1"
                                                            >
                                                                Choose file
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <small className="text-gray font-weight-light font-xs d-block pt-5 text-center">
                                                        Only *.jpg, *.png and
                                                        *.jpeg formats are
                                                        accepted. |{' '}
                                                        <a
                                                            onClick={
                                                                handleImageDelete
                                                            }
                                                            name="featured1"
                                                        >
                                                            [
                                                            <i className="fas fa-trash mr-1"></i>
                                                            Remove]
                                                        </a>
                                                    </small>
                                                </div>
                                                <div className="col-md-6 p-5">
                                                    <h2 className="h3 text-center">
                                                        Featured Image #2
                                                    </h2>
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <div className="profile-image-small fmxw-100 mr-4">
                                                            <img
                                                                className="rounded"
                                                                src={
                                                                    query
                                                                        ?.featuredImages?.[1]
                                                                        ?.formats
                                                                        ?.thumbnail
                                                                        ?.url ||
                                                                    '/assets/img/home/overlay.jpeg'
                                                                }
                                                                alt={
                                                                    query?.title
                                                                }
                                                            />
                                                        </div>
                                                        <div className="custom-file">
                                                            <input
                                                                name="featured2"
                                                                id="featured2"
                                                                type="file"
                                                                className="custom-file-input"
                                                                onChange={
                                                                    uploadFeaturedImage
                                                                }
                                                            />
                                                            <label
                                                                className="custom-file-label"
                                                                htmlFor="featured2"
                                                            >
                                                                Choose file
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <small className="text-gray font-weight-light font-xs d-block pt-5 text-center">
                                                        Only *.jpg, *.png and
                                                        *.jpeg formats are
                                                        accepted.
                                                        <a
                                                            onClick={
                                                                handleImageDelete
                                                            }
                                                            name="featured2"
                                                        >
                                                            [
                                                            <i className="fas fa-trash mr-1"></i>
                                                            Remove]
                                                        </a>
                                                    </small>
                                                </div>
                                                <div className="col-md-6 p-5">
                                                    <h2 className="h3 text-center">
                                                        Featured Image #3
                                                    </h2>
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <div className="profile-image-small fmxw-100 mr-4">
                                                            <img
                                                                className="rounded"
                                                                src={
                                                                    query
                                                                        ?.featuredImages?.[2]
                                                                        ?.formats
                                                                        ?.thumbnail
                                                                        ?.url ||
                                                                    '/assets/img/home/overlay.jpeg'
                                                                }
                                                                alt={
                                                                    query?.title
                                                                }
                                                            />
                                                        </div>
                                                        <div className="custom-file">
                                                            <input
                                                                name="featured3"
                                                                id="featured3"
                                                                type="file"
                                                                className="custom-file-input"
                                                                onChange={
                                                                    uploadFeaturedImage
                                                                }
                                                            />
                                                            <label
                                                                className="custom-file-label"
                                                                htmlFor="featured3"
                                                            >
                                                                Choose file
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <small className="text-gray font-weight-light font-xs d-block pt-5 text-center">
                                                        Only *.jpg, *.png and
                                                        *.jpeg formats are
                                                        accepted.
                                                        <a
                                                            onClick={
                                                                handleImageDelete
                                                            }
                                                            name="featured3"
                                                        >
                                                            [
                                                            <i className="fas fa-trash mr-1"></i>
                                                            Remove]
                                                        </a>
                                                    </small>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

Profile.getLayout = function getLayout(page) {
    return <LayoutAdmin user={page.props.user}>{page}</LayoutAdmin>
}

export const getServerSideProps = withSession(async function ({ req, res }) {
    const user = req.session.get('user')

    if (!user) {
        return {
            redirect: {
                destination: `${ADMIN_URL}/login`,
                permanent: false,
            },
        }
    }

    const provider = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}${API_RESOURCE_NAME}/${user.providerId}`
        )
    ).json()

    if (!provider) {
        return {
            redirect: {
                destination: `${ADMIN_URL}/login`,
                permanent: false,
            },
        }
    }

    const features =
        (await (
            await fetch(
                `${serverRuntimeConfig.apiUrl}/storage-features?_sort=order:ASC`
            )
        ).json()) || []

    const types =
        (await (
            await fetch(
                `${serverRuntimeConfig.apiUrl}/storage-types?_sort=order:ASC`
            )
        ).json()) || []

    const securities =
        (await (
            await fetch(
                `${serverRuntimeConfig.apiUrl}/storage-securities?_sort=order:ASC`
            )
        ).json()) || []

    return {
        props: {
            user,
            provider,
            features,
            types,
            securities,
        },
    }
})

export default Profile
