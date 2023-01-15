import { PrimaryBtn } from './Buttons'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default function ContributionButton() {
	const router = useRouter()
	const address = useMemo(() => router.query.address, [router.query])

	return (
		<PrimaryBtn onClick={() => router.push(`/campaigns/${address}/contribute`)} className='text-purple-300'>Contribute</PrimaryBtn>
	)
}