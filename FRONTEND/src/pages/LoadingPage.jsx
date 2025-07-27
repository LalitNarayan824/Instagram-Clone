import mainlogo from '../assets/main-logo.png'

const LoadingPage = () => {
  return (
    <div className='bg-black h-screen w-screen flex items-center justify-center '>
      <img src={mainlogo} alt="main logo" className='h-[100px] w-[100px] ' />
      
    </div>
  )
}

export default LoadingPage
