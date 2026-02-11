import * as React from 'react'

interface CommonHeaderProps {}

const CommonHeader: React.FC<CommonHeaderProps> = () => {
  return (
    <header className='fixed top-0 left-0 right-0 bg-white shadow-md z-40'>
      <div className='w-full px-4'>
        <h2>Common Header</h2>
      </div>
    </header>
  )
}
export default CommonHeader
