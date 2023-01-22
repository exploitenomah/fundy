import { useCallback, useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'


const useWeb3 = () => {
	const [ethereum, setEthereum] = useState(null)
	const [primaryAccount, setPrimaryAccount] = useState('')
	const web3 = useMemo(() => {
		if(ethereum) return new Web3(ethereum)
	}, [ethereum])

	const init = useCallback(async () => {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		setEthereum(window.ethereum)
		setPrimaryAccount(accounts[0])
		window.ethereum.on('accountsChanged', function (accounts) {
			setPrimaryAccount(accounts[0])
		})
	}, [])

	useEffect(() => {
		if(window && window.ethereum){
			ethereum === null && init()
		}
		if(typeof window === 'undefined' && !ethereum){
			const provider = new Web3.providers.HttpProvider('http://127.0.0.1:3000')
			setEthereum(provider)
		}
	}, [ethereum, init])
	return { web3, primaryAccount }
}

export default useWeb3