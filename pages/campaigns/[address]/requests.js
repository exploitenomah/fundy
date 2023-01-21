
import campaignJson from '../../../ethereum/contractBuilds/Campaign.json'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useNewContract from '../../../hooks/useNewContract'
// import TypographyBase from '../../../components/Typography'
import { H2, H3, H4, H5 } from '../../../components/Headings'
import DefaultLoader from '../../../components/Loader'
import { ButtonBase } from '../../../components/Buttons'
// import ContributionForm from '../../../components/ContributeModal'
// import { PrimaryBtn } from '../../../components/Buttons'


const Request = ({ request, primaryAccount, manager }) => {
	const { description, value, recipient, complete, approvalCount, contributorsCount } = request
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
						<ButtonBase className='text-green-400 border border-current uppercase px-4 py-2 hover:scale-105 hover:shadow-2xl duration-300 transition-all'>Approve</ButtonBase>
						{primaryAccount === manager && 
						<ButtonBase className='text-blue-400 border border-current uppercase px-4 py-2 hover:scale-105 hover:shadow-2xl duration-300 transition-all'>Finalize</ButtonBase>}
					</>
				}
			</div>
		</article>
	)
}


export default function Requests({ web3, setStore, store }) {
	const router = useRouter()
	const { address, count } = useMemo(() => router.query, [router.query])
	const [hasFetchedContractData, setHasFetchedContractData] = useState(false)

	const { contract } = useNewContract({ contractData: { abi: campaignJson.interface, address }, web3 })
	const [contractRequests, setContractRequests] = useState([])
	const [contractManager, setContractManager] = useState(null)
	const [contractContributorsCount, setContractContribbutorsontributorsCount] = useState(0)
	const [isLoading, setIsLoading] = useState(true)

	const getContractData = useCallback(async () => {
		let message, status, showMsg
		if (contract.options.address) {
			try {
				const requests = await Promise.all(Array(+count).fill()
					.map((_el, idx) => idx)
					.map(async (item) => contract.methods.requests(item).call()))
				const manager = await contract.methods.manager().call()
				const contributorsCount = await contract.methods.contributorsCount().call()
				setContractContribbutorsontributorsCount(contributorsCount)
				setContractManager(manager)
				setContractRequests(requests.map((req, idx) => ({
					description: req[0],
					value: web3.utils.fromWei(req[1], 'ether'),
					recipient: req[2],
					complete: req[3],
					approvalCount: req[4],
					id: idx,
				})))
				setHasFetchedContractData(true)
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
	}, [contract.methods, count, contract.options.address, setStore])

	useEffect(() => {
		hasFetchedContractData === false && getContractData()
	}, [getContractData, hasFetchedContractData])

	if (isLoading) {
		return (
			<DefaultLoader />
		)
	}
	return (
		<>
			<main className='my-12 max-w-[85vw] mx-auto'>
				<div className='my-8 flex items-center justify-start flex-wrap gap-y-8 gap-x-32 lg:justify-between'>
					<H2 as='h1' className='text-md'>
						Requests for campaign deployed at <span className='text-white/60 max-w-[400px] md:text-[1.6rem] overflow-hidden text-ellipsis text-md block'>{address}</span>
					</H2>
				</div>
				<ul className='flex flex-wrap gap-8'>
					{contractRequests.map(request => 
						(<li key={request.id}>
							<Request 
								request={request} 
								primaryAccount={store.primaryAccount} 
								manager={contractManager} 
								contributorsCount={contractContributorsCount} />
						</li>))}
				</ul>
			</main>
		</>
	)
}