
import campaignJson from '../../../ethereum/contractBuilds/Campaign.json'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useNewContract from '../../../hooks/useNewContract'
// import TypographyBase from '../../../components/Typography'
import { H2, H3, H4, H5 } from '../../../components/Headings'
import DefaultLoader, { TextLoader } from '../../../components/Loader'
import { ButtonBase } from '../../../components/Buttons'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import useSummary from '../../../hooks/useSummary'
// import { PrimaryBtn } from '../../../components/Buttons'


const Request = ({ 
	request, primaryAccount, manager, 
	contributorsCount, approveRequest,
	primaryAccIsContributor, finalizeRequest }) => {

	const { description, value, recipient, complete, approvalCount } = request

	return (
		<article className='bg-white/20 w-[80vw] max-w-[400px] flex flex-col gap-y-4 px-10 py-12 rounded-lg'>
			<div>
				<H3 className='text-purple-100 underline capitalize'>Description</H3>
				<p>{description}</p>
			</div>
			<div>
				<H4 className='text-purple-100 underline capitalize'>recipient</H4>
				<address className='break-words'>{recipient}</address>
			</div>
			<div>
				<H5 className='text-purple-100 underline capitalize'>Value</H5>
				<p>{value} (ether)</p>
			</div>
			<div>
				<H5 className='text-purple-100 underline capitalize'>Approvers</H5>
				<p>{approvalCount} approvers out of {contributorsCount} contributors</p>
			</div>
			<div className='flex gap-x-4 mt-2'>
				{complete ?
					<p>
					Request has been voted on and finalized.
					</p> :
					<>
						{
							primaryAccIsContributor &&
							<ButtonBase 
								onClick={approveRequest} 
								className='text-green-400 border border-current uppercase px-4 py-2 hover:scale-105 \n
								hover:shadow-2xl duration-300 transition-all'>
									Approve
							</ButtonBase>
						}
						{primaryAccount?.toLowerCase()  === manager?.toLowerCase() &&
						<ButtonBase
							onClick={finalizeRequest}
							className='text-blue-400 border border-current uppercase px-4 \n
							py-2 hover:scale-105 hover:shadow-2xl duration-300 transition-all \n
							disabled:cursor-not-allowed disabled:hover:scale-100 disabled:text-gray-50/30 '
							disabled={approvalCount <= +contributorsCount / 2 }>
								Finalize
						</ButtonBase>}
					</>
				}
			</div>
		</article>
	)
}


export default function Requests({ web3, setStore, store }) {
	const router = useRouter()
	const { address } = useMemo(() => router.query, [router.query])
	const [hasFetchedContractData, setHasFetchedContractData] = useState(false)
	const { contractSummary } = useSummary(web3)

	const { contract } = useNewContract({ contractData: { abi: campaignJson.interface, address }, web3 })
	const [contractRequests, setContractRequests] = useState([])
	const [contractContributorsCount, setContractContributorsCount] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [primaryAccIsContributor, setPrimaryAccIsContributor] = useState(false)

	const getContractData = useCallback(async () => {
		let message, status, showMsg
		if (contract.options.address && contractSummary.requestsLength !== null) {
			try {
				const contributorsCount = await contract.methods.contributorsCount().call()
				const isContributor = await contract.methods.contributors(store.primaryAccount).call()
				setPrimaryAccIsContributor(isContributor)
				const requests = await Promise.allSettled(Array(+contractSummary.requestsLength).fill()
					.map((_el, idx) => idx)
					.map(async (item) => await contract.methods.requests(item).call()))
				setContractContributorsCount(await contributorsCount)
				setContractRequests(requests.map((req, idx) => ({
					description: req.value[0],
					value: web3.utils.fromWei(req.value[1].toString(), 'ether'),
					recipient: req.value[2],
					complete: req.value[3],
					approvalCount: req.value[4],
					id: idx,
				})))
				setHasFetchedContractData(
					contractSummary.requestsLength !== null && 
					+contractSummary.requestsLength === requests.length
				)
				showMsg = false
			} catch (err) {
				console.error(err)
				status = 'error'
				message = err.message
				showMsg = true
			} finally {
				setStore(prev => ({
					...prev,
					message: message,
					showMsg,
					msgStatus: status
				}))
				setIsLoading(false)
			}
		}
	}, [contract.methods, contract.options.address, setStore, contractSummary.requestsLength, store.primaryAccount])

	const approveRequest = useCallback(async (id) => {
		setIsLoading(true)
		let message, status, showMsg
		try{
			await contract.methods.approveRequest(id.toString()).send({
				from: store.primaryAccount,
				gas: 3000000
			})
			showMsg = true
			message = 'Approved Successfully!'
			status = 'success'
			await getContractData()
		}catch(err){
			console.error(err)
			status = 'error'
			message = err.message
			showMsg = true
		}finally{
			setStore(prev => ({
				...prev,
				message: message,
				showMsg,
				msgStatus: status
			}))
			setIsLoading(false)
		}
	}, [store.primaryAccount, contract.methods, getContractData])

	const finalizeRequest = useCallback(async (id) => {
		setIsLoading(true)
		let message, status, showMsg
		try{
			await contract.methods.finalizeRequest(id.toString()).send({
				from: store.primaryAccount,
				gas: '4000000'
			})
			showMsg = true
			message = 'Finalized Successfully!'
			status = 'success'
			await getContractData()
		}catch(err){
			console.error(err)
			status = 'error'
			message = err.message
			showMsg = true
		}finally{
			setStore(prev => ({
				...prev,
				message: message,
				showMsg,
				msgStatus: status
			}))
			setIsLoading(false)
		}
	}, [contract.methods])

	useEffect(() => {
		hasFetchedContractData === false && getContractData()
	}, [getContractData, hasFetchedContractData])

	if (isLoading) {
		return (
			<main className='flex flex-col gap-y-4 justify-center items-center h-[75vh]'>
				<DefaultLoader />
				<TextLoader text='Loading'/>
			</main>
		)
	}
	return (
		<>
			<main className='my-12 max-w-[85vw] mx-auto animate-fade-in'>
				<Link href={`/campaigns/${address}`}>
					<ButtonBase className='flex gap-x-3 items-center my-4'><FaArrowLeft /> Back To Overview</ButtonBase>
				</Link>
				<div className='my-8 flex items-center justify-start flex-wrap gap-y-8 gap-x-32 lg:justify-between'>
					<H2 as='h1' className='text-md'>
						Requests for campaign deployed at <span className='text-white/60 max-w-[400px] md:text-[1.6rem] overflow-hidden text-ellipsis text-md block'>{address}</span>
					</H2>
				</div>
				<ul className='flex flex-wrap gap-8'>
					{contractRequests.map(request => 
						(<li key={request.id}>
							<Request 
								primaryAccIsContributor={primaryAccIsContributor}
								approveRequest={() => approveRequest(request.id)}
								finalizeRequest={() => finalizeRequest(request.id)}
								request={request} 
								primaryAccount={store.primaryAccount} 
								manager={contractSummary.manager} 
								contributorsCount={contractContributorsCount} />
						</li>))}
				</ul>
			</main>
		</>
	)
}