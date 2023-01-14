
import Link from 'next/link'
import { SecondaryBtn } from '../../components/Buttons'
import { H1 } from '../../components/Headings'
import TypographyBase from '../../components/Typography'

export default function Campaigns({ store }) {

	return (
		<div className='max-w-[85vw] mx-auto'>
			<main className='py-16'>
				<H1>Open Campaigns</H1>
				<TypographyBase className='text-white/80'>
					Discover campaigns to fund...
				</TypographyBase>
				<ul className='my-8 flex justify-start items-start gap-x-8 gap-y-6 flex-wrap'>
					{store.campaigns.map(campaign => (
						<li 
							className='flex flex-col border bg-white/10 px-6 py-4'
							key={campaign}>
							<span className='inline-block'>Campaign at </span>
							<span 
								title={campaign}
								className='inline-block p-0 m-0 w-[250px] overflow-hidden text-ellipsis'>{campaign}</span>
							<Link className='my-8' passHref href={`/campaigns/${campaign}`}>
								<SecondaryBtn className='text-purple-300 px-2 py-2 border border-current hover:border-transparent' as='span'>View Campaign</SecondaryBtn>
							</Link>
						</li>
					))}
				</ul>
			</main>
		</div>
	)
}