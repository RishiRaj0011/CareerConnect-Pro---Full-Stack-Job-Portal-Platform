import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'

// ── Atomic sub-components ──────────────────────────────────────────────────

const ProfileHeader = ({ user, onEdit }) => (
    <div className='flex justify-between'>
        <div className='flex items-center gap-4'>
            <Avatar className="h-24 w-24">
                <AvatarImage
                    src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                    alt="profile"
                />
            </Avatar>
            <div>
                <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                <p className='text-gray-500 text-sm'>{user?.profile?.bio}</p>
            </div>
        </div>
        <Button onClick={onEdit} variant="outline"><Pen /></Button>
    </div>
);

const ProfileContact = ({ email, phoneNumber }) => (
    <div className='my-5'>
        <div className='flex items-center gap-3 my-2'>
            <Mail className='w-4 h-4 text-gray-500' />
            <span>{email}</span>
        </div>
        <div className='flex items-center gap-3 my-2'>
            <Contact className='w-4 h-4 text-gray-500' />
            <span>{phoneNumber}</span>
        </div>
    </div>
);

const ProfileSkills = ({ skills = [] }) => (
    <div className='my-5'>
        <h1 className='font-semibold mb-2'>Skills</h1>
        <div className='flex items-center gap-1 flex-wrap'>
            {skills.length > 0
                ? skills.map((skill, i) => <Badge key={i}>{skill}</Badge>)
                : <span className='text-gray-400 text-sm'>No skills added yet.</span>
            }
        </div>
    </div>
);

const ProfileResume = ({ resume, resumeOriginalName }) => (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label className="text-md font-bold">Resume</Label>
        {resume
            ? <a target='_blank' rel='noreferrer' href={resume} className='text-blue-500 hover:underline cursor-pointer'>{resumeOriginalName || "View Resume"}</a>
            : <span className='text-gray-400 text-sm'>No resume uploaded.</span>
        }
    </div>
);

// ── Main component ─────────────────────────────────────────────────────────

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <ProfileHeader user={user} onEdit={() => setOpen(true)} />
                <ProfileContact email={user?.email} phoneNumber={user?.phoneNumber} />
                <ProfileSkills skills={user?.profile?.skills} />
                <ProfileResume resume={user?.profile?.resume} resumeOriginalName={user?.profile?.resumeOriginalName} />
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
