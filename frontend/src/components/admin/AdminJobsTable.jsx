import React, { useMemo } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'

const AdminJobsTable = () => {
    const { data: allAdminJobs = [], isLoading } = useGetAllAdminJobs();
    const { searchJobByText } = useSelector(store => store.job);
    const navigate = useNavigate();

    const filterJobs = useMemo(() => {
        if (!searchJobByText) return allAdminJobs;
        const q = searchJobByText.toLowerCase();
        return allAdminJobs.filter(job =>
            job?.title?.toLowerCase().includes(q) ||
            job?.company?.name?.toLowerCase().includes(q)
        );
    }, [allAdminJobs, searchJobByText]);

    if (isLoading) return <span className='text-gray-400 text-sm'>Loading jobs...</span>;

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs.map(job => (
                        <TableRow key={job._id}>
                            <TableCell>{job?.company?.name}</TableCell>
                            <TableCell>{job?.title}</TableCell>
                            <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div onClick={() => navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                            <Edit2 className='w-4' /><span>Edit</span>
                                        </div>
                                        <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                            <Eye className='w-4' /><span>Applicants</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable
