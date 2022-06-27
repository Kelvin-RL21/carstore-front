import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  global.__basedir = __dirname;
  
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}

export default MyApp
