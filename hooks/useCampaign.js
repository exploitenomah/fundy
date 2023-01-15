
import useNewContract from './useNewContract'
import { useEffect, useState, useCallback } from 'react'

export const useCampaignFactory = ( web3 ) => {
	const [contractData, setContractData] = useState(null)

	const newContract = useNewContract({ contractData, web3})

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

	if(newContract) {
		return { campaignFactory: newContract.contract, web3: newContract.web3}
	}else{
		return { campaignFactory: null, web3: null}
	}
}
