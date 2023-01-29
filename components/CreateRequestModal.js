
import Modal from './Modal'
import { useCallback, useState } from 'react'
import { PrimaryBtn } from './Buttons'
import { H3 } from './Headings'
import DefaultLoader, { TextLoader } from './Loader'

export default function CreateRequestForm({
	show, campaign, primaryAccount, setStore, close, web3
}) {

	const [request, setRequest] = useState({
		description: '', value: 0, recipient: ''
	})
	const [isLoading, setIsLoading] = useState(false)

	const handleClose = useCallback(() => {
		setRequest({description: '', value: 0, recipient: ''})
		close()
	}, [close])

	const handleChange = useCallback((e) => setRequest(prev => ({...prev, [e.target.name]: e.target.value})), [])

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault()
		let status, message
		try{
			if(Object.values(request).some(val => val.toString().length === 0)){
				status = 'error'
				message = 'All fields are required!'
				throw new Error(message)
			}
			setIsLoading(true)
			const reqBody = {
				...request, value: web3.utils.toWei(request.value, 'ether')
			}
			await campaign.methods.createRequest(
				reqBody.description,
				reqBody.value,
				reqBody.recipient
			).send({
				from: primaryAccount,
				gas: 3000000,
			})
			status = 'success'
			message = 'Successfully created request!'
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
			if(status !== 'error') handleClose()
		}
	}, [handleClose, setStore, campaign.methods.createRequest, request])

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
				<H3 className='text-center text-white'>Create A New Request.</H3>
				<div role='group' className='flex flex-col gap-y-2'>
					<label htmlFor='description'>Request Description</label>
					<input
						required
						value={request.description}
						onChange={handleChange}
						name='description'
						id='description'
						className='border border-current block w-full py-2 px-3'
						aria-label='description'
						placeholder='Brief description of request'
						maxLength='100'
						type='text' />
				</div>
				<div role='group' className='flex flex-col gap-y-2'>
					<label htmlFor='value'>Value (in ether)</label>
					<input
						required
						value={request.value}
						onChange={handleChange}
						name='value'
						id='value'
						className='border border-current block w-full py-2 px-3'
						aria-label='value'
						placeholder='Eg: 1'
						type='number' />
				</div>
				<div role='group' className='flex flex-col gap-y-2'>
					<label htmlFor='recipient'>Recipient</label>
					<input
						required
						value={request.recipient}
						onChange={handleChange}
						name='recipient'
						id='recipient'
						className='border border-current block w-full py-2 px-3'
						aria-label='recipient'
						placeholder='0x5b29094...'
						minLength='42'
						maxLength='42'
						type='text' />
				</div>
				<PrimaryBtn type='submit' className='rounded-sm mt-4 mx-auto before:hidden after:hidden hover:text-purple-300 \n
					hover:border-current block max-w-2/4'>Create Request</PrimaryBtn>
			</form>
		</Modal>
	)
}