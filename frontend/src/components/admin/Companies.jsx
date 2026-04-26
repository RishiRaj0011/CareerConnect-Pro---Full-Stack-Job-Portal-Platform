import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Building2, Plus, Search } from 'lucide-react'

const Companies = () => {
    const [input, setInput] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSearch = (e) => {
        setInput(e.target.value)
        dispatch(setSearchCompanyByText(e.target.value))
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-8'>
                <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center'>
                            <Building2 className='w-5 h-5 text-[#6A38C2]' />
                        </div>
                        <div>
                            <h1 className='text-xl font-bold text-gray-900'>Companies</h1>
                            <p className='text-sm text-gray-500'>Manage your registered companies</p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/admin/companies/create')}
                        className='bg-[#6A38C2] hover:bg-[#5b30a6] flex items-center gap-1.5'>
                        <Plus className='w-4 h-4' /> New Company
                    </Button>
                </div>

                <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4'>
                    <div className='relative max-w-sm'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <Input
                            className='pl-9'
                            placeholder='Search companies...'
                            value={input}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <CompaniesTable />
            </div>
        </div>
    )
}

export default Companies
