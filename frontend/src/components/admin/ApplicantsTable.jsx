import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { getApiError } from '@/utils/apiError'
import { useQueryClient } from '@tanstack/react-query'

const SHORTLISTING_STATUS = ["pending", "under_review", "shortlisted", "hired", "rejected"];

const ApplicantsTable = ({ applications = [], isLoading, jobId }) => {
    const queryClient = useQueryClient();

    const statusHandler = async (status, applicationId) => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
                { status },
                { withCredentials: true }
            );
            if (res.data.success) {
                // Invalidate so applicant count and status refresh automatically
                queryClient.invalidateQueries({ queryKey: ["applicants", jobId] });
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(getApiError(error));
        }
    };

    if (isLoading) return <span className='text-gray-400 text-sm'>Loading applicants...</span>;

    return (
        <div>
            <Table>
                <TableCaption>A list of applicants for this job</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className='text-center text-gray-400'>
                                No applicants yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        applications.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume
                                        ? <a className="text-blue-600 cursor-pointer" href={item.applicant.profile.resume} target="_blank" rel="noopener noreferrer">
                                            {item.applicant.profile.resumeOriginalName}
                                          </a>
                                        : <span className='text-gray-400'>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {SHORTLISTING_STATUS.map((status, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => statusHandler(status, item._id)}
                                                    className='flex w-fit items-center my-2 cursor-pointer hover:text-[#7209b7]'
                                                >
                                                    <span>{status}</span>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable
