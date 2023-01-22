
import campaignJson from '../../../ethereum/contractBuilds/Campaign.json'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useNewContract from '../../../hooks/useNewContract'
import TypographyBase from '../../../components/Typography'
import { H2, H3 } from '../../../components/Headings'
import ContributionForm from '../../../components/ContributeModal'
import { PrimaryBtn, SecondaryBtn } from '../../../components/Buttons'
import CreateRequestForm from '../../../components/CreateRequestModal'


const InfoCard = ({ title, details, info, children }) => {
	return (
		<article className='flex flex-col border bg-white/10 px-6 py-4 mx-auto w-[80vw] max-w-sm'>
			<H3 className='inline-block text-purple-100 break-words'>{title}</H3>
			<TypographyBase
				className=' text-white/90 my-3'>{details}</TypographyBase>
			<TypographyBase className='text-white/50 text-sm leading-snug my-3'>
				{info}
			</TypographyBase>
			{children}
		</article>
	)
}

export default function Campaign({ web3, setStore, store }) {

	const router = useRouter()
	const address = useMemo(() => router.query.address, [router.query])
	const { contract } = useNewContract({ contractData: { abi: campaignJson.interface, address }, web3 })
	const [showContributionForm, setShowContributionForm] = useState(false)
	const [showCreateRequestForm, setShowCreateRequestForm] = useState(false)

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
	
	return (
		<>
			<main className='my-12 max-w-[85vw] mx-auto animate-fade-in'>
				<div>
					<div className='my-8 flex items-center justify-start flex-wrap gap-y-8 gap-x-32 lg:justify-between'>
						<H2 as='h1' className='text-md'>
							Campaign deployed at <span className='text-white/60 max-w-[400px] md:text-[1.6rem] overflow-hidden text-ellipsis text-md block'>{address}</span>
						</H2>
						<PrimaryBtn onClick={() => setShowContributionForm(true)} className='text-purple-300'>Contribute</PrimaryBtn>
					</div>
					<div className='my-8 flex justify-start flex-wrap gap-y-8 gap-x-8'>
						<InfoCard
							details={'Manager'}
							title={contractSummary.manager}
							info={'The manager is the creator of this contract and can create requests to withdraw funds.'}>
							{store.primaryAccount?.toLowerCase() === contractSummary.manager?.toLowerCase() ?
								<small className='text-purple-100'>
									You are the manager of this campaign.
								</small> : null}
						</InfoCard>
						<InfoCard
							details={'About This Campaign'}
							title={contractSummary.about}
							info={''} />
						<InfoCard
							details={'Campaign Balance'}
							title={`${contractSummary.balance} ether`}
							info={'The currrent financial balance of this campaign.'} />
						<InfoCard
							details={'Minimum Contribution'}
							title={`${contractSummary.minimumContribution} wei`}
							info={'This is the minimum amount that can be contributed to this campaign.'} />
						<InfoCard
							details={'Total Count Of Spending Requests'}
							title={`${contractSummary.requestsLength} Spending Requests`}
							info={'Spending requests are requests made by the manager of the contract to withdraw funds.'}>
							<div className='flex flex-wrap gap-x-6'>
								{contractSummary.requestsLength > 0 ? <SecondaryBtn 
									onClick={() => router.push(`/campaigns/${address}/requests?count=${contractSummary.requestsLength}`)}
									className='px-4 text-sm mb-2 mt-3 text-purple-200 border border-current py-2'>
									View Requests
								</SecondaryBtn> :
									<TypographyBase className='text-white/80' as='small'>No spending requests have been created</TypographyBase>}
								{
									store.primaryAccount === contractSummary.manager &&
									<SecondaryBtn  onClick={() => setShowCreateRequestForm(true)}  className='px-4 text-sm mb-2 mt-3 text-green-200 border border-current py-2'>Create Request </SecondaryBtn>
								}
							</div>
						</InfoCard>
						<InfoCard
							details={'Current amount of contributors'}
							title={contractSummary.totalContributors}
							info={'The number of people who have contributed to this campaign.'} />
					</div>
				</div>
			</main>
			<ContributionForm 
				show={showContributionForm}
				close={() => setShowContributionForm(false)}
				campaign={contract}
				setStore={setStore}
				primaryAccount={store.primaryAccount}
				web3={web3}
			/>
			<CreateRequestForm
				show={showCreateRequestForm}
				close={() => setShowCreateRequestForm(false)}
				campaign={contract}
				setStore={setStore}
				primaryAccount={store.primaryAccount} 
				web3={web3}
			/>
		</>
	)
}