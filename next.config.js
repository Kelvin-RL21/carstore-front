module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        FRONTEND_API_URL: process.env.FRONTEND_API_URL,
        apiUrl: process.env.BACKEND_API_URL,
        postcodeServiceUrl: process.env.POSTCODE_SERVICE_URL,
    },
    serverRuntimeConfig: {
        apiUrl: process.env.BACKEND_API_URL,
        FRONTEND_API_URL: process.env.FRONTEND_API_URL,
        postcodeServiceUrl: process.env.POSTCODE_SERVICE_URL,
        sessionSecret: process.env.SECRET_COOKIE_PASSWORD,
        envName: process.env.NODE_ENV,

        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        SMTP_FROM: process.env.SMTP_FROM,
        SIMPLE_BASE_URL: process.env.SIMPLE_BASE_URL,

        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        STRIPE_PRODUCT_STANDARD_LEAD: process.env.STRIPE_PRODUCT_STANDARD_LEAD,
        STRIPE_PRODUCT_FEATURED_ONE_WEEK:
            process.env.STRIPE_PRODUCT_FEATURED_ONE_WEEK,
        STRIPE_PRODUCT_FEATURED_TWO_WEEK:
            process.env.STRIPE_PRODUCT_FEATURED_TWO_WEEK,
        STRIPE_PRODUCT_FEATURED_ONE_MONTH:
            process.env.STRIPE_PRODUCT_FEATURED_ONE_MONTH,

        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

        SLACK_TOKEN: process.env.SLACK_TOKEN,
    }
}
