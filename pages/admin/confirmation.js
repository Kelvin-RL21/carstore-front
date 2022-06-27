import getConfig from 'next/config'
import { useState } from 'react'
import { useRouter } from 'next/router'
import LayoutAdmin from '../../components/layoutAdmin'
import withSession from '../../lib/session'
import receipt from '../../lib/receipt'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const ADMIN_URL = '/admin'

const Confirmation = ({ user }) => {
    const router = useRouter()

    const initialState = {
        loading: false,
        message: '',
    }

    const [query, setQuery] = useState(initialState)

    return (
        <section>
            <div className="section section-lg bg-gray pt-10">
                <div className="container">
                    <div className="row pt-5 pt-md-0">
                        <div className="col-12 col-lg-12">
                            <div className="row mb-4 mt-0">
                                <div className="col-12 col-md-12">
                                    <div className="col-12 col-md-12 mb-4">
                                        <div className="card border-light  mb-6">
                                            <div className="card-body bg-light d-block d-md-flex align-items-center">
                                                <div>
                                                    <p className="ml-2 mt-4 mr-4">
                                                        {router.query?.message || 'Success! Operation done, thank you.'}
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
            </div>
        </section>
    )
}

Confirmation.getLayout = function getLayout(page) {
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

    await receipt( { user, query } );

    return {
        props: {
            user,
        },
    }
})

export default Confirmation
