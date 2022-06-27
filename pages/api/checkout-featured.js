import getConfig from 'next/config'
import withSession from '../../lib/session'
import { v4 as uuidv4 } from 'uuid'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const stripe = require('stripe')(serverRuntimeConfig.STRIPE_SECRET_KEY)

export default withSession(async (req, res) => {
    try {
        const { featured } = await req.body
        const items = featured?.split(',')
        const currentUser = await req.session.get('user')

        if (
            req.method === 'POST' &&
            items?.length &&
            currentUser?.providerEmail &&
            currentUser?.providerId
        ) {
            const secret = uuidv4()

            await req.session.set('featured-payment', {
                secret: secret,
                items: featured,
            })

            await req.session.save()

            const stripeProducts = {
                oneWeek: 'STRIPE_PRODUCT_FEATURED_ONE_WEEK',
                twoWeek: 'STRIPE_PRODUCT_FEATURED_TWO_WEEK',
                oneMonth: 'STRIPE_PRODUCT_FEATURED_ONE_MONTH',
            }

            const lineItems = items.map((item) => ({
                price: serverRuntimeConfig[stripeProducts[item]],
                quantity: 1,
            }))

            const session = await stripe.checkout.sessions.create({
                metadata: {
                    purchasedItems: JSON.stringify(items),
                    providerId: currentUser?.providerId,
                },
                customer_email: currentUser?.providerEmail,
                line_items: lineItems,
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: `${serverRuntimeConfig.FRONTEND_API_URL}/admin/profile?success=${secret}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${serverRuntimeConfig.FRONTEND_API_URL}/admin/profile?canceled=true`,
            })

            res.redirect(303, session.url)
        } else {
            console.log(
                'invalid_request',
                featured,
                req.method,
                items,
                JSON.stringify(currentUser || {})
            )
            res.redirect(
                303,
                `${serverRuntimeConfig.FRONTEND_API_URL}/admin/profile?error=invalid_request`
            )
        }
    } catch (err) {
        console.log(err)
        res.redirect(
            303,
            `${serverRuntimeConfig.FRONTEND_API_URL}/admin/profile?error=${err.message}`
        )
    }
})
