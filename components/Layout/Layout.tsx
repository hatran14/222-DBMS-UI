import React from 'react'
import Sidebar from '../Sidebar/Sidebar'

const Layout = (props: any) => {
    return (
        <div className='grid grid-cols-6'>
            <div className='col-span-1'>
                <Sidebar />
            </div>
            <div className='col-span-5 w-full px-5 py-5'>
                {props.children}
            </div>
        </div>
    )
}

export default Layout