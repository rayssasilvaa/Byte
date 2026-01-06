import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className='bg-white shadow'>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <h1 className='text-2xl font-bold text-gray-800'>Byte</h1>

                <div className='lg:hidden'>
                    <button onClick={() => setIsOpen(!isOpen)} className='text-gray-600 focus:outline-none'>
                        {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                    </button>
                </div>

                <nav className='hidden lg:flex space-x-8'>
                    <Link to="/" className='block text-blue-900 font-bold'>Início</Link>
                    <Link to="/mensal" className='block text-blue-900 font-bold'>Mensal</Link>
                    <Link to="/diaria" className='block text-blue-900 font-bold'>Diária</Link>

                </nav>
            </div>

            {isOpen && (
                <div className='lg:hidden px-4 pb-4 space-y-2'>
                    <Link to="/" className='block text-blue-900 font-bold'>Início</Link>
                    <Link to="/mensal" className='block text-blue-900 font-bold'>Mensal</Link>
                </div>
            )}
        </header>
    )
}

export default Header
