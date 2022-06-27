import withSession from '../../lib/session'

export default withSession(async (req, res) => {
    const { jwt } = await req.body
    const user = req.session.get('user')

    if (jwt === user.jwt) {
        await req.session.destroy()
    }

    await res.json({ error: null })
})
