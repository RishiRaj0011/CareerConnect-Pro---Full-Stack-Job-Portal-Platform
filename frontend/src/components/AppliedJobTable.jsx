import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { TableRowSkeleton } from './ui/skeletons'

// Full ATS pipeline order
const ATS_STEPS = ["pending", "under_review", "shortlisted", "hired"];

const STATUS_STYLE = {
    pending:      { bg: "bg-gray-400",   label: "Applied"      },
    under_review: { bg: "bg-blue-400",   label: "Under Review" },
    shortlisted:  { bg: "bg-yellow-400", label: "Shortlisted"  },
    hired:        { bg: "bg-green-500",  label: "Hired"        },
    rejected:     { bg: "bg-red-500",    label: "Rejected"     },
};

const StatusTimeline = ({ status }) => {
    if (status === "rejected") {
        return (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600'>
                ✕ Rejected
            </span>
        );
    }
    const currentIdx = ATS_STEPS.indexOf(status);
    return (
        <div className='flex items-center gap-1'>
            {ATS_STEPS.map((step, i) => {
                const done    = i <= currentIdx;
                const current = i === currentIdx;
                return (
                    <React.Fragment key={step}>
                        <div className='flex flex-col items-center'>
                            <div className={`w-3 h-3 rounded-full border-2 transition-all
                                ${done ? "bg-[#6A38C2] border-[#6A38C2]" : "bg-white border-gray-300"}
                                ${current ? "ring-2 ring-[#6A38C2] ring-offset-1" : ""}`}
                            />
                            <span className={`text-[9px] mt-1 whitespace-nowrap
                                ${done ? "text-[#6A38C2] font-semibold" : "text-gray-400"}`}>
                                {STATUS_STYLE[step]?.label}
                            </span>
                        </div>
                        {i < ATS_STEPS.length - 1 && (
                            <div className={`h-0.5 w-6 mb-3 ${i < currentIdx ? "bg-[#6A38C2]" : "bg-gray-200"}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const AppliedJobTable = () => {
    const { data: appliedJobs = [], isLoading } = useGetAppliedJobs();

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Application Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
                        : appliedJobs.length === 0
                            ? (
                                <tr>
                                    <td colSpan={4} className='text-center text-gray-400 py-8'>
                                        You haven't applied to any job yet.
                                    </td>
                                </tr>
                            )
                            : appliedJobs.map(app => (
                                <TableRow key={app._id}>
                                    <TableCell className='text-sm'>{app?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell className='font-medium'>{app.job?.title}</TableCell>
                                    <TableCell>{app.job?.company?.name}</TableCell>
                                    <TableCell><StatusTimeline status={app.status} /></TableCell>
                                </TableRow>
                            ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable
