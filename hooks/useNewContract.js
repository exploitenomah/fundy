import { useMemo } from 'react'


export default function useNewContract({ contractData, web3 }) {

	const contract = useMemo(() => {
		if(!contractData) return null
		const { abi, address } = contractData
		if(web3){
			return new web3.eth.Contract(
				abi,
				address
			)
		}
	})
	return { contract, web3 }
}