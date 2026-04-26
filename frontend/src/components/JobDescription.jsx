import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { MapPin, Clock, Briefcase, DollarSign, Users, Calendar, CheckCircle2, Gift } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import Navbar from './shared/Navbar'
import { BackButton } from './shared/PageHelpers'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { getApiError } from '@/utils/apiError'
import { JobCardSkeleton } from './ui/skeletons'

const fetchJob = async (jobId) => {
    const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
    return res.data.job
}

const InfoChip = ({ icon: Icon, label, value }) => (
    <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2'>
        <Icon className='w-4 h-4 text-[#6A38C2] flex-shrink-0' />
        <div>
            <p className='text-xs text-gray-400'>{label}</p>
            <p className='text-sm font-semibold text-gray-800'>{value}</p>
        </div>
    </div>
)

const JobDescription = () => {
    const { id: jobId } = useParams()
    const { user } = useSelector(s => s.auth)
    const queryClient = useQueryClient()
    const [applying, setApplying] = useState(false)

    const { data: job, isLoading, isError } = useQuery({
        queryKey: ['job', jobId],
        queryFn:  () => fetchJob(jobId),
        enabled:  !!jobId,
    })

    const alreadyApplied = job?.applications?.some(
        app => String(app.applicant) === String(user?._id)
    ) ?? false

    const [isApplied, setIsApplied] = useState(false)
    React.useEffect(() => { setIsApplied(alreadyApplied) }, [alreadyApplied])

    const applyJobHandler = async () => {
        if (!user) { toast.error('Please login to apply for jobs'); return }
        try {
            setApplying(true)
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true })
            if (res.data.success) {
                setIsApplied(true)
                queryClient.invalidateQueries({ queryKey: ['appliedJobs'] })
                queryClient.invalidateQueries({ queryKey: ['job', jobId] })
                toast.success(res.data.message)
            }
        } catch (err) {
            toast.error(getApiError(err))
        } finally {
            setApplying(false)
        }
    }

    const isDeadlinePassed = job?.deadline && new Date(job.deadline) < new Date()

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <BackButton />

                {isLoading ? (
                    <div className='grid gap-4'><JobCardSkeleton /><JobCardSkeleton /></div>
                ) : isError || !job ? (
                    <div className='bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm'>
                        <p className='text-red-500 font-medium'>Failed to load job details.</p>
                        <p className='text-gray-400 text-sm mt-1'>Please go back and try again.</p>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {/* Header Card */}
                        <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6'>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='flex items-start gap-4'>
                                    <Avatar className='h-14 w-14 rounded-xl border'>
                                        <AvatarImage src={job.company?.logo} />
                                        <AvatarFallback className='rounded-xl bg-purple-100 text-[#6A38C2] font-bold text-lg'>
                                            {job.company?.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className='text-2xl font-bold text-gray-900'>{job.title}</h1>
                                        <p className='text-gray-500 font-medium mt-0.5'>{job.company?.name}</p>
                                        <div className='flex items-center gap-1.5 mt-1 text-gray-400 text-sm'>
                                            <MapPin className='w-3.5 h-3.5' />
                                            {job.company?.location || job.location}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end gap-2 flex-shrink-0'>
                                    {isDeadlinePassed ? (
                                        <Badge variant='destructive' className='text-xs'>Applications Closed</Badge>
                                    ) : (
                                        <Button
                                            onClick={isApplied ? undefined : applyJobHandler}
                                            disabled={isApplied || applying || isDeadlinePassed}
                                            className={`min-w-[120px] ${isApplied ? 'bg-green-600 hover:bg-green-600' : 'bg-[#6A38C2] hover:bg-[#5b30a6]'}`}>
                                            {applying ? 'Applying...' : isApplied ? (
                                                <><CheckCircle2 className='w-4 h-4 mr-1' /> Applied</>
                                            ) : 'Apply Now'}
                                        </Button>
                                    )}
                                    {job.deadline && (
                                        <p className={`text-xs ${isDeadlinePassed ? 'text-red-500' : 'text-gray-400'}`}>
                                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Info chips */}
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5'>
                                <InfoChip icon={DollarSign} label="Salary"     value={`₹${job.salary} LPA`} />
                                <InfoChip icon={Briefcase}  label="Job Type"   value={job.jobType} />
                                <InfoChip icon={Clock}      label="Experience" value={`${job.experienceLevel} yr${job.experienceLevel !== 1 ? 's' : ''}`} />
                                <InfoChip icon={Users}      label="Openings"   value={`${job.position} Position${job.position !== 1 ? 's' : ''}`} />
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6'>
                            <h2 className='font-bold text-lg mb-3'>Job Description</h2>
                            <p className='text-gray-600 text-sm leading-relaxed'>{job.description}</p>

                            {job.requirements?.length > 0 && (
                                <div className='mt-5'>
                                    <h3 className='font-semibold text-gray-800 mb-2'>Requirements</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {job.requirements.map((r, i) => (
                                            <span key={i} className='px-3 py-1 bg-purple-50 text-[#6A38C2] rounded-full text-xs font-medium'>{r}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.benefits?.length > 0 && (
                                <div className='mt-5'>
                                    <h3 className='font-semibold text-gray-800 mb-2 flex items-center gap-1.5'>
                                        <Gift className='w-4 h-4 text-[#6A38C2]' /> Benefits
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {job.benefits.map((b, i) => (
                                            <span key={i} className='px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium'>{b}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Meta Card */}
                        <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6'>
                            <h2 className='font-bold text-lg mb-3'>Overview</h2>
                            <div className='grid grid-cols-2 gap-y-3 text-sm'>
                                {[
                                    ['Posted On',        job.createdAt?.split('T')[0]],
                                    ['Total Applicants', job.applications?.length ?? 0],
                                    ['Location',         job.location],
                                    ['Deadline',         job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'],
                                ].map(([label, val]) => (
                                    <div key={label}>
                                        <p className='text-gray-400 text-xs'>{label}</p>
                                        <p className='font-medium text-gray-800'>{val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobDescription
