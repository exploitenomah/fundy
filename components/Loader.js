

export default function DefaultLoader({ children }) {

	return (
		<div 
			aria-busy={true} 
			role="progressbar" 
			aria-valuetext="Loading Application ndetermined" 
			aria-live="assertive"
			className='flex items-center justify-center flex-col'
			style={{ perspective: '200px'}} >
			<div className="w-[100px] h-[100px] bg-white rounded-xl animate-defaultLoader my-3"></div>
			{children}
		</div>
	)
}

export const TextLoader = ({ text, className }) => {

	return (
		<div data-text={text}
			className={`text-white relative font-black text-small uppercase \n
     before:content-[attr(data-text)] before:absolute before:text-purple-400 \n
     before:z-0 before:animate-widthChange before:overflow-hidden \n
     before:whitespace-nowrap before:w-full before:border-r before:border-r-current ${className}`}>
			{text}
		</div>
	)
}