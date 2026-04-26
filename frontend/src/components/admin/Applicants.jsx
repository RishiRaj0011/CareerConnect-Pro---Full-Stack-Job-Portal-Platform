import React from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { BackButton } from '../shared/PageHelpers'
import { Users } from 'lucide-react'

const fetchApplicants = async (jobId) => {
    const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, { withCredentials: true })
    return res.data
}

const Applicants = () => {
    const { id: jobId } = useParams()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['applicants', jobId],
        queryFn:  () => fetchApplicants(jobId),
        enabled:  !!jobId,
    })

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <BackButton />
                <div className='flex items-center gap-3 mb-6'>
                    <div className='w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center'>
                        <Users className='w-5 h-5 text-[#6A38C2]' />
                    </div>
                    <div>
                        <h1 className='text-xl font-bold text-gray-900'>
                            {data?.job?.title ?? 'Job'} — Applicants
                        </h1>
                        <p className='text-sm text-gray-500'>
                            {isLoading ? '...' : `${data?.pagination?.total ?? 0} total applicant${(data?.pagination?.total ?? 0) !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>

                {isError ? (
                    <div className='bg-white rounded-xl p-10 text-center border border-gray-100'>
                        <p className='text-red-500'>Failed to load applicants. Please try again.</p>
                    </div>
                ) : (
                    <ApplicantsTable
                        applications={data?.applications ?? []}
                        isLoading={isLoading}
                        jobId={jobId}
                    />
                )}
            </div>
        </div>
    )
}

export default Applicants
