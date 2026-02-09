import React from 'react'

export const Title = ({children,subheading})=> {

    return(
        <div className='items-start justify-start'>
            <h3 className='text-sm text-gray-500 font-semibold tracking-wide capitalize '>{subheading}</h3>         
        </div>
    )
}