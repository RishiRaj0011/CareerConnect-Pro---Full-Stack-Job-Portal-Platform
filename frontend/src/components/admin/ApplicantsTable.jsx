import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Loader2, FileText, UserCheck, UserX, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { getApiError } from '@/utils/apiError'
import { useQueryClient } from '@tanstack/react-query'
import { TableRowSkeleton } from '../ui/skeletons'
import { EmptyState } from '../shared/PageHelpers'

const ATS_PIPELINE = [
    { status: "pending",      label: "Applied",       color: "bg-gray-100 text-gray-600"   },
    { status: "under_review", label: "Under Review",  color: "bg-blue-100 text-blue-700"   },
    { status: "shortlisted",  label: "Shortlisted",   color: "bg-yellow-100 text-yellow-700"},
    { status: "hired",        label: "Hired",         color: "bg-green-100 text-green-700" },
    { status: "rejected",     label: "Rejected",      color: "bg-red-100 text-red-600"     },
]

const getNextStatus = (current) => {
    const order = ["pending", "under_review", "shortlisted", "hired"]
    const idx = order.indexOf(current)
    return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null
}

const StatusBadge = ({ status }) => {
    const s = ATS_PIPELINE.find(p => p.status === status) ?? { label: status, color: "bg-gray-100 text-gray-600" }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
}

const ApplicantsTable = ({ applications = [], isLoading, jobId }) => {
    const queryClient = useQueryClient()
    const [dialog, setDialog] = useState(null) // { applicationId, action: 'proceed'|'reject', currentStatus }
    const [note, setNote] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const openDialog = (applicationId, action, currentStatus) => {
        setDialog({ applicationId, action, currentStatus })
        setNote("")
    }

    const handleStatusUpdate = async () => {
        if (!dialog) return
        const status = dialog.action === "reject"
            ? "rejected"
            : getNextStatus(dialog.currentStatus) ?? "shortlisted"
        try {
            setSubmitting(true)
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${dialog.applicationId}/update`,
                { status, recruiterNote: note },
                { withCredentials: true }
            )
            if (res.data.success) {
                queryClient.invalidateQueries({ queryKey: ["applicants", jobId] })
                toast.success(res.data.message)
                setDialog(null)
            }
        } catch (err) {
            toast.error(getApiError(err))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
                <Table>
                    <TableCaption className='pb-4'>Applicants for this position</TableCaption>
                    <TableHeader>
                        <TableRow className='bg-gray-50'>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Resume</TableHead>
                            <TableHead>Applied</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Recruiter Note</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                            : applications.length === 0
                                ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <EmptyState icon={UserCheck} title="No Applicants Yet"
                                                description="Applications will appear here once candidates apply." />
                                        </td>
                                    </tr>
                                )
                                : applications.map(item => (
                                    <TableRow key={item._id} className='hover:bg-gray-50'>
                                        <TableCell>
                                            <div>
                                                <p className='font-medium text-sm'>{item?.applicant?.fullname}</p>
                                                <p className='text-xs text-gray-500'>{item?.applicant?.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-sm'>{item?.applicant?.phoneNumber}</TableCell>
                                        <TableCell>
                                            {item.applicant?.profile?.resume
                                                ? <a href={item.applicant.profile.resume} target='_blank' rel='noopener noreferrer'
                                                    className='flex items-center gap-1 text-[#6A38C2] text-xs hover:underline'>
                                                    <FileText className='w-3 h-3' />
                                                    {item.applicant.profile.resumeOriginalName?.slice(0, 15) ?? "Resume"}
                                                  </a>
                                                : <span className='text-gray-400 text-xs'>Not uploaded</span>
                                            }
                                        </TableCell>
                                        <TableCell className='text-xs text-gray-500'>
                                            {item?.createdAt?.split("T")[0]}
                                        </TableCell>
                                        <TableCell><StatusBadge status={item.status} /></TableCell>
                                        <TableCell className='max-w-[140px]'>
                                            <p className='text-xs text-gray-500 truncate' title={item.recruiterNote}>
                                                {item.recruiterNote || <span className='italic text-gray-300'>—</span>}
                                            </p>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <div className='flex justify-end gap-1'>
                                                {item.status !== "hired" && item.status !== "rejected" && (
                                                    <>
                                                        {getNextStatus(item.status) && (
                                                            <Button size='sm' variant='outline'
                                                                className='text-xs h-7 text-[#6A38C2] border-[#6A38C2] hover:bg-purple-50'
                                                                onClick={() => openDialog(item._id, "proceed", item.status)}>
                                                                <ChevronRight className='w-3 h-3 mr-0.5' />
                                                                Next Round
                                                            </Button>
                                                        )}
                                                        <Button size='sm' variant='outline'
                                                            className='text-xs h-7 text-red-500 border-red-300 hover:bg-red-50'
                                                            onClick={() => openDialog(item._id, "reject", item.status)}>
                                                            <UserX className='w-3 h-3 mr-0.5' />
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </div>

            {/* Action Dialog */}
            <Dialog open={!!dialog} onOpenChange={() => setDialog(null)}>
                <DialogContent className='max-w-md'>
                    <DialogHeader>
                        <DialogTitle className={dialog?.action === "reject" ? "text-red-600" : "text-[#6A38C2]"}>
                            {dialog?.action === "reject" ? "Reject Applicant" : "Proceed to Next Round"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className='py-2'>
                        <p className='text-sm text-gray-600 mb-3'>
                            {dialog?.action === "reject"
                                ? "Add a feedback note for the candidate (optional):"
                                : `Moving to: ${ATS_PIPELINE.find(p => p.status === getNextStatus(dialog?.currentStatus))?.label ?? "Next Stage"}`
                            }
                        </p>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={3}
                            maxLength={500}
                            placeholder="Add a note for the candidate (optional)..."
                            className='w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none'
                        />
                        <p className='text-xs text-gray-400 text-right mt-1'>{note.length}/500</p>
                    </div>
                    <DialogFooter className='gap-2'>
                        <Button variant='outline' onClick={() => setDialog(null)}>Cancel</Button>
                        <Button
                            onClick={handleStatusUpdate}
                            disabled={submitting}
                            className={dialog?.action === "reject" ? "bg-red-500 hover:bg-red-600" : "bg-[#6A38C2] hover:bg-[#5b30a6]"}>
                            {submitting ? <Loader2 className='w-4 h-4 animate-spin mr-1' /> : null}
                            {dialog?.action === "reject" ? "Confirm Reject" : "Confirm & Proceed"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ApplicantsTable
