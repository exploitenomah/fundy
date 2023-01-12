

export default function DefaultLoader({ children }) {

	return (
		<div 
			aria-busy={true} 
			role="progressbar" 
			aria-valuetext="Loading Application ndetermined" 
			aria-live="assertive"
			className='h-screen w-screen flex items-center justify-center flex-col'
			style={{ perspective: '200px'}} >
			<div className="w-[100px] h-[100px] bg-white rounded-xl animate-defaultLoader my-3"></div>
			{children}
		</div>
	)
}