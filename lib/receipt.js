import getConfig from 'next/config'
import { v4 as uuidv4 } from 'uuid';
import pdf from 'html-pdf';
import ejs from 'ejs';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default async function receipt ( { user, query } ) {
    let templatePath;
    let receiptName;
    let tmpFile;
    let uploadFilePath;
    let html;
    let formData;
    let lead;

    const pathModule = require('path');
    const FormData = require('form-data');  
    const fs = require('fs');

    const rootPath = `${global.__basedir}/../../..`;
    
    try {
        if ( query.lead ) {
            if ( typeof query.lead !== 'object' ){
                query.lead = [ query.lead ]
            } 
        
            const leads = await (
                await fetch(
                    `${serverRuntimeConfig.apiUrl}/storage-leads?id_in=${query.lead.join(',')}`
                )
            ).json()
    
            if ( leads.length ) {
                templatePath = `${pathModule.resolve(`${rootPath}/lib/templates/receipt.html`)}`;
                const template = (fs.readFileSync(templatePath)).toString();

                for(let i=0; i < leads.length; i++ ) {
                    try {
                        lead = leads[i];
                        receiptName = `lead-${lead.id}-provider-${user.providerId}.pdf`;
                        tmpFile = `${pathModule.resolve(`${rootPath}/lib/tmp/`, receiptName)}`;
                        html = await ejs.render(template, {
                            lead,
                            provider: {
                                title: user.providerTitle,
                                email: user.providerEmail
                            },
                            receipt: {
                                id: (uuidv4()).split('-').join('').slice(0,12),
                                createdAt: (new Date()).toLocaleDateString('en-GB')
                            }
                        });
                
                        uploadFilePath = await new Promise((resolve, reject) => {
                            pdf.create(html)
                            .toFile(tmpFile, (err, res) => {
                                if (err) reject(err)
                                resolve(res.filename)
                            });
                        })
                
                        formData = new FormData();
                        formData.append('files', fs.readFileSync(uploadFilePath), receiptName);
                
                        // Save file to media library.
                        const uploadedAsset = await ( await fetch(`${publicRuntimeConfig.apiUrl}/upload`, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                Authorization: `Bearer ${user.jwt}`
                            },
                            redirect: 'follow'
                        }) ).json();
                
                        fs.unlinkSync(uploadFilePath);
            
                        const finalReceiptsList = [...(lead?.receipts?.map( data => data.id ) || []), Number(uploadedAsset[0].id) ];
            
                        // Update lead receipts with that new one.
                        await ( await fetch(`${publicRuntimeConfig.apiUrl}/storage-leads/${lead.id}`,
                            {
                                method: 'PUT',
                                body: JSON.stringify({ receipts: finalReceiptsList }),
                                headers: {
                                    // Authorization: `Bearer ${user.jwt}`,
                                    'Content-Type': 'application/json',
                                },
                            }
                        ) ).json();
            
                    } catch (err) {
                        console.log('Error uploading receipt:', err)
                    }
                }
            }
        }
    } catch ( err ) {
        console.log('Receipt Error:', __dirname, rootPath, templatePath, receiptName, uploadFilePath, err); 
    }
}
