import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const STATUS_COLORS = {
    accepted: 'bg-green-400',
    rejected: 'bg-red-400',
    pending:  'bg-gray-400',
};

const AppliedJobTable = () => {
    const { data: appliedJobs = [], isLoading } = useGetAppliedJobs();

    if (isLoading) return <span className='text-gray-400 text-sm'>Loading applied jobs...</span>;

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appliedJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className='text-center text-gray-400'>
                                You haven't applied to any job yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        appliedJobs.map(app => (
                            <TableRow key={app._id}>
                                <TableCell>{app?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{app.job?.title}</TableCell>
                                <TableCell>{app.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={STATUS_COLORS[app.status] ?? 'bg-gray-400'}>
                                        {app.status?.toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable
