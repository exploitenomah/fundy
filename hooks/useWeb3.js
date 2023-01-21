import { useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'


const useWeb3 = () => {
	const [ethereum, setEthereum] = useState(null)
	const web3 = useMemo(() => {
		if(ethereum) return new Web3(ethereum)
	}, [ethereum])

	useEffect(() => {
		if(window && window.ethereum){
			window.ethereum.request({ 
				method: 'eth_requestAccounts'
			}) 
			setEthereum(window.ethereum)     
		}
		if(typeof window === 'undefined' && !ethereum){
			const provider = new Web3.providers.HttpProvider('http://127.0.0.1:3000')
			setEthereum(provider)
		}
	}, [])
	return web3
}

export default useWeb3