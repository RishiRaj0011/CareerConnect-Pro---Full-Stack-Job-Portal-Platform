import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { TableRowSkeleton } from './ui/skeletons'
import { EmptyState } from './shared/PageHelpers'
import { Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const ATS_STEPS = ["pending", "under_review", "shortlisted", "hired"]

const STATUS_STYLE = {
    pending:      { bg: "bg-gray-100",   text: "text-gray-600",   label: "Applied"       },
    under_review: { bg: "bg-blue-100",   text: "text-blue-700",   label: "Under Review"  },
    shortlisted:  { bg: "bg-yellow-100", text: "text-yellow-700", label: "Shortlisted"   },
    hired:        { bg: "bg-green-100",  text: "text-green-700",  label: "Hired 🎉"      },
    rejected:     { bg: "bg-red-100",    text: "text-red-600",    label: "Not Selected"  },
}

const StatusTimeline = ({ status }) => {
    if (status === "rejected") {
        return (
            <div className='flex flex-col gap-1'>
                <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 w-fit'>
                    ✕ Not Selected
                </span>
            </div>
        )
    }
    const currentIdx = ATS_STEPS.indexOf(status)
    return (
        <div className='flex items-center gap-1'>
            {ATS_STEPS.map((step, i) => {
                const done = i <= currentIdx
                const current = i === currentIdx
                const s = STATUS_STYLE[step]
                return (
                    <React.Fragment key={step}>
                        <div className='flex flex-col items-center' title={s?.label}>
                            <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all
                                ${done ? "bg-[#6A38C2] border-[#6A38C2]" : "bg-white border-gray-300"}
                                ${current ? "ring-2 ring-[#6A38C2]/40 ring-offset-1 scale-125" : ""}`} />
                            <span className={`text-[8px] mt-1 whitespace-nowrap hidden sm:block
                                ${done ? "text-[#6A38C2] font-semibold" : "text-gray-300"}`}>
                                {s?.label}
                            </span>
                        </div>
                        {i < ATS_STEPS.length - 1 && (
                            <div className={`h-0.5 w-5 mb-3 ${i < currentIdx ? "bg-[#6A38C2]" : "bg-gray-200"}`} />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

const AppliedJobTable = () => {
    const { data: appliedJobs = [], isLoading } = useGetAppliedJobs()

    return (
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
            <Table>
                <TableCaption className='pb-4'>Your job applications</TableCaption>
                <TableHeader>
                    <TableRow className='bg-gray-50'>
                        <TableHead>Date</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Recruiter Feedback</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                        : appliedJobs.length === 0
                            ? (
                                <tr>
                                    <td colSpan={5}>
                                        <EmptyState
                                            icon={Briefcase}
                                            title="No Applications Yet"
                                            description="Start applying to jobs and track your progress here."
                                            action={
                                                <Link to='/jobs'>
                                                    <Button className='bg-[#6A38C2] hover:bg-[#5b30a6]'>Browse Jobs</Button>
                                                </Link>
                                            }
                                        />
                                    </td>
                                </tr>
                            )
                            : appliedJobs.map(app => {
                                const s = STATUS_STYLE[app.status] ?? STATUS_STYLE.pending
                                return (
                                    <TableRow key={app._id} className='hover:bg-gray-50'>
                                        <TableCell className='text-xs text-gray-500 whitespace-nowrap'>
                                            {app?.createdAt?.split("T")[0]}
                                        </TableCell>
                                        <TableCell>
                                            <p className='font-medium text-sm'>{app.job?.title}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
                                                {s.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className='text-sm'>{app.job?.company?.name}</TableCell>
                                        <TableCell><StatusTimeline status={app.status} /></TableCell>
                                        <TableCell className='max-w-[180px]'>
                                            {app.recruiterNote
                                                ? <p className='text-xs text-gray-600 bg-gray-50 rounded-md px-2 py-1.5 border border-gray-100'>
                                                    "{app.recruiterNote}"
                                                  </p>
                                                : <span className='text-xs text-gray-300 italic'>No feedback yet</span>
                                            }
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable
