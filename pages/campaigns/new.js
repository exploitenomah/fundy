
import { PrimaryBtn } from '../../components/Buttons'
import { H1 } from '../../components/Headings'
import { useState, useCallback } from 'react'
import DefaultLoader, { TextLoader } from '../../components/Loader'
import { useRouter } from 'next/router'

export default function NewCampaign({ setStore, factory, web3 }) {
	const router = useRouter()
	const [newCampaign, setNewCampaign] = useState({
		minContribution: 0,
		description: ''
	})
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = useCallback((e) => {
		setNewCampaign(prev => ({
			...prev, [e.target.name]: e.target.value
		}))
	}, [])

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault()
		let status, message
		try {
			setIsLoading(true)
			const [ account ] = await web3.eth.getAccounts()
			const minContribution = parseInt(newCampaign.minContribution)
			const description = newCampaign.description.trim()
			if (description.trim().length === 0) {
				message = ('Please add a valid description!')
				status = 'error'
				return
			}
			await factory.methods
				.createCampaign(minContribution, description)
				.send({
					from: account, gas: 3000000
				})
			status = 'success'
			message = 'Successfully created campaign!'
			setNewCampaign({description: '', minContribution: 0})
			setTimeout(() => {
				router.push('/campaigns')
			}, 1500)
		}catch(err){
			console.error(err)
			status = 'error'
			message = err.message
		}finally{
			setIsLoading(false)
			setStore(prev => ({ 
				...prev, 
				message: message,
				showMsg: true,
				msgStatus: status
			}))
		}
	}, [newCampaign])

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
		<div className='flex justify-center items-center min-h-[80vh] animate-fade-in'>
			<main className='rounded-lg w-[85vw] max-w-md border border-white/10 mx-auto py-8 text-left bg-gradient-to-bl \n
     from-purple-300/10 to-black/25 backdrop-blur-xl my-2'>
				<H1 className='text-center'>Get Started.</H1>
				<form onSubmit={handleSubmit} className='my-6 px-7 flex flex-col gap-y-6 text-white/60'>
					<div role='group' className='flex flex-col gap-y-2'>
						<label htmlFor='campaign description'>Campaign Description</label>
						<textarea
							maxLength='250'
							value={newCampaign.description}
							onChange={handleChange}
							name='description'
							required
							id='campaign description'
							inputMode='text'
							placeholder='Describe your campaign'
							className='border border-current block w-full py-2 px-3 min-h-[200px] max-h-[200px]'
							aria-label='campaign description' />
					</div>
					<div role='group' className='flex flex-col gap-y-2'>
						<label htmlFor='minimum contribution'>Minimum Contribution (in wei)</label>
						<input
							min='1'
							value={newCampaign.minContribution}
							onChange={handleChange}
							required
							name='minContribution'
							id='minimum contribution'
							className='border border-current block w-full py-2 px-3'
							aria-label='minimum contribution'
							placeholder='Eg: 1'
							type='number' />
					</div>
					<PrimaryBtn type='submit' className='rounded-sm mt-4 mx-auto before:hidden after:hidden hover:text-purple-300 \n
         hover:border-current block max-w-2/4'>Create Campaign</PrimaryBtn>
				</form>
			</main>
		</div>
	)
}