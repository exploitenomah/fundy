
import useWeb3 from './useWeb3'
import { useEffect, useState, useMemo, useCallback } from 'react'

export const useCampaignFactory = () => {
	const [contractData, setContractData] = useState(null)

	const web3 = useWeb3()
	const campaignFactoryInterface = useMemo(() => {
		if(contractData !== null){
			return new web3.eth.Contract(
				contractData.abi,
				contractData.address
			)
		}else return null
	}, [contractData, web3.eth.Contract])

	const getContractData = useCallback(async () => {
		try{
			const res = await fetch('/api/contracts')
			if(res.status === 200){
				const { contract } = await res.json()
				setContractData(contract)
			}
		}catch(err){
			console.error(err)
		}
	}, [])
  
	useEffect(() => {
		if(contractData === null){
			try{
				getContractData()
			}catch(err){
				console.error(err)
			}
		}
	}, [contractData, getContractData])

	return { campaignFactory: campaignFactoryInterface, web3}
}
