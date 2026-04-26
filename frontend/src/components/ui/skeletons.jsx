import React from 'react'

export const JobCardSkeleton = () => (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 animate-pulse'>
        <div className='h-4 bg-gray-200 rounded w-1/2 mb-2' />
        <div className='h-3 bg-gray-100 rounded w-1/4 mb-4' />
        <div className='h-5 bg-gray-200 rounded w-3/4 mb-2' />
        <div className='h-3 bg-gray-100 rounded w-full mb-4' />
        <div className='flex gap-2'>
            <div className='h-6 bg-gray-200 rounded-full w-20' />
            <div className='h-6 bg-gray-200 rounded-full w-20' />
            <div className='h-6 bg-gray-200 rounded-full w-20' />
        </div>
    </div>
)

export const TableRowSkeleton = ({ cols = 4 }) => (
    <tr className='animate-pulse'>
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className='px-4 py-3'>
                <div className='h-4 bg-gray-200 rounded w-full' />
            </td>
        ))}
    </tr>
)
