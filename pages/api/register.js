import getConfig from 'next/config'
import withSession from '../../lib/session'
import nodemailer from 'nodemailer'
import axios from 'axios'
import { WebClient } from "@slack/web-api";


const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default withSession(async (req, res) => {
    try {
        const { email, password, postcode, latitude, longitude } =
            await req.body

        const response = await fetch(
            `${serverRuntimeConfig.apiUrl}/auth/local/register`,
            {
                method: 'POST',
                body: JSON.stringify({
                    username: email.replace(/@/gi, '.'),
                    
                    email: email,
                    password: password,
                }),
                headers: { 'Content-Type': 'application/json' },
            }
        )

        if (!response) {
            console.log(response)
            res.status(500).json({
                error: 'Apologies, there has been an error registering.',
            })
        }

        //const dataMailChimp = await mailChimp.json();

        const data = await response.json()

        if (data?.user?.id) {
            try {
                await (
                    await fetch(
                        `${serverRuntimeConfig.apiUrl}/storage-providers`,
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                users_permissions_user: data.user.id,
                                title: 'New Provider',
                                description:
                                    'I am a new provider, soon I will update my details.',
                                postcode: postcode,
                                latitude: latitude,
                                longitude: longitude,
                                email: data.user.email,
                                minimumDuration: 1,
                            }),
                            headers: { 'Content-Type': 'application/json' },
                        }
                    )
                ).json()
                    ////////////////// Mailchimp store///////////
                    const tags = "suppliers";
                    await addMailChimp(email,tags)
                    ///////////// Mailchimp end ///////////////
                    res.status(201).json(data)
            } catch (e) {
                console.log(e.message)
                res.status(200).json(data)
            }

            // make sure admin is notified when there is a new user.
            await notifyAdmin(email)

            // Slack Notification
            try {
                const web = new WebClient(serverRuntimeConfig.SLACK_TOKEN);
                const result = await web.chat.postMessage({
                    channel: "C02RY9RA9JS",
                    text: `New provider registered! Email: "${email}", Postcode: "${postcode}"`,
                });
                


                // console.log(`Successfully send message to Slack.`);
            } catch (error) {
                console.log('Slack Error: ', serverRuntimeConfig.SLACK_TOKEN, error)
            }


        } else {
            console.log(JSON.stringify(data))
            res.status(400).json({
                error:
                    data?.message?.[0]?.messages?.[0]?.message ===
                    'Email is already taken.'
                        ? 'Not possible to register at the moment.'
                        : 'System unavailable.',
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})



const notifyAdmin = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: serverRuntimeConfig.SMTP_HOST,
            port: serverRuntimeConfig.SMTP_PORT,
            secure: false,
            auth: {
                user: serverRuntimeConfig.SMTP_USER,
                pass: serverRuntimeConfig.SMTP_PASSWORD,
            },
        })

        const template = `<!DOCTYPE html><html> <head> <meta name="viewport" content="width=device-width"/> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <title>New Message</title> <style>img{border: none; -ms-interpolation-mode: bicubic; max-width: 100%;}body{background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #34495e;}table{border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;}table td{font-family: sans-serif; font-size: 14px; vertical-align: top;}.body{background-color: #f6f6f6; width: 100%;}/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */ .container{display: block; margin: 0 auto !important; /* makes it centered */ max-width: 580px; padding: 10px; width: 580px;}/* This should also be a block element, so that it will fill 100% of the .container */ .content{box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;}.main{background: #fff; border-radius: 3px; width: 100%;}.wrapper{box-sizing: border-box; padding: 20px;}.footer{clear: both; padding-top: 10px; text-align: center; width: 100%;}.footer td, .footer p, .footer span, .footer a{color: #999999; font-size: 12px; text-align: center;}h1, h2, h3, h4{color: #000000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; margin-bottom: 30px;}h1{font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize;}p, ul, ol{font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;}p li, ul li, ol li{list-style-position: inside; margin-left: 5px;}a{color: #3498db; text-decoration: underline;}.btn{box-sizing: border-box; width: 100%;}.btn > tbody > tr > td{padding-bottom: 15px;}.btn table{width: auto;}.btn table td{background-color: #ffffff; border-radius: 5px; text-align: center;}.btn a{background-color: #ffffff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize;}.btn-primary table td{background-color: #3498db;}.btn-primary a{background-color: #3498db; border-color: #3498db; color: #ffffff;}.last{margin-bottom: 0;}.first{margin-top: 0;}.align-center{text-align: center;}.align-right{text-align: right;}.align-left{text-align: left;}.clear{clear: both;}.mt0{margin-top: 0;}.mb0{margin-bottom: 0;}.preheader{color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;}.powered-by a{text-decoration: none;}hr{border: 0; border-bottom: 1px solid #f6f6f6; margin: 20px 0;}@media only screen and (max-width: 620px){table[class="body"] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class="body"] p, table[class="body"] ul, table[class="body"] ol, table[class="body"] td, table[class="body"] span, table[class="body"] a{font-size: 16px !important;}table[class="body"] .wrapper, table[class="body"] .article{padding: 10px !important;}table[class="body"] .content{padding: 0 !important;}table[class="body"] .container{padding: 0 !important; width: 100% !important;}table[class="body"] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class="body"] .btn table{width: 100% !important;}table[class="body"] .btn a{width: 100% !important;}table[class="body"] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}@media all{.ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;}.btn-primary table td:hover{background-color: #34495e !important;}.btn-primary a:hover{background-color: #34495e !important; border-color: #34495e !important;}}</style> </head> <body class=""> <table border="0" cellpadding="0" cellspacing="0" class="body"> <tr> <td>&nbsp;</td><td class="container"> <div class="content"> <center class="wrapper">
                                                    <img src="data:image/png;base64,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" />
                                                </center> <table class="main"> <tr> <td class="wrapper"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td> <h1>New Registration</h1> <h2>Hi Admin!</h2> <p> <b>${email}</b> has registered to use the system.</p><br/> <p>Best regards.</p><p> <b>Car Store Club</b> <br/> help@${
            serverRuntimeConfig.SIMPLE_BASE_URL
        }<br/>https://${
            serverRuntimeConfig.SIMPLE_BASE_URL
        }</p></td></tr></table> </td></tr></table> <div class="footer"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td class="content-block"> If you received this email by mistake, simply delete it. <br/> You won't be subscribed if you don't click the confirmation link above. </td></tr><tr> <td class="content-block powered-by"></td></tr></table> </div></div></td><td>&nbsp;</td></tr></table> </body></html>`

        var mailOptions = {
            from: serverRuntimeConfig.SMTP_FROM,
            to: serverRuntimeConfig.ADMIN_EMAIL,
            subject: 'New user registered to Car Store Club!',
            text: `New registerd user: ${email}`,
            html: template,
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log('error:', email, err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

function getRequestParams(email,tags) {
    // get env variables
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
  
    // get the mailchimp datacenter - mailchimp API keys always look like this:
    // c0e214879c8542a54e716f38edf1635d-us2
    // we need the us2 part
    const DATACENTER = process.env.MAILCHIMP_API_KEY.split("-")[1]
  
    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`
  
    // you can add aditional paramaters here. See full list of available paramaters at:
    // https://mailchimp.com/developer/reference/lists/list-members/
    const data = {
      email_address: email,
      status: "subscribed",
      address :"Rajkot",
      tags: [tags],
      latitude:"",
      longitude:""

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

  const addMailChimp = async (email,tags) => {
    try {
                       
        const { url, data, headers } = getRequestParams(email,tags)
        async function sendReq(){
            //console.log(headers);
             const response =  await axios.post(url, data, { headers })
            .then(resp=>{
                console.log('Added in mailchimp done.......');
                res.status(201).json(data)
              })  
              .catch(error=>{
                console.log('Oops, something went wrong... in mailchimp add time.');
              });
        }
        sendReq(); 
        //return res.status(201).json({ error: null })
      } catch (error) {
        console.log('Oops, something went wrong...');
      }
}