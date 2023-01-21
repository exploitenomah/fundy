import '../styles/globals.css'
import useWeb3 from '../hooks/useWeb3'
import { useCampaignFactory } from '../hooks/useCampaign'
import DefaultLoader, { TextLoader } from '../components/Loader'
import { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Notification from '../components/Notificaton'

export default function App({ Component, pageProps }) {
	const web3 = useWeb3()
	const { campaignFactory } = useCampaignFactory(web3)

	const [store, setStore] = useState({
		hasFetchedCampaigns: false,
		campaigns: [],
		message: '',
		showMsg: false,
		msgStatus: 'info',
		primaryAccount: null
	})

	const getCampaigns = useCallback(async () => {
		if (campaignFactory) {
			const campaigns = await campaignFactory.methods.getDeployedCampaigns().call()
			setStore(prev => ({
				...prev, campaigns, hasFetchedCampaigns: true
			}))
		}
	}, [campaignFactory])

	const getPrimaryAccount = useCallback(async () => {
		if(web3){
			const accounts = await web3.eth.getAccounts()
			const [primaryAccount] = accounts
			setStore(prev => ({ ...prev, primaryAccount }))
		}
	}, [web3])

	useEffect(() => {
		!store.hasFetchedCampaigns && getCampaigns()
		const removeMsg = store.showMsg ? setTimeout(() => {
			setStore(prev => ({
				...prev, msgStatus: 'info', message: '', showMsg: false
			}))
		}, 10000) : undefined

		store.primaryAccount === null && web3 && getPrimaryAccount()

		return () => {
			clearTimeout(removeMsg)
		}
	}, [store.showMsg, store.hasFetchedCampaigns, store.primaryAccount, web3, getCampaigns])

	if (campaignFactory === null && web3 === undefined) {
		return (
			<div className='h-screen w-screen flex flex-col justify-center items-center'>
				<DefaultLoader>
					<TextLoader text={'Loading Fundy...'} />
				</DefaultLoader>
			</div>
		)
	} else {
		return (
			<Layout title={Component.title}>
				<Notification 
					hide={() => setStore(prev => ({...prev, showMsg: false}))}
					message={store.message} 
					show={store.showMsg} 
					status={store.msgStatus} />
				<Component
					web3={web3}
					store={store}
					setStore={setStore}
					factory={campaignFactory} 
					{...pageProps} />
			</Layout>
		)
	}
}
