import { useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'


const useWeb3 = () => {
	const [ethereum, setEthereum] = useState(null)
	const web3 = useMemo(() => {
		return new Web3(ethereum)
	}, [ethereum])

	useEffect(() => {
		if(window && window.ethereum){
			window.ethereum.request({ 
				method: 'eth_requestAccounts'
			}) 
			setEthereum(window.ethereum)     
		}
	}, [])

  if(!ethereum){
    const provider = new Web3.providers.HttpProvider(
      process.env.NEXT_PUBLIC_INFURA_URL
    )
    setEthereum(provider)
  }
	return web3
}

export default useWeb3