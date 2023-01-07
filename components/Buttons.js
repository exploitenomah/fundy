import { ButtonHTMLAttributes, createElement, MouseEventHandler, useCallback } from "react"


const sharedBtnClasses = "rounded-md font-semibold text-md uppercase min-w-[150px] py-5 px-4"

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

export const PrimaryBtn = ({ children, className, }) => {

  return (
    <ButtonBase 
    className={`border uppercase text-sm font-bold px-4 py-3 relative bg-transparent text-white
    before:border-t before:border-l after:border-b after:border-r hover:scale-[101.5%] 
    transition-all duration-500
    hover:before:w-4/5 hover:before:h-4/5 hover:after:w-4/5 hover:after:h-4/5
    hover:before:top-[-6px] hover::before:left-[-6px] before:transition-all
    hover:after:bottom-[-6px] after:right-[-6px] after:transition-all
    before:duration-500 after:duration-500
    before:absolute after:absolute before:top-[-5px] before:left-[-5px] 
    after:bottom-[-5px] after:right-[-5px]z
    after:w-[15px] after:h-[15px] after:border-current
    before:w-[15px] before:h-[15px] before:border-current
    ${className} 
    `}>{children}</ButtonBase>
  )
}