import Image from 'next/image'
// import suffer from '../../public/images/suffer.png'
export default function Home() {
  return (
    <main>
      <div className=' w-[700px] h-[700px] bg-red-300'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          src='/images/suffer.png'
          className='w-[500px] h-[500px]'
          alt='suffer'
        /> */}
        <Image
          src='https://images.pexels.com/photos/19400187/pexels-photo-19400187/free-photo-of-cat-sa-m-c-xe-h-i-du-l-ch.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt='pexels'
          width={600}
          height={400}
          quality={100}
          className='w-[500px] h-[500px]'
          title='pexels'
        />
      </div>
    </main>
  )
}
