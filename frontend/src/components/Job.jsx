import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Clock } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const daysAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const d = Math.floor(diff / (1000 * 24 * 60 * 60))
    return d === 0 ? 'Today' : `${d}d ago`
}

const Job = ({ job }) => {
    const navigate = useNavigate()
    const isDeadlinePassed = job?.deadline && new Date(job.deadline) < new Date()

    return (
        <div className='p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md hover:border-[#6A38C2]/20 transition-all cursor-pointer group'>
            {/* Top row */}
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-1.5 text-xs text-gray-400'>
                    <Clock className='w-3 h-3' />
                    {daysAgo(job?.createdAt)}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); toast.info('Job saved!') }}
                    className='p-1.5 rounded-full hover:bg-purple-50 text-gray-400 hover:text-[#6A38C2] transition-colors'>
                    <Bookmark className='w-4 h-4' />
                </button>
            </div>

            {/* Company */}
            <div className='flex items-center gap-3 mb-3'>
                <Avatar className='h-10 w-10 rounded-lg border'>
                    <AvatarImage src={job?.company?.logo} />
                    <AvatarFallback className='rounded-lg bg-purple-100 text-[#6A38C2] font-bold text-sm'>
                        {job?.company?.name?.[0]}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className='font-semibold text-sm text-gray-900'>{job?.company?.name}</h2>
                    <div className='flex items-center gap-1 text-xs text-gray-400'>
                        <MapPin className='w-3 h-3' />
                        {job?.company?.location || job?.location || 'India'}
                    </div>
                </div>
            </div>

            {/* Title + desc */}
            <h3 className='font-bold text-base text-gray-900 mb-1 group-hover:text-[#6A38C2] transition-colors'>
                {job?.title}
            </h3>
            <p className='text-xs text-gray-500 line-clamp-2 mb-3'>{job?.description}</p>

            {/* Badges */}
            <div className='flex flex-wrap items-center gap-1.5 mb-4'>
                <Badge variant='ghost' className='text-blue-700 bg-blue-50 text-xs'>{job?.position} Positions</Badge>
                <Badge variant='ghost' className='text-[#F83002] bg-red-50 text-xs'>{job?.jobType}</Badge>
                <Badge variant='ghost' className='text-[#7209b7] bg-purple-50 text-xs'>₹{job?.salary} LPA</Badge>
                {isDeadlinePassed && (
                    <Badge variant='destructive' className='text-xs'>Closed</Badge>
                )}
            </div>

            {/* Actions */}
            <Button
                onClick={() => navigate(`/description/${job?._id}`)}
                className='w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-sm h-8'>
                View Details
            </Button>
        </div>
    )
}

export default Job
