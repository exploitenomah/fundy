
import Link from 'next/link'
import { SecondaryBtn, PrimaryBtn } from '../../components/Buttons'
import { H1 } from '../../components/Headings'
import DefaultLoader, { TextLoader } from '../../components/Loader'
import TypographyBase from '../../components/Typography'

export default function Campaigns({ store }) {


	if(store.loading){
		return (
			<main className='flex items-center justify-center h-[75vh]'>
				<div>
					<DefaultLoader />
					<TextLoader text='getting campaigns...' />
				</div>
			</main>
		)
	}

	return (
		<div className='max-w-[85vw] mx-auto animate-fade-in'>
			<main className='py-16'>
				<H1>Open Campaigns</H1>
				<TypographyBase className='text-white/80'>
					Discover campaigns to fund...
				</TypographyBase>
				{store.campaigns.length === 0 && 
				<div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center'>
					<div>
						No Campaigns to show
					</div>
					<Link className='my-8 block' href='/campaigns/new'>
						<PrimaryBtn as='span'>Create Mine</PrimaryBtn>
					</Link>
				</div>}
				<ul className='my-8 flex justify-start items-start gap-x-8 gap-y-6 flex-wrap'>
					{store.campaigns.map(campaign => (
						<li 
							className='flex flex-col border bg-white/10 px-6 py-4'
							key={campaign}>
							<span className='inline-block'>Campaign at </span>
							<span 
								title={campaign}
								className='inline-block p-0 m-0 w-[250px] overflow-hidden text-ellipsis'>{campaign}</span>
							<Link className='my-8 w-fit inline-block' passHref href={`/campaigns/${campaign}`}>
								<SecondaryBtn className='text-purple-300 px-2 py-2 border border-current hover:border-transparent' as='span'>View Campaign</SecondaryBtn>
							</Link>
						</li>
					))}
				</ul>
			</main>
		</div>
	)
}