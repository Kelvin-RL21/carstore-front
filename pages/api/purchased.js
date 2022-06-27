import getConfig from 'next/config'
import withSession from '../../lib/session'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default withSession(async (req, res) => {
    try {
        const { secret } = await req.body
        const currentUser = await req.session.get('user')
        const purchaseDetails = await req.session.get('payment')

        if (secret !== purchaseDetails?.secret) {
            return res.status(400).json({
                error: 'Invalid purchase reference, please contact the support.',
            })
        }

        const purchasedLeads = purchaseDetails?.leads?.split(',')
        const updatedLeads = purchasedLeads
            ?.map(async (leadId) => {
                console.log('Processing Lead:', leadId)
                const fullLead = await fetch(
                    `${serverRuntimeConfig.apiUrl}/storage-leads/${leadId}`
                )

                // no match no update!
                if (!fullLead) {
                    console.log('Lead not found:', leadId)
                    return null
                }

                const currentProvidersPurchased =
                    fullLead?.purchased?.map((provider) => provider.id) || []

                // Do not update in case it's been flagged as purchased before.
                if (
                    currentProvidersPurchased.find(
                        (id) => id === currentUser?.providerId
                    )
                ) {
                    console.log(
                        'Lead already bought:',
                        leadId,
                        currentUser?.providerId,
                        currentProvidersPurchased
                    )
                    return fullLead
                }

                return await fetch(
                    `${serverRuntimeConfig.apiUrl}/storage-leads/${leadId}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify({
                            purchased: [
                                ...currentProvidersPurchased,
                                currentUser?.providerId,
                            ],
                        }),
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
            })
            ?.filter((data) => data !== null)

        res.status(200).json(updatedLeads?.map( lead => lead?.id ))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})
