import { createElement, useCallback } from 'react'



export const ButtonBase = ({ children, onClick, as, ...props}) => {

	const handleClick = useCallback((e) => {
		//post button click
		// e.target.dataset.name
		onClick && onClick(e)
	}, [onClick])

	if(as){
		return (
			createElement(
				as,
				{...props, className: `whitespace-nowrap cursor-pointer ${props.className}`},
				children
			)
		)
	}

	return (
		<button {...props} 
			className={`whitespace-nowrap cursor-pointer ${props.className}`}
			onClick={handleClick}>
			{children}
		</button> 
	)
}

export const PrimaryBtn = ({ children, className, ...otherProps}) => {

	return (
		<ButtonBase 
      {...otherProps}
			className={`border uppercase text-sm font-bold px-4 py-3 relative bg-transparent text-white
    before:border-t before:border-l after:border-b after:border-r hover:scale-[101.5%] 
    transition-all duration-500
    hover:before:w-4/5 hover:before:h-4/5 hover:after:w-4/5 hover:after:h-4/5
    hover:before:top-[-6px] hover:before:left-[-6px] before:transition-all
    hover:after:bottom-[-6px] after:right-[-6px] after:transition-all
    before:duration-500 after:duration-500
    before:absolute after:absolute before:top-[-5px] before:left-[-5px] 
    after:bottom-[-5px]
    after:w-[15px] after:h-[15px] after:border-current
    before:w-[15px] before:h-[15px] before:border-current
    ${className} 
    `}>{children}</ButtonBase>
	)
}

export const SecondaryBtn = ({ children, className, ...otherProps }) => {
	return (
		<ButtonBase 
      {...otherProps}
			className={`relative uppercase text-center bg-transparent text-white
    before:border-t before:border-l after:border-b after:border-r hover:scale-[101.5%] 
    transition-all duration-500
    hover:before:w-[15px] hover:before:h-[15px] hover:after:w-[15px] hover:after:h-[15px]
    before:transition-all hover:before:opacity-100 hover:after:opacity-100
    after:transition-all
    before:duration-500 after:duration-500
    before:absolute after:absolute before:top-[-5px] before:left-[-12px] 
    after:bottom-[-8px] after:right-[-12px] 
    after:w-0 after:h-0 after:border-current after:opacity-0
    before:w-0 before:h-0 before:border-current before:opacity-0
      ${className} 
    `}>{children}</ButtonBase>
	)
}