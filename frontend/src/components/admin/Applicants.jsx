import React from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'

const fetchApplicants = async (jobId) => {
    const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, { withCredentials: true });
    // backend now returns { job, applications, pagination }
    return res.data;
};

const Applicants = () => {
    const { id: jobId } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ["applicants", jobId],
        queryFn:  () => fetchApplicants(jobId),
        enabled:  !!jobId,
    });

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>
                    Applicants {isLoading ? "..." : (data?.pagination?.total ?? 0)}
                </h1>
                <ApplicantsTable applications={data?.applications ?? []} isLoading={isLoading} jobId={jobId} />
            </div>
        </div>
    )
}

export default Applicants
