import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='bg-slate-800 text-white'>
      <Link to={'/my-forms'} className='font-medium text-[1.20rem] tracking-wide py-2 px-5 inline-block hover:bg-slate-700'>
        My Forms
      </Link>
    </div>
  )
}
