import getConfig from 'next/config'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import withSession from '../../lib/session'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const ADMIN_URL = '/admin'

const titleLogin = 'To log into your account, first enter your email'
const titleReset = 'Please enter your email to receive instructions'
const titleNewPass = 'Now enter your email and the new password'
const titleRegister = 'To register your business, please fill all fields'

const Login = () => {
    const router = useRouter()
    const initialState = {
        email: '',
        pass: '',
        confirmPass: '',
        postcode: '',

        token: router?.query?.code || '',
        showPostcode: false,
        showPassword: !router?.query?.code,
        showResetPass: !!router?.query?.code,
        loading: false,
        error: '',
        formTitle: !!router?.query?.code ? titleNewPass : titleLogin,
    }

    const [query, setQuery] = useState(initialState)

    const handleParam = () => (e) => {
        const name = e.target.name
        let value = e.target.value?.trim()

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

    const validatePassword = (password) => {
        const re =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        return re.test(password)
    }

    const handleShowHideInput = (e) => {
        const name = e.target.name

        setQuery((prevState) => ({
            ...prevState,
            showPostcode: name === 'register',
            showPassword: ['login', 'register'].indexOf(name) > -1,
            showResetPass: name === 'reset' && query.token,
            formTitle:
                name === 'login'
                    ? titleLogin
                    : name === 'reset'
                        ? titleReset
                        : titleRegister,
        }))
    }

    const formSubmit = (e) => {
        e.preventDefault()

        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            error: '',
        }))

        if (!validateEmail(query.email) || !validatePassword(query.pass)) {
            return setQuery((prevState) => ({
                ...prevState,
                loading: false,
                error: 'Please provide a valid Email and Password!',
            }))
        }

        /**
         * test supplier. 16/09/2021
         * email: suppliertest@test.com
         * pass: suppliertest
         */
        fetch(`/api/login`, {
            method: 'POST',
            body: JSON.stringify({
                identifier: query.email,
                password: query.pass,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((json) => {
                if (!json?.error) {
                    window.location.href = `${ADMIN_URL}/leads`
                    // router.push(`${ADMIN_URL}/leads`)
                }

                setQuery((prevState) => ({
                    ...prevState,
                    loading: false,
                    error: json?.error || '',
                }))
            })
            .catch((error) => {
                console.log(error.message)
                setQuery((prevState) => ({
                    ...prevState,
                    loading: false,
                    error: 'Sorry, there has been an error. Contact the support.',
                }))
            })
    }

    const handleReset = (e) => {
        e.preventDefault()

        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            error: '',
        }))

        if (!validateEmail(query.email)) {
            return setQuery((prevState) => ({
                ...prevState,
                loading: false,
                error: 'Please provide a valid Email!',
            }))
        }

        if (
            query?.token &&
            (!validatePassword(query.pass) || query.pass !== query.confirmPass)
        ) {
            return setQuery((prevState) => ({
                ...prevState,
                loading: false,
                error: 'Please provide a valid Password!',
            }))
        }

        fetch(`/api/reset`, {
            method: 'POST',
            body: JSON.stringify({
                email: query.email,
                pass: query.pass,
                token: query.token,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((json) => {
                setQuery((prevState) => ({
                    ...prevState,
                    loading: false,
                    error:
                        json?.error ||
                        (query?.token
                            ? 'Success! you can login using your new password now.'
                            : 'Please check your email to continue.'),
                }))

                if (json?.jwt) {
                    window.location.href = `${ADMIN_URL}/leads`
                    // router.push(`${ADMIN_URL}/leads`)
                }
            })
            .catch((error) => {
                console.log(error.message)
                setQuery((prevState) => ({
                    ...prevState,
                    loading: false,
                    error: 'Sorry, there has been an error. Contact the support.',
                }))
            })
    }

    const handleRegister = (e) => {
        e.preventDefault()

        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            error: '',
        }))

        const issues = []

        if (!validateEmail(query.email)) {
            issues.push('Email')
        }

        if (!validatePassword(query.pass)) {
            issues.push(
                'Password (min 8 characters with special chars and uppercase letters)'
            )
        }

        if (!query.postcode || query.postcode.length < 3) {
            issues.push('Postcode')
        }

        if (issues.length) {
            return setQuery((prevState) => ({
                ...prevState,
                loading: false,
                error: `Please provide a valid ${issues.join(', ')}`,
            }))
        }

        fetch(
            `${publicRuntimeConfig.postcodeServiceUrl}/${query.postcode.replace(
                / /gi,
                ''
            )}`
        )
            .then((res) => res.json())
            .then((json) => {
                if (!json.result) {
                    return setQuery((prevState) => ({
                        ...prevState,
                        loading: false,
                        error: 'Invalid Postcode, please review and try again.',
                    }))
                }

                fetch(`/api/register`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: query.email,
                        password: query.pass,
                        postcode: query.postcode,
                        latitude: json.result.latitude,
                        longitude: json.result.longitude,
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then((res) => res.json())
                    .then((json) => {
                        setQuery((prevState) => ({
                            ...prevState,
                            loading: false,
                            error:
                                json?.error ||
                                'Success! please check your email to complete the registration.',
                        }))
                    })
                    .catch((error) => {
                        setQuery((prevState) => ({
                            ...prevState,
                            loading: false,
                            error: 'Sorry, there has been an error. Contact the support.',
                        }))
                    })
            })
    }

    return (
        <section>
            <section className="section section-lg">
                <div className="container pt-6">
                    <div className="row justify-content-center">
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <div className="signin-inner mt-3 mt-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                                {query.loading === true && (
                                    <p className="m-4 pt-6 pb-6 text-center">
                                        <img
                                            src="/assets/img/loading.gif"
                                            width="16"
                                            height="16"
                                        />{' '}
                                        Processing
                                    </p>
                                )}
                                {query.loading === false && (
                                    <>
                                        {query.error && (
                                            <div className="form-group pb-2">
                                                <div className="form-group text-danger text-center h5">
                                                    {query.error}
                                                </div>
                                            </div>
                                        )}

                                        <form onSubmit={formSubmit}>
                                            <div className="login-form-inputs">
                                                <h6 className="text-center mb-4">
                                                    {query.formTitle}
                                                </h6>
                                                <div className="form-group">
                                                    <div className="input-group mb-4">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">
                                                                <span className="fas fa-envelope"></span>
                                                            </span>
                                                        </div>
                                                        <input
                                                            className="form-control"
                                                            id="email"
                                                            placeholder="example@company.com"
                                                            type="text"
                                                            aria-label="email address"
                                                            name="email"
                                                            onChange={handleParam()}
                                                            value={query.email}
                                                        />
                                                    </div>
                                                </div>
                                                {query.showPassword && (
                                                    <div className="form-group">
                                                        <div className="form-group">
                                                            <div className="input-group mb-4">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">
                                                                        <span className="fas fa-unlock-alt"></span>
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    className="form-control"
                                                                    id="password"
                                                                    placeholder="Password"
                                                                    type="password"
                                                                    aria-label="Password"
                                                                    name="pass"
                                                                    onChange={handleParam()}
                                                                    value={
                                                                        query.pass
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {query.showResetPass && (
                                                    <>
                                                        <div className="form-group">
                                                            <div className="form-group">
                                                                <div className="input-group mb-4">
                                                                    <div className="input-group-prepend">
                                                                        <span className="input-group-text">
                                                                            <span className="fas fa-unlock-alt"></span>
                                                                        </span>
                                                                    </div>
                                                                    <input
                                                                        className="form-control"
                                                                        id="password"
                                                                        placeholder="Password"
                                                                        type="password"
                                                                        aria-label="Password"
                                                                        name="pass"
                                                                        onChange={handleParam()}
                                                                        value={
                                                                            query.pass
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="form-group">
                                                                <div className="input-group mb-4">
                                                                    <div className="input-group-prepend">
                                                                        <span className="input-group-text">
                                                                            <span className="fas fa-unlock-alt"></span>
                                                                        </span>
                                                                    </div>
                                                                    <input
                                                                        className="form-control"
                                                                        id="confirmPass"
                                                                        placeholder="Confirm Password"
                                                                        type="password"
                                                                        aria-label="Confirm Password"
                                                                        name="confirmPass"
                                                                        onChange={handleParam()}
                                                                        value={
                                                                            query.confirmPass
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {query.showPostcode && (
                                                    <div className="form-group">
                                                        <div className="form-group">
                                                            <div className="input-group mb-4">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">
                                                                        <span className="fas fa-map-marker-alt"></span>
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    className="form-control"
                                                                    id="postcode"
                                                                    placeholder="Business Postcode"
                                                                    type="text"
                                                                    aria-label="postcode"
                                                                    name="postcode"
                                                                    onChange={handleParam()}
                                                                    value={
                                                                        query.postcode
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="row justify-content-center">
                                                    <div className="col-12 col-md-auto text-center p-1">
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm btn-block ${query?.showResetPass
                                                                    ? 'btn-primary'
                                                                    : 'btn-outline-gray'
                                                                } mr-4`}
                                                            onClick={handleReset}
                                                            onMouseOver={
                                                                handleShowHideInput
                                                            }
                                                            name="reset"
                                                        >
                                                            Reset Password
                                                        </button>
                                                    </div>
                                                    <div className="col-12 col-md-auto text-center p-1">
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm btn-block btn-outline-gray mr-4`}
                                                            onClick={handleRegister}
                                                            onMouseOver={
                                                                handleShowHideInput
                                                            }
                                                            name="register"
                                                        >
                                                            Register
                                                        </button>
                                                    </div>
                                                    <div className="col-12 col-md-auto text-center p-1">
                                                        <button
                                                            type="submit"
                                                            className={`btn btn-sm btn-block ${query?.showResetPass
                                                                    ? 'btn-outline-gray'
                                                                    : 'btn-primary'
                                                                }`}
                                                            onMouseOver={
                                                                handleShowHideInput
                                                            }
                                                            name="login"
                                                        >
                                                            Login
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className='pt-lg-2 text-center'>
                                                <small>
                                                                    Your personal data will be processed in accordance with our <a
                                                                        href="/pages/10/privacy-policy"
                                                                        target="_blank"
                                                                    >
                                                                        privacy policy page
                                                                    </a>
                                                                </small>
                                                </div>
                                        </form>
                                        {/* <div className="d-block d-sm-flex justify-content-center align-items-center mt-4">
                                            <span className="font-weight-normal">
                                                <a
                                                    className="font-weight-bold"
                                                    onClick={handleReset}
                                                    onMouseOver={
                                                        handleShowHideInput
                                                    }
                                                    name="reset"
                                                    value={true}
                                                >
                                                    {' '}
                                                    Reset Password
                                                </a>{' '}
                                                |{' '}
                                                <a
                                                    className="font-weight-bold"
                                                    onClick={handleRegister}
                                                    onMouseOver={
                                                        handleShowHideInput
                                                    }
                                                    name="register"
                                                    value={true}
                                                >
                                                    {' '}
                                                    Create Account
                                                </a>
                                            </span>
                                        </div> */}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}

Login.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export const getServerSideProps = withSession(async function ({ req, res }) {
    const user = req.session.get('user')

    if (user) {
        return {
            redirect: {
                destination: `${ADMIN_URL}/leads`,
                permanent: false,
            },
        }
    }

    return {
        props: {},
    }
})

export default Login
