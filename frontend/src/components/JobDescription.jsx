import React, { useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiError } from '@/utils/apiError'

// ── Atomic sub-components ──────────────────────────────────────────────────

const JobBadges = ({ position, jobType, salary }) => (
    <div className='flex items-center gap-2 mt-4'>
        <Badge className='text-blue-700 font-bold' variant="ghost">{position} Positions</Badge>
        <Badge className='text-[#F83002] font-bold' variant="ghost">{jobType}</Badge>
        <Badge className='text-[#7209b7] font-bold' variant="ghost">{salary} LPA</Badge>
    </div>
);

const JobDetailRow = ({ label, value }) => (
    <h1 className='font-bold my-1'>
        {label}: <span className='pl-4 font-normal text-gray-800'>{value}</span>
    </h1>
);

// ── Fetch function ─────────────────────────────────────────────────────────

const fetchJob = async (jobId) => {
    const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
    return res.data.job;
};

// ── Main component ─────────────────────────────────────────────────────────

const JobDescription = () => {
    const { id: jobId } = useParams();
    const { user } = useSelector(store => store.auth);
    const queryClient = useQueryClient();

    const { data: job, isLoading, isError } = useQuery({
        queryKey: ["job", jobId],
        queryFn:  () => fetchJob(jobId),
        enabled:  !!jobId,
    });

    // FIX: applications now contain { _id, status } objects (not full applicant docs)
    // The backend getJobById populates applications with "_id status" only.
    // We track applied state locally after a successful apply action.
    const alreadyApplied = job?.applications?.some(
        (app) => String(app.applicant) === String(user?._id)
    ) ?? false;

    const [isApplied, setIsApplied] = useState(false);
    // Sync with server data once loaded
    React.useEffect(() => { setIsApplied(alreadyApplied); }, [alreadyApplied]);

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                // Invalidate so Profile's applied jobs list refreshes automatically
                queryClient.invalidateQueries({ queryKey: ["appliedJobs"] });
                queryClient.invalidateQueries({ queryKey: ["job", jobId] });
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(getApiError(error));
        }
    };

    if (isLoading) return <div className='max-w-7xl mx-auto my-10 text-gray-400'>Loading job details...</div>;
    if (isError || !job) return <div className='max-w-7xl mx-auto my-10 text-red-500'>Failed to load job. Please try again.</div>;

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{job.title}</h1>
                    <JobBadges position={job.position} jobType={job.jobType} salary={job.salary} />
                </div>
                <Button
                    onClick={isApplied ? undefined : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                >
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>

            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <JobDetailRow label="Role"             value={job.title} />
                <JobDetailRow label="Location"         value={job.location} />
                <JobDetailRow label="Description"      value={job.description} />
                <JobDetailRow label="Experience"       value={`${job.experienceLevel} yrs`} />
                <JobDetailRow label="Salary"           value={`${job.salary} LPA`} />
                <JobDetailRow label="Total Applicants" value={job.applications?.length ?? 0} />
                <JobDetailRow label="Posted Date"      value={job.createdAt?.split("T")[0]} />
            </div>
        </div>
    )
}

export default JobDescription
