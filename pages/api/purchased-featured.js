import getConfig from 'next/config'
import withSession from '../../lib/session'
import moment from 'moment'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default withSession(async (req, res) => {
    try {
        const { secret } = await req.body
        const currentUser = await req.session.get('user')
        const purchaseDetails = await req.session.get('featured-payment')
        const items = purchaseDetails?.items?.split(',')

        if (secret !== purchaseDetails?.secret) {
            return res.status(400).json({
                error: 'Invalid purchase reference, please contact the support.',
            })
        }

        const provider = await (
            await fetch(
                `${serverRuntimeConfig.apiUrl}/storage-providers/${currentUser?.providerId}`
            )
        ).json()

        if (!provider.id) {
            console.log('Provider:', provider, currentUser)
            return res.status(400).json({
                error: 'Invalid provider! Please contact the support.',
            })
        }

        const stripeProducts = {
            oneWeek: {
                start: moment().format(),
                end: moment().add(1, 'week').format(),
            },
            twoWeek: {
                start: moment().format(),
                end: moment().add(2, 'weeks').format(),
            },
            oneMonth: {
                start: moment().format(),
                end: moment().add(1, 'month').format(),
            },
        }

        // For the moment only allow a single featured setup.
        const result = await (
            await fetch(
                `${serverRuntimeConfig.apiUrl}/storage-providers/${provider.id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        sponsorStart: stripeProducts[items[0]].start,
                        sponsorEnd: stripeProducts[items[0]].end,
                    }),
                    headers: {
                        Authorization: `Bearer ${currentUser.jwt}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
        ).json()

        res.status(200).json([result])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})
