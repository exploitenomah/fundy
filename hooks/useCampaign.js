
import useWeb3 from "./useWeb3";
import { useEffect, useState, useMemo, useCallback } from "react";

export const useCampaignFactory = () => {
  const [contractData, setContractData] = useState(null)
  console.log(contractData,)
  const web3 = useWeb3()
  const campaignFactoryInterface = useMemo(() => {
    if(contractData !== null){
      return new web3.eth.Contract(
        contractData.abi,
        contractData.address
      )
    }
  }, [contractData, web3.eth.Contract])

  const getContractData = useCallback(async () => {
   const res = await fetch('/api/contracts')
   const { contract } = await res.json()
   setContractData(contract)
  }, [])
  
  useEffect(() => {
    if(contractData === null){
      try{
        getContractData()
      }catch(err){
        console.error(error)
      }
    }
  }, [contractData, getContractData])

  return campaignFactoryInterface
}
