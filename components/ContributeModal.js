
import Modal from './Modal'
import { useCallback, useState } from 'react'
import { PrimaryBtn } from './Buttons'
import { H3 } from './Headings'
import DefaultLoader, { TextLoader } from './Loader'

export default function ContributionForm({
	show, campaign, account, setStore, close, web3
}) {

	const [contribution, setContribution] = useState(0)
	const [isLoading, setIsLoading] = useState(false)

	const handleClose = useCallback(() => {
		setContribution(0)
		close()
	}, [close])

	const handleChange = useCallback((e) => setContribution(e.target.value), [])

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault()
		let status, message
		try{
			setIsLoading(true)
			const contributed = await campaign.methods.contribute().send({
				from: account,
				gas: 3000000,
				value: web3.utils.toWei(contribution, 'ether')
			})
			console.log(contributed)
			status = 'success'
			message = 'Successfully contributed. You are now an approver of this campaign!'
		}catch(err){
			console.error(err)
			status = 'error'
			message = err.message
		}finally{
			setStore(prev => ({
				...prev, 
				message: message,
				showMsg: true,
				msgStatus: status
			}))
			setIsLoading(false)
			handleClose()
		}
	}, [handleClose, setStore, campaign.methods.contribute, contribution])

	if (isLoading) {
		return (
			<div className='flex flex-col z-[900] bg-black/90 justify-center items-center  \n
        mx-auto fixed w-screen h-screen top-0 left-0'>
				<DefaultLoader />
				<TextLoader className='w-max-content' text='Please wait...' />
			</div>
		)
	}
	return (
		<Modal
			show={show}
			keepMounted 
			hide={handleClose}
			modalClassName={'border bg-black/70 px-6 py-4 '}>
			<form onSubmit={handleSubmit} className='my-6 px-7 flex flex-col gap-y-6 text-white/60'>
				<H3 className='text-center'>Contribute.</H3>
				<div role='group' className='flex flex-col gap-y-2'>
					<label htmlFor='contribution'>Contribution (in ether)</label>
					<input
						autoFocus
						required
						key='contribution'
						value={contribution}
						onChange={handleChange}
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
		</Modal>
	)
}