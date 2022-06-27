import getConfig from 'next/config'
import withSession from '../../lib/session'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default withSession(async (req, res) => {
    const { email, pass, token } = await req.body

    if (!pass && !token && email) {
        const forgotResponse = await (
            await fetch(`${serverRuntimeConfig.apiUrl}/auth/forgot-password`, {
                method: 'POST',
                body: JSON.stringify({ email: email }),
                headers: { 'Content-Type': 'application/json' },
            })
        ).json()

        console.log(JSON.stringify(forgotResponse))
        return res.status(200).json(forgotResponse)
    }

    if (pass && token) {
        const resetResponse = await (
            await fetch(`${serverRuntimeConfig.apiUrl}/auth/reset-password`, {
                method: 'POST',
                body: JSON.stringify({
                    code: token,
                    password: pass,
                    passwordConfirmation: pass,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        ).json()

        if (resetResponse?.jwt) {
            if (!resetResponse?.user?.storage_provider?.id) {
                return res.status(400).json({
                    error: 'No provider connected, please contact the support!',
                })
            } else {
                req.session.set('user', {
                    jwt: resetResponse.jwt,
                    id: resetResponse.user.id,
                    name: 'User Name Here ', //@todo include name from back-end
                    providerId: resetResponse.user.storage_provider.id,
                    providerTitle: resetResponse.user.storage_provider.title,
                })
                await req.session.save()
                return res.status(200).json(resetResponse)
            }
        }

        console.log(JSON.stringify(resetResponse))
        return res.status(200).json(resetResponse)
    }

    console.log(JSON.stringify({ email, pass, token }))
    res.status(200).json({
        error: 'No token or email to reset password, contact the support!',
    })
})
