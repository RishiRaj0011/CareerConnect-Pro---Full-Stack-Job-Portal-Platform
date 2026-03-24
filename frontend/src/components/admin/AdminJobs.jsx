import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        setInput(e.target.value);
        dispatch(setSearchJobByText(e.target.value));
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name, role"
                        value={input}
                        onChange={handleSearch}
                    />
                    <Button onClick={() => navigate("/admin/jobs/create")}>New Jobs</Button>
                </div>
                <AdminJobsTable />
            </div>
        </div>
    )
}

export default AdminJobs
