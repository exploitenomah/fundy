import { useCallback } from 'react'
import { PrimaryBtn } from '../../../components/Buttons'
import { H3 } from '../../../components/Headings'

export default function ContributionForm({ campaign, account, setStore }) {

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault()
		let status, message
		try{
			const contributed = await campaign.methods.contribute().send({
				from: account,
				gas: 3000000
			})
			console.log(contributed)
			status = 'success'
			message = 'Successfully contributed. You are now an approver of this campaign!'
		}catch(err){
			console.error(err)
			status = 'error'
			message = err.messaage
		}finally{
			setStore(prev => ({
				...prev, 
				message: message,
				showMsg: true,
				msgStatus: status
			}))
		}
	}, [])

	return (
		<form onSubmit={handleSubmit} className='my-6 px-7 flex flex-col gap-y-6 text-white/60'>
			<H3 className='text-center'>Contribute.</H3>
			<div role='group' className='flex flex-col gap-y-2'>
				<label htmlFor='contribution'>Contribution (in wei)</label>
				<input
					min='1'
					required
					name='contribution'
					id='contribution'
					className='border border-current block w-full py-2 px-3'
					aria-label='contribution'
					placeholder='Eg: 1'
					type='number' />
			</div>
			<PrimaryBtn type='submit' className='rounded-sm mt-4 mx-auto before:hidden after:hidden hover:text-purple-300 \n
			hover:border-current block max-w-2/4'>Contribute</PrimaryBtn>
		</form>
	)
}