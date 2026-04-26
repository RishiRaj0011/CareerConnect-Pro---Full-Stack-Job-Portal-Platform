import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'

export const BackButton = ({ label = "Back" }) => {
    const navigate = useNavigate()
    return (
        <Button variant='ghost' size='sm' onClick={() => navigate(-1)}
            className='flex items-center gap-1.5 text-gray-500 hover:text-[#6A38C2] mb-4'>
            <ArrowLeft className='w-4 h-4' /> {label}
        </Button>
    )
}

export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4'>
            {Icon && <Icon className='w-10 h-10 text-[#6A38C2] opacity-60' />}
        </div>
        <h3 className='text-lg font-semibold text-gray-700 mb-1'>{title}</h3>
        <p className='text-sm text-gray-400 max-w-xs mb-4'>{description}</p>
        {action}
    </div>
)
