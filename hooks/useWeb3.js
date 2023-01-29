import { useCallback, useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'


const useWeb3 = ({ runOnAccountsChange }) => {
	const [ethereum, setEthereum] = useState(null)
	const [primaryAccount, setPrimaryAccount] = useState('')
	const [isLoadingWeb3, setIsLoadingWeb3] = useState(true)
	const web3 = useMemo(() => {
		if(ethereum) return new Web3(ethereum)
		else return 
	}, [ethereum])

	const init = useCallback(async () => {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		setEthereum(window.ethereum)
		setPrimaryAccount(accounts[0])
		setIsLoadingWeb3(false)
		window.ethereum.on('accountsChanged', function (accounts) {
			setPrimaryAccount(accounts[0])
			return typeof runOnAccountsChange === 'function' && runOnAccountsChange()
		})
	}, [])

	useEffect(() => {
		if(window && window.ethereum){
			ethereum === null && init()
		}else if(!window.ethereum){
			setIsLoadingWeb3(false)
		}
		if(typeof window === 'undefined' && !ethereum){
			const provider = new Web3.providers.HttpProvider('http://127.0.0.1:3000')
			setEthereum(provider)
		}
	}, [ethereum, init])

	return { web3, primaryAccount, isLoadingWeb3 }
}

export default useWeb3