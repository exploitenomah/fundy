import { ButtonBase, PrimaryBtn } from '../components/Buttons'


export default function Home() {


  return (
    <div className='min-h-[300vh]'>
    <main className='min-h-[95vh] flex px-8 items-center bg-hero-pattern-mobile md:bg-hero-pattern bg-cover bg-no-repeat bg-blend-multiply bg-center'>
      <div>
        <h1 className='text-white text-4xl md:text-7xl font-light'>
          Bring <span className='text-purple-300'>Ideas</span> to life
        </h1>
        <i className='text-white text-xs capitalize font-bold'>yours, mine, theirs, ours</i>
        <div className='flex gap-x-5 my-5'>
          <PrimaryBtn>Campaigns</PrimaryBtn>
          <PrimaryBtn>Create Mine</PrimaryBtn>
        </div>
      </div>
    </main>
     <p className='text-purple-300'>Hellowerjer</p>
    </div>
  )
}

Home.title = 'Fundy'