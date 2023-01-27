
import campaignJson from '../ethereum/contractBuilds/Campaign.json'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useNewContract from './useNewContract'

export default function useSummary(web3) {
	const router = useRouter()
	const address = useMemo(() => router.query.address, [router.query])
	const { contract } = useNewContract({ contractData: { abi: campaignJson.interface, address }, web3 })
	const [contractSummary, setContractSummary] = useState({
		balance: null,
		minimumContribution: null,
		requestsLength: null,
		manager: null,
		totalContributors: null
	})
	
	const getContractSummary = useCallback(async () => {
		if(contract.options.address){
			const summary = await contract.methods.getSummary().call()
			setContractSummary(prev => ({
				...prev,
				balance: web3.utils.fromWei(summary[0], 'ether'),
				minimumContribution: summary[1],
				requestsLength: summary[2],
				manager: summary[3],
				totalContributors: summary[4],
				about: summary[5]
			}))
		}
	}, [contract.options.address, contract.methods.getSummary])

	useEffect(() => {
		if (contractSummary.manager === null) {
			getContractSummary()
		}
	}, [address, contractSummary.manager, getContractSummary])

	return { contractSummary, getContractSummary }
}