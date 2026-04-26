import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Mail, Phone, Pen, FileText, User } from 'lucide-react'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'

const Profile = () => {
    const [open, setOpen] = useState(false)
    const { user } = useSelector(s => s.auth)

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-8 space-y-4'>

                {/* Profile Card */}
                <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
                    {/* Banner */}
                    <div className='h-24 bg-gradient-to-r from-[#6A38C2] to-[#9b59b6]' />
                    <div className='px-6 pb-6'>
                        <div className='flex items-end justify-between -mt-10 mb-4'>
                            <Avatar className='h-20 w-20 border-4 border-white shadow-md'>
                                <AvatarImage src={user?.profile?.profilePhoto} />
                                <AvatarFallback className='bg-[#6A38C2] text-white text-2xl font-bold'>
                                    {user?.fullname?.[0]?.toUpperCase() ?? <User className='w-8 h-8' />}
                                </AvatarFallback>
                            </Avatar>
                            <Button variant='outline' size='sm' onClick={() => setOpen(true)}
                                className='flex items-center gap-1.5 mb-1'>
                                <Pen className='w-3.5 h-3.5' /> Edit Profile
                            </Button>
                        </div>

                        <h1 className='text-xl font-bold text-gray-900'>{user?.fullname}</h1>
                        <p className='text-gray-500 text-sm mt-0.5'>{user?.profile?.bio || 'No bio added yet.'}</p>

                        <div className='flex flex-wrap gap-4 mt-4 text-sm text-gray-600'>
                            <div className='flex items-center gap-1.5'>
                                <Mail className='w-4 h-4 text-gray-400' />
                                {user?.email}
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <Phone className='w-4 h-4 text-gray-400' />
                                {user?.phoneNumber || 'Not provided'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills + Resume */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
                        <h2 className='font-semibold text-gray-800 mb-3'>Skills</h2>
                        <div className='flex flex-wrap gap-2'>
                            {user?.profile?.skills?.length > 0
                                ? user.profile.skills.map((s, i) => (
                                    <Badge key={i} className='bg-purple-50 text-[#6A38C2] hover:bg-purple-100 border-0'>{s}</Badge>
                                ))
                                : <p className='text-gray-400 text-sm'>No skills added yet.</p>
                            }
                        </div>
                    </div>

                    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
                        <h2 className='font-semibold text-gray-800 mb-3'>Resume</h2>
                        {user?.profile?.resume ? (
                            <a href={user.profile.resume} target='_blank' rel='noreferrer'
                                className='flex items-center gap-2 text-[#6A38C2] hover:underline text-sm font-medium'>
                                <FileText className='w-4 h-4' />
                                {user.profile.resumeOriginalName || 'View Resume'}
                            </a>
                        ) : (
                            <p className='text-gray-400 text-sm'>No resume uploaded yet.</p>
                        )}
                    </div>
                </div>

                {/* Applied Jobs */}
                <div>
                    <h2 className='font-bold text-lg text-gray-900 mb-3'>Applied Jobs</h2>
                    <AppliedJobTable />
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
