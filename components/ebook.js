import { useState } from 'react'
import getConfig from 'next/config'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

const Ebook = ({ router, feature }) => {
    const initialState = {
        name: '',
        email: '',
        loading: false,
        message: '',
    }

    const [query, setQuery] = useState(initialState)

    const handleParam = () => (e) => {
        const name = e.target.name
        const value = e.target.value

        setQuery((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const validateEmail = (email) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    }

    const formSubmit = (e) => {
        e.preventDefault()

        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            message: '',
        }))

        if (!validateEmail(query.email)) {
            setQuery((prevState) => ({
                ...prevState,
                loading: false,
                message: 'Please provide a valid email!',
            }))
        }

        if (query.name <= 3) {
            setQuery((prevState) => ({
                ...prevState,
                loading: false,
                message: 'Please provide a valid name!',
            }))
        }

        fetch(`/api/subscribe`, {
            method: 'POST',
            body: JSON.stringify({...query, destination: feature?.emailDestination}),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((json) => {
                if (!feature?.media?.url) {
                    setQuery((prevState) => ({
                        ...prevState,
                        loading: false,
                        message: 'Sorry, there is no file to download yet. Please get in touch.',
                    }))
                }

                // setQuery((prevState) => ({
                //     ...prevState,
                //     loading: false,
                //     message: json.error || 'Thank you!',
                // }))

                window.location.href = `/confirmation?feature=${feature.id}&message=Thank you ${query?.name || 'Visitor'}!`
            })
    }

    return (
        <section className="section section-lg pb-0 mb-0 pt-0 mt-0">
            <div className="container">
                <div className="row mb-6">
                    <div className="col-md-12">
                        <hr className="pt-4 pb-2" />
                        {query.message && (
                            <p className="text-center pb-4">
                                <span className="fas fa-info pr-2"></span>{' '}
                                {query.message}
                            </p>
                        )}
                        <h2 className="text-center pb-4">
                            {feature.Title}
                        </h2>
                        <div className="card-body p-0">
                            <form onSubmit={formSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <div className="input-group mb-4">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <span className="far fa-user-circle"></span>
                                                    </span>
                                                </div>
                                                <input
                                                    className="form-control"
                                                    id="name"
                                                    placeholder="e.g. John Doe"
                                                    type="text"
                                                    aria-label="contact name input"
                                                    name="name"
                                                    onChange={handleParam()}
                                                    value={
                                                        query.name
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <div className="input-group mb-4">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <span className="far fa-envelope"></span>
                                                    </span>
                                                </div>
                                                <input
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="example@company.com"
                                                    type="email"
                                                    aria-label="contact email input"
                                                    name="email"
                                                    onChange={handleParam()}
                                                    value={
                                                        query.email
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-block rounded btn-primary"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Ebook
