import React from 'react'
import LatestJobCards from './LatestJobCards'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { JobCardSkeleton } from './ui/skeletons'

const LatestJobs = () => {
    const { data: allJobs = [], isLoading } = useGetAllJobs()

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'>
                <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings
            </h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
                    : allJobs.length === 0
                        ? <span className='col-span-3 text-center text-gray-400 py-10'>No Job Available</span>
                        : allJobs.slice(0, 6).map(job => <LatestJobCards key={job._id} job={job} />)
                }
            </div>
        </div>
    )
}

export default LatestJobs
