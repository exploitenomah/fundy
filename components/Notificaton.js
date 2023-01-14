import { FaTimes } from 'react-icons/fa'
import { ButtonBase } from './Buttons'



export default function Notification({ show, message, status, hide}) {

	return(
		<div
			className={`
      fixed z-[999999] top-[18px] left-[50%] translate-x-[-50%]
      px-4 py-6 border border-current shadow-sm rounded-md
      ${show ? 'block' : 'hidden'} max-w-md max-h-32
      ${status === 'error' ? 'bg-red-500 text-white' : ''}
      ${status === 'info' ? 'bg-blue-300 text-slate-100' : ''}
      ${status === 'success' ? 'bg-emerald-300 text-slate-100' : ''}
     `}
			role='alert' aria-live='assertive' title={message}>
			<span className='whitespace-nowrap text-ellipsis overflow-hidden block'>{message}</span>
			<ButtonBase 
				onClick={hide}
				className='absolute flex justify-center items-center rounded-full right-[-12px] top-[-12px] \n
        w-8 h-8 bg-white text-black'><FaTimes /></ButtonBase>
		</div>
	)
}