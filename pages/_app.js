import '../styles/globals.css'
import { useCampaignFactory } from '../hooks/useCampaign'
import DefaultLoader from '../components/Loader'
import { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'


export default function App({ Component, pageProps }) {
  const campaignFactory = useCampaignFactory()

  const [store, setStore] = useState({
    campaigns: [],

  })

  const getCampaigns = useCallback(async () => {
    if (campaignFactory) {
      const campaigns = await campaignFactory.methods.getDeployedCampaigns().call()
      setStore(prev => ({
        ...prev, campaigns
      }))
    }
  }, [campaignFactory])

  useEffect(() => {
    getCampaigns()
  }, [getCampaigns])

  if (campaignFactory === 'null') {
    return (
      <div>
        <DefaultLoader>
          <h1 text='Loading Fundy...'
            className='text-white relative font-black text-small uppercase \n
             before:content-[attr(text)] before:absolute before:text-purple-400 \n
             before:z-0 before:animate-widthChange before:overflow-hidden \n
             before:whitespace-nowrap before:w-full before:border-r before:border-r-current'>
            Loading Fundy...
          </h1>
        </DefaultLoader>
      </div>
    )
  } else {
    return (
      <Layout title={Component.title}>
        <Component campaignFactory={campaignFactory} {...pageProps} />
      </Layout>
    )
  }
}
