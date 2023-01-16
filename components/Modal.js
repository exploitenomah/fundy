
import { useMemo, useEffect } from 'react'

export default function Modal({ children, show, keepMounted, hide, modalClassName }) {

	const modalsInDom = useMemo(() => {
		return Array.from(document.querySelectorAll('[data-modal=\'true\']'))
	}, [])

	const zIndexContent = useMemo(() => modalsInDom.length > 1 ? (`z-[${Math.max(...modalsInDom.map((el) => +el.style.zIndex)) + 10000}]`) : 'z-[10000]', [modalsInDom])
	const zIndexBackdrop = useMemo(() => modalsInDom.length > 1 ? (`z-[${Math.max(...modalsInDom.map((el) => +el.style.zIndex)) + 10000}]`) : 'z-[10000]', [modalsInDom])

	useEffect(() => {

	}, [])


	const ModalContent = () => {
		return (
			<div className={`${modalClassName}`}>
				{children}
			</div>
		)
	}

	if (keepMounted) {
		return (
			<div role='presentation' tabIndex={-1}>
				<div 
					onClick={hide} 
					className={`${show ? 'fixed transition-all duration-300 inset-0 h-screen w-screen bg-black/90' : 'hidden'} ${zIndexBackdrop}`}></div>
				<div 
					data-modal={'true'} 
					className={`fixed transition-all duration-300 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${zIndexContent} 
						flex justify-center items-center 
						${show ? 'opacity-100 visible' : 'opacity-0 collapse'}`}>
					<ModalContent />
				</div>
			</div>
		)
	}

	return (
		<div role='dialog' tabIndex={-1}>
			{show ?
				<>
					<div 
						onClick={hide} 
						className={`${show ? 'fixed transition-all duration-300 inset-0 h-screen w-screen bg-black/90' : 'hidden'} ${zIndexBackdrop}`}></div>
					<div onClick={(e) => {
						e.stopPropagation()
						if (e.target === e.currentTarget) {
							hide()
						}
					}} data-modal="true" className={`fixed transition-all duration-300 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${zIndexContent} flex justify-center items-center overflow-auto`}>
						<ModalContent />
					</div> 
				</>
				:
				<></>}
		</div>
	)
}