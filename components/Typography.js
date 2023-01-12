import { createElement } from 'react'

export default function TypographyBase({ children, className, as, ...props}) {

	const typographyClassName = `prose prose-lg lg:prose-xl leading-normal tracking-wide drop-shadow-xl ${className}`
	if(as){
		return (
			createElement(
				as,
				{...props, className: typographyClassName},
				children
			)
		)
	}

	return (
		<p className={typographyClassName}>
			{children}
		</p>
	)
}