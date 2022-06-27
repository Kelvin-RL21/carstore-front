import Layout from '../components/layout'
import { useState } from 'react'
import Script from 'next/script'
import Head from 'next/head'

export default function Contact() {
    const initialState = {
        name: '',
        email: '',
        phone: '',
        text: '',
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

        if (!validateEmail(query?.email)) {
            setQuery((prevState) => ({
                ...prevState,
                loading: false,
                message: 'Please provide a valid email!',
            }))
        }

        if (query?.name?.length <= 3) {
            setQuery((prevState) => ({
                ...prevState,
                loading: false,
                message: 'Please provide a valid name!',
            }))
        }

        if (query?.text?.length <= 20) {
            setQuery((prevState) => ({
                ...prevState,
                loading: false,
                message:
                    'Please provide a valid message (at least 20 characters long)!',
            }))
        }

        console.log(query)
        if (!query?.message) {
            fetch(`/api/contact`, {
                method: 'POST',
                body: JSON.stringify(query),
                headers: { 'Content-Type': 'application/json' },
            })
                .then((res) => res.json())
                .then((json) => {
                    setQuery((prevState) => ({
                        ...prevState,
                        name: '',
                        email: '',
                        phone: '',
                        text: '',
                        loading: false,
                        message: json.error || 'Thank you!',
                    }))
                })
        }
    }

    return (
        <section>
             <Script 
                    strategy='lazyOnload' 
                    id='ga-adwords-contact'>
                    {
                        `gtag('event', 'conversion', {'send_to': 'AW-10828018147/O1-CCOKOmIsDEOPjmaso'});`
                    }
                </Script>
            <section
                className="section section-header section-image bg-primary overlay-primary text-white pt-8 pb-2 pb-md-2"
                data-background="/assets/img/home/banner-contact.jpg"
            >
                <div className="container">
                    <div className="row justify-content-center mt-6 mb-6">
                        <div className="col-12 col-xl-8 text-center">
                            <h1 className="display-2">Get in touch</h1>
                            <p className="lead">
                                We are happy to hear from you
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-lg pt-4 pb-0">
                <div className="container">
                    <form onSubmit={formSubmit}>
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-10 col-lg-8">
                                <div className="card border-0 p-2 p-md-3">
                                    <div className="card-body px-0">
                                        <div className="row justify-content-center">
                                            <div className="col-12">
                                                <div className="card border-0 p-0 p-md-5">
                                                    <div className="card-header text-center p-0 pb-5">
                                                        <h2>
                                                            You can contact us
                                                            direct
                                                        </h2>
                                                    </div>
                                                    {query.message && (
                                                        <p className="text-center p-2">
                                                            <span className="fas fa-info pr-2"></span>{' '}
                                                            {query.message}
                                                        </p>
                                                    )}
                                                    <div className="card-body p-0">
                                                        <div className="form-group">
                                                            <label htmlFor="name">
                                                                Your Name
                                                            </label>
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
                                                                    required
                                                                    name="name"
                                                                    onChange={handleParam()}
                                                                    value={
                                                                        query.name
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="email">
                                                                Your Email
                                                            </label>
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
                                                                    required
                                                                    name="email"
                                                                    onChange={handleParam()}
                                                                    value={
                                                                        query.email
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="phone">
                                                                Your Phone
                                                                Number
                                                            </label>
                                                            <div className="input-group mb-4">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">
                                                                        <span className="fa fa-mobile-alt"></span>
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    className="form-control"
                                                                    id="phone"
                                                                    placeholder="000000000"
                                                                    type="phone"
                                                                    aria-label="contact phone input"
                                                                    name="phone"
                                                                    onChange={handleParam()}
                                                                    value={
                                                                        query.phone
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="message">
                                                                Your message
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                placeholder="Enter your message..."
                                                                id="text"
                                                                rows="4"
                                                                required
                                                                name="text"
                                                                onChange={handleParam()}
                                                                value={
                                                                    query.text
                                                                }
                                                            ></textarea>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-block rounded btn-primary"
                                                        >
                                                            Send message
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </section>
    )
}

Contact.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
