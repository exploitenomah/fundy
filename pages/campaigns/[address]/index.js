
import campaignJson from '../../../ethereum/contractBuilds/Campaign.json'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useNewContract from '../../../hooks/useNewContract'
import TypographyBase from '../../../components/Typography'
import { H2, H3 } from '../../../components/Headings'
import ContributionForm from '../../../components/ContributeModal'
import { PrimaryBtn, SecondaryBtn } from '../../../components/Buttons'
import CreateRequestForm from '../../../components/CreateRequestModal'
import useSummary from '../../../hooks/useSummary'


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

export default function Campaign({ web3, setStore, store, runOnAccountsChange }) {

	const router = useRouter()
	const address = useMemo(() => router.query.address, [router.query])
	const { contract } = useNewContract({ contractData: { abi: campaignJson.interface, address }, web3 })
	const [showContributionForm, setShowContributionForm] = useState(Boolean(router.query.contribute))
	const [showCreateRequestForm, setShowCreateRequestForm] = useState(false)
	const [primaryAccIsContributor, setPrimaryAccIsContributor] = useState(null)
	const { contractSummary, getContractSummary } = useSummary(web3)
	const isManager = useMemo(() =>
		store.primaryAccount?.toLowerCase() === contractSummary.manager?.toLowerCase(), 
	[store.primaryAccount, contractSummary?.manager])

	const checkIsContributor = useCallback(async () => {
		if(contract.options.address){
			const isContributor = await contract.methods.contributors(store.primaryAccount).call()
			setPrimaryAccIsContributor(isContributor)
		}
	}, [contract.methods?.contribute, store.primaryAccount, contract.options?.address])
	
	useEffect(() => {		
		runOnAccountsChange(checkIsContributor)
		typeof primaryAccIsContributor !== 'boolean' && checkIsContributor()
	}, [runOnAccountsChange, checkIsContributor])

	return (
		<>
			<main className='my-12 max-w-[85vw] mx-auto animate-fade-in'>
				<div>
					<div className='my-8 flex items-center justify-start flex-wrap gap-y-8 gap-x-32 lg:justify-between'>
						<H2 as='h1' className='text-md'>
							Campaign deployed at <span className='text-white/60 max-w-[400px] md:text-[1.6rem] overflow-hidden text-ellipsis text-md block'>{address}</span>
						</H2>
						{!isManager && primaryAccIsContributor === false &&
						<PrimaryBtn onClick={() => setShowContributionForm(true)} className='text-purple-300'>Contribute</PrimaryBtn>}
					</div>
					<div className='my-8 flex justify-start flex-wrap gap-y-8 gap-x-8'>
						<InfoCard
							details={'Manager'}
							title={contractSummary.manager}
							info={'The manager is the creator of this contract and can create requests to withdraw funds.'}>
							{isManager ?
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
								{+contractSummary.requestsLength > 0 ? <SecondaryBtn 
									onClick={() => router.push(`/campaigns/${address}/requests`)}
									className='px-4 text-sm mb-2 mt-3 text-purple-200 border border-current py-2'>
									View Requests
								</SecondaryBtn> :
									<TypographyBase className='text-white/80' as='small'>No spending requests have been created</TypographyBase>}
								{
									isManager &&
									<SecondaryBtn  onClick={() => setShowCreateRequestForm(true)} className='px-4 text-sm mb-2 mt-3 text-green-200 border border-current py-2'>Create Request </SecondaryBtn>
								}
							</div>
						</InfoCard>
						<InfoCard
							details={'Current amount of contributors'}
							title={contractSummary.totalContributors}
							info={'The number of people who have contributed to this campaign.'} >
							{primaryAccIsContributor ?
								<TypographyBase className='text-white/80' as='small'>You are a contributor</TypographyBase> :
								!isManager &&
								<TypographyBase className='text-white/60 text-sm' as='small'>You are not a contributor</TypographyBase>
							}
						</InfoCard>
					</div>
				</div>
			</main>
			{!isManager && 
			<ContributionForm 
				show={showContributionForm}
				close={() => {
					setShowContributionForm(false)
					getContractSummary()
					router.replace(`/campaigns/${address}`)
				}}
				campaign={contract}
				setStore={setStore}
				primaryAccount={store.primaryAccount}
				web3={web3}
			/>}
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