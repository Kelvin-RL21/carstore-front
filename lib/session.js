import getConfig from 'next/config'
import { withIronSession } from 'next-iron-session'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default function withSession(handler) {
    return withIronSession(handler, {
        password: serverRuntimeConfig.sessionSecret,
        cookieName: 'next.js/examples/with-iron-session',
        cookieOptions: {
            // the next line allows to use the session in non-https environments like
            // Next.js dev mode (http://localhost:3000)
            secure: serverRuntimeConfig.envName === 'production' ? true : false,
        },
    })
}
