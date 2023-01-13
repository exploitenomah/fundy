import { PrimaryBtn } from '../../components/Buttons'
import TypographyBase from '../../components/Typography'

const { H1 } = require('../../components/Headings')

export default function NewCampaign() {

  return (
    <div className='flex justify-center items-center min-h-[80vh]'>
    <main className='rounded-lg w-[85vw] max-w-md border border-white/10 mx-auto py-8 text-left bg-gradient-to-bl \n
     from-purple-300/10 to-black/25 backdrop-blur-xl my-2'>
      <H1 className='text-center'>Get Started.</H1>
      <form className='my-6 px-7 flex flex-col gap-y-6 text-white/60'>
        <div role='group' className='flex flex-col gap-y-2'>
          <label htmlFor='campaign description'>Campaign Description</label>
          <textarea 
            id='campaign description'
            inputMode='text'
            placeholder='Describe your campaign'
            className='border border-current block w-full py-2 px-3 min-h-[200px] max-h-[200px]' 
            aria-label='campaign description'/>
        </div>
        <div role='group' className='flex flex-col gap-y-2'>
          <label htmlFor='minimum contribution'>Minimum Contribution</label>
          <input 
           id='minimum contribution'
           className='border border-current block w-full py-2 px-3' 
           aria-label='minimum contribution'
           placeholder='Eg: 1'
           type='number' />
        </div>
        <PrimaryBtn className='rounded-sm mt-4 mx-auto before:hidden after:hidden hover:text-purple-300 \n
         hover:border-current block max-w-2/4'>Create Campaign</PrimaryBtn>
      </form>
    </main>
    </div>
  )
}