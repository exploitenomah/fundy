import Head from 'next/head'
import { Dancing_Script } from '@next/font/google'
import { useState, useEffect, useCallback } from 'react'
import { FaHamburger } from 'react-icons/fa'
import { GiCrossedSwords } from 'react-icons/gi'
import Link from 'next/link'
import { SecondaryBtn } from './Buttons'

const Navigation = ({ showMobileNav, closeMobileNav }) => {
	const listItems = [{
		name: 'campaigns', path: '/campaigns'
	}, {
		name: 'create mine', path: '/campaigns/new'
	}]

	return (
		<>
			<ul className='hidden md:flex md:gap-x-12'>
				{listItems.map(item => <li key={item.name}>
					<SecondaryBtn as='span' >
						<Link href={item.path}>{item.name}</Link>
					</SecondaryBtn>
				</li>)}
			</ul>
			<ul className={`${showMobileNav ? 'w-[80vw]' : 'w-0'} transition-all
        duration-300 bg-gradient-to-bl from-purple-400 to-black  text-white min-h-72
        flex items-center justify-around z-[100] whitespace-nowrap shadow-white/05 shadow-sm
        md:hidden fixed top-0 left-0 overflow-hidden py-8`}>
				{listItems.map(item =>
					<li key={item.name}>
						<Link onClick={closeMobileNav} href={item.path}>
							<SecondaryBtn as='span' className='text-white'>{item.name}</SecondaryBtn>
						</Link>
					</li>)}
			</ul>
			{showMobileNav && <div onClick={closeMobileNav} className='fixed z-[99] w-screen h-screen bg-transparent' />}
		</>
	)
}
const dancing_script = Dancing_Script({ subsets: ['latin'] })

export default function Layout ({ children, title }) {
	const [isScrolling, setIsScrolling] = useState(false)
	const [showMobileNav, setShowMobileNav] = useState(false)

	const toggleNavShown = useCallback(() => {
		setShowMobileNav(prev => !prev)
	}, [])

	useEffect(() => {
		window.addEventListener('scroll', () => {
			if (window.scrollY >= 60) setIsScrolling(true)
			else setIsScrolling(false)
		})
		window.addEventListener('resize', () => {
			if (window.innerWidth >= 768 && window.document.body.classList.contains('overflow-hidden'))
				window.document.body.classList.remove('overflow-hidden')
			else if (showMobileNav && window.innerWidth < 768) window.document.body.classList.add('overflow-hidden')
		})
		if(showMobileNav) window.document.body.classList.add('overflow-hidden')
		if(!showMobileNav) window.document.body.classList.remove('overflow-hidden')
	}, [showMobileNav])

	return (
		<>
			<Head>
				<title>{title || 'Fundy'}</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
				<meta property='og:locale' content='en_US' />
				<meta property='og:description' content='Fundy' />
				<meta property='og:site_name' content={'Fundy'} />
				<meta property='og:type' content='website' />
				<meta property='og:image' content='https://fundy-ten.vercel.app/site-img.png' />
				<meta property='og:url' content='https://fundy-ten.vercel.app/' />
			</Head>
			<div>
				<header className={`sticky ${isScrolling ? 'bg-black/30 backdrop-blur-[3px]' : 'bg-black/50'} top-0 left-0 \n
         right-0 w-full transition-all z-[90]`}>
					<div className='w-[85vw] py-5 flex justify-between items-center mx-auto '>
						<div className={`${dancing_script.className} text-5xl text-white capitalize`}>
							<Link href='/'>Fundy</Link>
						</div>
						<button
							onClick={toggleNavShown}
							className='text-white md:hidden relative block w-8 h-8'
							aria-label='toggle navigation'
							type='button'
							name='toggle navigation'
							value='toggle navigation'>
							<FaHamburger className={`absolute w-full h-full inset-0 transition-all duration-75 ${showMobileNav ? 'scale-0' : 'scale-1'} `} size={32} />
							<GiCrossedSwords  className={`absolute w-full h-full inset-0 transition-all duration-75 z-[100] ${showMobileNav ? 'scale-1' : 'scale-0'} `} size={32} />
						</button>
						<Navigation showMobileNav={showMobileNav} closeMobileNav={toggleNavShown} />
					</div>
				</header>
				<div className='min-h-[80vh] text-white'>
					{children}
				</div>
				<footer className={'bg-black w-screen px-8 py-5 flex flex-col gap-y-2 border-t border-t-purple-300/30 justify-center items-center transition-all'}>
					<Link href='/'><span className={`${dancing_script.className} text-3xl text-white capitalize`}>Fundy</span></Link>
					<small className='text-white'>&copy; fundy 2023</small>
				</footer>
			</div>
		</>

	)
}
