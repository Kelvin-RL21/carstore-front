import getConfig from 'next/config'
import withSession from '../../lib/session'
import axios from "axios"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default withSession(async (req, res) => {
    try {
        const { identifier, password } = await req.body
       // MailChimp();
        // console.log('Server: ', `${serverRuntimeConfig.apiUrl}/auth/local`)

        const response = await (
            await fetch(`${serverRuntimeConfig.apiUrl}/auth/local`, {
                method: 'POST',
                body: JSON.stringify({
                    identifier: identifier,
                    password: password,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        ).json()

        if (response?.jwt) {
            if (!response?.user?.storage_provider?.id) {
                return res.status(400).json({
                    error: 'No provider connected, please contact the support!',
                })
            } else {
                await req.session.set('user', {
                    jwt: response?.jwt,
                    id: response?.user?.id,
                    name: 'User Name Here ', //@todo include name from back-end
                    email: response?.user?.email,
                    providerId: response?.user?.storage_provider?.id,
                    providerTitle: response?.user?.storage_provider?.title,
                    providerEmail: response?.user?.storage_provider?.email,
                })
                await req.session.save()
                res.status(200).json(response)
            }
        } else {
            console.log(response)
            res.status(400).json({ error: 'Invalid user!' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})


function getRequestParams(email) {
    // get env variables
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
  
    // get the mailchimp datacenter - mailchimp API keys always look like this:
    // c0e214879c8542a54e716f38edf1635d-us2
    // we need the us2 part
    const DATACENTER = process.env.MAILCHIMP_API_KEY.split("-")[1]
  
    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/4241f92a94/members`
  
    // you can add aditional paramaters here. See full list of available paramaters at:
    // https://mailchimp.com/developer/reference/lists/list-members/
    const data = {
      email_address: email,
      status: "subscribed",
    }
  
    // API key needs to be encoded in base 64 format
    const base64ApiKey = Buffer.from(`anystring:${API_KEY}`).toString("base64")
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${base64ApiKey}`,
    }
  
    return {
      url,
      data,
      headers,
    }
  }
  
  async function MailChimp(req, res) {
    const  email  = 'kelvin11@21twelve.in'
    if (!email || !email.length) {
        console.log('if--------------')
        //console.log(response)
       // res.status(400).json({ error: 'Forgot to add your email?' })
    //   return res.status(400).json({
    //     error: "Forgot to add your email?",
    //   })
    }
    

    try {
        const { url, data, headers } = getRequestParams(email)
        async function sendReq(){
            //console.log(headers);
            const response =  await axios.post(url, data, { headers })
            .then(resp=>{
                console.log('111111111111111');
              })  
              .catch(error=>{
                console.log('try-222222222222-----',error);
              });
            //console.log(response);
            
           
        }
        sendReq(); 
        // return (
        //     <div>Hi this is for test 333333333</div>
        //     )
        // Success
        return res.status(201).json({ error: null })
      } catch (error) {
        console.log('catch------',error);
        // return (
        //     <div>Hi this is for test 4444444444</div>
        //     )
        // return res.status(400).json({
        //   error: `Oops, something went wrong... Send me an email at djsfdavid@gmail.com and I'll manually add you to the list.`,
        // })
      }



  }