import Layout from '../components/Layout/Layout'
import Sidebar from '../components/Sidebar/Sidebar'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <div>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </div>
}

export default MyApp
