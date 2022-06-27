import getConfig from 'next/config'
import withSession from '../../lib/session'
import { v4 as uuidv4 } from 'uuid'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const stripe = require('stripe')(serverRuntimeConfig.STRIPE_SECRET_KEY)

export default withSession(async (req, res) => {
    try {
        const { leads } = await req.body
        const leadsObject = leads?.split(',')
        const currentUser = await req.session.get('user')

        if (
            req.method === 'POST' &&
            leadsObject?.length &&
            currentUser?.providerEmail &&
            currentUser?.providerId
        ) {
            const secret = uuidv4()

            await req.session.set('payment', {
                secret: secret,
                leads: leads,
            })

            await req.session.save()

            const session = await stripe.checkout.sessions.create({
                metadata: {
                    purchasedLeads: JSON.stringify(leadsObject),
                    providerId: currentUser?.providerId,
                },
                customer_email: currentUser?.providerEmail,
                line_items: [
                    {
                        price: serverRuntimeConfig.STRIPE_PRODUCT_STANDARD_LEAD,
                        quantity: leadsObject?.length,
                    },
                ],
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: `${serverRuntimeConfig.FRONTEND_API_URL}/admin/leads?success=${secret}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${serverRuntimeConfig.FRONTEND_API_URL}/admin/leads?canceled=true`,
            })

            res.redirect(303, session.url)
        } else {
            console.log(
                'invalid_request',
                leads,
                req.method,
                leadsObject,
                JSON.stringify(currentUser || {})
            )
            res.redirect(
                303,
                `${serverRuntimeConfig.FRONTEND_API_URL}/admin/leads?error=invalid_request`
            )
        }
    } catch (err) {
        console.log(err)
        res.redirect(
            303,
            `${serverRuntimeConfig.FRONTEND_API_URL}/admin/leads?error=${err.message}`
        )
    }
})
