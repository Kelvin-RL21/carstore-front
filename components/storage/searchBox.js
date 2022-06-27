import { useState } from 'react'
const SearchBox = ({ types, features, router, publicRuntimeConfig }) => {
    console.log('newLead--------------------1---------------------')

    const initialState = {
        postcode: router.query?.postcode || '',
        maxDistance: '',
        startPeriod: '',
        duration: '',

        multipleVehicles: null,
        storage_types: ['55'],
        storage_features: ['36'],
        observations: '',
        name: '',
        email: '',
        phone: '',

        loading: false,
        error: '',
    }

    const [query, setQuery] = useState(initialState)
    console.log('query------------------',query);
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

        fetch(
            `${publicRuntimeConfig.postcodeServiceUrl}/${query.postcode.replace(
                / /gi,
                ''
            )}`
        )
            .then((res) => {
                res.json();
                console.log('aaaaaaaaaaaaaaaaaaa')
            })
            .then((json) => {
                if (!json.result) {
                    setQuery((prevState) => ({
                        ...prevState,
                        loading: false,
                        error: 'Invalid Postcode, please review and try again.',
                    }))
                    return
                }

                query.latitude = json.result.latitude
                query.longitude = json.result.longitude

                const newLead = { ...query }
                delete newLead.loading
                delete newLead.error
                console.log('Heeeeeeeeeeeeeeeeeeeeeeeeeeeee-------------------')
                fetch(`${publicRuntimeConfig.apiUrl}/storage-leads`, {
                    method: 'POST',
                    body: JSON.stringify(newLead),
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then((res) => res.json())  
                    .then((json) => {
                        console.log('${json.id}-----------------')
                        router.push(`/storage/results/${json.id}`)
                    })
            })
    }

    return (
        <div className="section section-md pt-0 pb-4">
            <div className="container mt-n8">
                <div className="row">
                    <div className="col-12">
                        <div className="card border-light p-md-2">
                            <div className="card-body p-4">
                                <form onSubmit={formSubmit}>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <h6 className="text-left mb-4">
                                                        1/3 - Please tell us
                                                        about your storage
                                                        location preferences. 
                                                        <br/><small className='text-danger'>All fields are required. Please use a full UK Postcode.</small>
                                                    </h6>
                                                </div>
                                                <div className="col-12 col-lg-6">
                                                    <div className="form-group form-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text">
                                                                    <span className="fas fa-map-marker-alt"></span>
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="Postcode"
                                                                className={`form-control autocomplete ${query.postcode && query.postcode?.length > 3 ? 'is-valid' : 'is-invalid' }`}
                                                                name="postcode"
                                                                onChange={handleParam()}
                                                                value={
                                                                    query.postcode
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6">
                                                    <div className="input-group input-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-location-arrow"></span>
                                                            </span>
                                                        </div>
                                                        <select
                                                            className={`custom-select ${query.maxDistance ? 'is-valid' : 'is-invalid'}`}
                                                            name="maxDistance"
                                                            onChange={handleParam()}
                                                            value={
                                                                query.maxDistance
                                                            }
                                                        >
                                                            <option value="">
                                                                Storage
                                                                Proximity
                                                            </option>
                                                            <option value="20">
                                                                Within 20 Miles
                                                            </option>
                                                            <option value="50">
                                                                Within 50 Miles
                                                            </option>
                                                            <option value="100">
                                                                Don’t mind
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6">
                                                    <div className="input-group input-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-calendar-alt"></span>
                                                            </span>
                                                        </div>
                                                        <select
                                                            className={`custom-select ${query.duration ? 'is-valid' : 'is-invalid'}`}
                                                            name="duration"
                                                            onChange={handleParam()}
                                                            value={
                                                                query.duration
                                                            }
                                                        >
                                                            <option value="">
                                                                Length of
                                                                Storage
                                                            </option>
                                                            <option value="2">
                                                                Up to 2 Months
                                                            </option>
                                                            <option value="6">
                                                                3 - 6 Months
                                                            </option>
                                                            <option value="12">
                                                                7 - 12 Months
                                                            </option>
                                                            <option value="13">
                                                                12 + Months
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6">
                                                    <div className="input-group input-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-clock"></span>
                                                            </span>
                                                        </div>
                                                        <select
                                                            className={`custom-select ${query.startPeriod ? 'is-valid' : 'is-invalid'}`}
                                                            name="startPeriod"
                                                            onChange={handleParam()}
                                                            value={
                                                                query.startPeriod
                                                            }
                                                        >
                                                            <option value="">
                                                                When do you
                                                                require storage?
                                                            </option>
                                                            <option value="week">
                                                                This Week
                                                            </option>
                                                            <option value="month">
                                                                This Month
                                                            </option>
                                                            <option value="within 6 months">
                                                                Within 6 Months
                                                            </option>
                                                            <option value="year">
                                                                This Year
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <hr />
                                                    <h6 className="text-left mb-4">
                                                        2/3 - Now
                                                        enter the
                                                        vehicle
                                                        details.
                                                        <br/><small className='text-danger'>Please amend to suit your requirement.</small>
                                                    </h6>
                                                </div>
                                                <div className="col-12 col-lg-6">
                                                    <div className="card border-light mb-lg-0 mt-3 p-3">
                                                        <a
                                                            href="#"
                                                            data-target="#vehicle"
                                                            className="accordion-panel-header w-100 d-flex align-items-center justify-content-between collapsed"
                                                            data-toggle="collapse"
                                                            role="button"
                                                            aria-expanded="false"
                                                            aria-controls="reviews"
                                                        >
                                                            <span className="icon-title h6 mb-0 font-weight-bold">
                                                                Type
                                                                of
                                                                Vehicle
                                                            </span>
                                                        </a>
                                                        <ul
                                                            id="vehicle"
                                                            className="list-group list-group list-group-flush pt-2"
                                                        >
                                                            {types?.map(
                                                                (
                                                                    type,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="list-group-item border-0 py-1 pt-2 px-0 d-flex align-items-center justify-content-between"
                                                                    >
                                                                        <div className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id={`vehicleCheck${index}`}
                                                                                name="storage_types"
                                                                                onChange={handleParam()}
                                                                                value={String(
                                                                                    type.id
                                                                                )}
                                                                                checked={
                                                                                    query.storage_types.indexOf(
                                                                                        String(
                                                                                            type.id
                                                                                        )
                                                                                    ) >
                                                                                    -1
                                                                                }
                                                                            />
                                                                            <label
                                                                                className="form-check-label"
                                                                                htmlFor={`vehicleCheck${index}`}
                                                                            >
                                                                                {
                                                                                    type.title
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6">
                                                    <div className="card border-light mb-lg-0 mt-3 p-3">
                                                        <a
                                                            href="#"
                                                            data-target="#storage"
                                                            className="accordion-panel-header w-100 d-flex align-items-center justify-content-between collapsed"
                                                            data-toggle="collapse"
                                                            role="button"
                                                            aria-expanded="false"
                                                            aria-controls="reviews"
                                                        >
                                                            <span className="icon-title h6 mb-0 font-weight-bold">
                                                                Storage
                                                                Preferences
                                                            </span>
                                                        </a>
                                                        <ul
                                                            id="storage"
                                                            className="list-group list-group list-group-flush pt-2"
                                                        >
                                                            {features?.map(
                                                                (
                                                                    feature,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="list-group-item border-0 py-1 pt-2 px-0 d-flex align-items-center justify-content-between"
                                                                    >
                                                                        <div className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id={`featureCheck${index}`}
                                                                                name="storage_features"
                                                                                onChange={handleParam()}
                                                                                value={String(
                                                                                    feature.id
                                                                                )}
                                                                                checked={
                                                                                    query.storage_features.indexOf(
                                                                                        String(
                                                                                            feature.id
                                                                                        )
                                                                                    ) >
                                                                                    -1
                                                                                }
                                                                            />
                                                                            <label
                                                                                className="form-check-label"
                                                                                htmlFor={`featureCheck${index}`}
                                                                            >
                                                                                {
                                                                                    feature.title
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6">
                                                    <div className="input-group input-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-ruler"></span>
                                                            </span>
                                                        </div>
                                                        <select
                                                            className={`custom-select ${query.multipleVehicles !== null ? 'is-valid' : 'is-invalid'}`}
                                                            name="multipleVehicles"
                                                            onChange={handleParam()}
                                                            value={
                                                                query.multipleVehicles
                                                            }
                                                        >
                                                            <option value="">
                                                                Single
                                                                or
                                                                multiple
                                                                vehicles
                                                            </option>
                                                            <option
                                                                value={
                                                                    false
                                                                }
                                                            >
                                                                Single Vehicle
                                                            </option>
                                                            <option
                                                                value={
                                                                    true
                                                                }
                                                            >
                                                                Multiple Vehicles
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-6">
                                                    <div className="form-group form-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text">
                                                                    <span className="fas fa-comment-dots"></span>
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className={`form-control autocomplete ${query.observations ? 'is-valid' : 'is-invalid'}`}
                                                                placeholder="Make, Model and year of vehicle(s) to be stored."
                                                                required={
                                                                    true
                                                                }
                                                                name="observations"
                                                                value={
                                                                    query.observations
                                                                }
                                                                onChange={handleParam()}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <hr />
                                                    <h6 className="text-left mb-4">
                                                        3/3 -
                                                        Please
                                                        confirm your
                                                        details
                                                    </h6>
                                                </div>
                                                <div className="col-12 col-lg-4">
                                                    <div className="form-group form-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text">
                                                                    <span className="fas fa-user"></span>
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className={`form-control autocomplete ${query.name ? 'is-valid' : 'is-invalid'}`}
                                                                placeholder="Full Name"
                                                                required={
                                                                    true
                                                                }
                                                                name="name"
                                                                onChange={handleParam()}
                                                                value={
                                                                    query.name
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-4">
                                                    <div className="form-group form-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text">
                                                                    <span className="fas fa-at"></span>
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="email"
                                                                className={`form-control autocomplete ${query.email ? 'is-valid' : 'is-invalid'}`}
                                                                placeholder="Email Address"
                                                                required={
                                                                    true
                                                                }
                                                                name="email"
                                                                onChange={handleParam()}
                                                                value={
                                                                    query.email
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-4">
                                                    <div className="form-group form-group-lg mb-lg-0 mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text">
                                                                    <span className="fas fa-mobile-alt"></span>
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                className={`form-control autocomplete ${query.phone ? 'is-valid' : 'is-invalid'}`}
                                                                placeholder="Mobile Number"
                                                                name="phone"
                                                                onChange={handleParam()}
                                                                value={
                                                                    query.phone
                                                                }
                                                                required={
                                                                    true
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-12 mt-4 text-center">
                                                    {query.loading ===
                                                        true && (
                                                            <p className="m-4">
                                                                <img
                                                                    src="/assets/img/loading.gif"
                                                                    width="16"
                                                                    height="16"
                                                                />{' '}
                                                                Processing
                                                            </p>
                                                        )}
                                                    {query.loading ===
                                                        false && (
                                                            <div className="pt-md-4">
                                                                <small className='text-warning'>Adjust the search criteria and provide a full valid UK postcode to improve the results.</small>
                                                                <br /><br />
                                                                <button
                                                                    className="btn btn-secondary btn-block animate-up-2"
                                                                    type="submit"
                                                                >
                                                                    Find my space
                                                                </button>
                                                            </div>
                                                        )}
                                                    {query.error
                                                        .length >
                                                        0 && (
                                                            <p className="m-4 warning">
                                                                {
                                                                    query.error
                                                                }
                                                            </p>
                                                        )}
                                                    
                                                    <div className='mt-2 mt-lg-6 text-gray'>
                                                    <small>
                                                        By clicking
                                                        on{' '}
                                                        <b>
                                                            search
                                                        </b>{' '}
                                                        you are
                                                        automatically
                                                        accepting
                                                        our{' '}
                                                        <a
                                                            href="/pages/7/terms-and-conditions"
                                                            target="_blank"
                                                        >
                                                            <b>
                                                                terms
                                                                and
                                                                conditions.
                                                            </b>
                                                        </a>
                                                    </small>
                                                    <br />
                                                    <small>
                                                        Your personal data will be processed in accordance with our <a
                                                            href="/pages/10/privacy-policy"
                                                            target="_blank"
                                                        >
                                                            privacy policy page
                                                        </a>
                                                    </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBox
