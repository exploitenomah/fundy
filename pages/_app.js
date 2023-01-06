import '../styles/globals.css'
import { useCampaignFactory } from '../hooks/useCampaign'
import DefaultLoader from '../components/Loader'


export default function App({ Component, pageProps }) {
  const campaignFactory = useCampaignFactory()

  if (campaignFactory === null) {
    return (
      <div>
        <DefaultLoader>
          <h1 text='Loading Fundy...' 
            className='text-white relative font-black text-small uppercase before:content-[attr(text)] before:absolute before:text-purple-400 before:z-0 before:animate-widthChange before:overflow-hidden before:whitespace-nowrap before:w-full before:border-r before:border-r-current'>Loading Fundy...</h1>
        </DefaultLoader>
      </div>
    )
  } else {
    return <Component campaignFactory={campaignFactory} {...pageProps} />
  }
}
