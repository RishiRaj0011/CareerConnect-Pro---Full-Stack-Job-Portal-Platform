import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Loader2, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { getApiError } from '@/utils/apiError'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { BackButton, EmptyState } from '../shared/PageHelpers'
import { Link } from 'react-router-dom'

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"]

const EMPTY = {
    title: "", description: "", requirements: "", benefits: "",
    salary: "", location: "", jobType: "", experience: "",
    position: "", companyId: "", deadline: ""
}

const STEPS = ["Basic Info", "Job Details"]

const PostJob = () => {
    const [step, setStep] = useState(0)
    const [input, setInput] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { data: companies = [], isLoading: companiesLoading } = useGetAllCompanies()

    const change = (e) => {
        setInput(p => ({ ...p, [e.target.name]: e.target.value }))
        setErrors(p => ({ ...p, [e.target.name]: "" }))
    }

    const validateStep = (s) => {
        const e = {}
        if (s === 0) {
            if (!input.title.trim())       e.title       = "Job title is required"
            if (!input.description.trim() || input.description.length < 10)
                                           e.description = "Description must be at least 10 characters"
            if (!input.requirements.trim()) e.requirements = "Requirements are required"
            if (!input.companyId)          e.companyId   = "Please select a company"
        }
        if (s === 1) {
            if (!input.salary || isNaN(input.salary) || Number(input.salary) <= 0)
                                           e.salary      = "Enter a valid salary"
            if (!input.location.trim())    e.location    = "Location is required"
            if (!input.jobType)            e.jobType     = "Select a job type"
            if (input.experience === "" || isNaN(input.experience) || Number(input.experience) < 0)
                                           e.experience  = "Enter valid experience (0 or more)"
            if (!input.position || isNaN(input.position) || Number(input.position) < 1)
                                           e.position    = "Enter valid number of positions"
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const nextStep = () => { if (validateStep(step)) setStep(1) }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!validateStep(1)) return
        try {
            setLoading(true)
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/admin/jobs")
            }
        } catch (err) {
            toast.error(getApiError(err))
        } finally {
            setLoading(false)
        }
    }

    const Field = ({ label, name, type = "text", placeholder = "", required = false }) => (
        <div>
            <Label className='text-sm font-medium'>{label}{required && <span className='text-red-500 ml-0.5'>*</span>}</Label>
            <Input type={type} name={name} value={input[name]} onChange={change} placeholder={placeholder}
                className={`mt-1 ${errors[name] ? "border-red-400" : ""}`} />
            {errors[name] && <p className='text-xs text-red-500 mt-1'>{errors[name]}</p>}
        </div>
    )

    if (!companiesLoading && companies.length === 0) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <Navbar />
                <div className='max-w-2xl mx-auto px-4 py-8'>
                    <EmptyState
                        icon={Briefcase}
                        title="No Company Registered"
                        description="You need to register a company before posting a job."
                        action={<Link to='/admin/companies/create'><Button className='bg-[#6A38C2]'>Register Company</Button></Link>}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-2xl mx-auto px-4 py-8'>
                <BackButton />
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
                    {/* Header */}
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center'>
                            <Briefcase className='w-5 h-5 text-[#6A38C2]' />
                        </div>
                        <div>
                            <h1 className='text-xl font-bold'>Post a New Job</h1>
                            <p className='text-sm text-gray-500'>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <div className='flex gap-2 mb-6'>
                        {STEPS.map((s, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all
                                ${i <= step ? "bg-[#6A38C2]" : "bg-gray-200"}`} />
                        ))}
                    </div>

                    <form onSubmit={submitHandler}>
                        {step === 0 && (
                            <div className='space-y-4'>
                                <Field label="Job Title" name="title" placeholder="e.g. Senior React Developer" required />
                                <div>
                                    <Label className='text-sm font-medium'>Description <span className='text-red-500'>*</span></Label>
                                    <textarea name="description" value={input.description} onChange={change} rows={4}
                                        placeholder="Describe the role, responsibilities..."
                                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none
                                            ${errors.description ? "border-red-400" : "border-input"}`} />
                                    {errors.description && <p className='text-xs text-red-500 mt-1'>{errors.description}</p>}
                                </div>
                                <Field label="Requirements (comma separated)" name="requirements" placeholder="React, Node.js, MongoDB" required />
                                <Field label="Benefits (comma separated)" name="benefits" placeholder="Health insurance, Remote work, Flexible hours" />
                                <div>
                                    <Label className='text-sm font-medium'>Company <span className='text-red-500'>*</span></Label>
                                    <Select value={input.companyId} onValueChange={v => { setInput(p => ({ ...p, companyId: v })); setErrors(p => ({ ...p, companyId: "" })) }}>
                                        <SelectTrigger className={`mt-1 ${errors.companyId ? "border-red-400" : ""}`}>
                                            <SelectValue placeholder="Select company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.companyId && <p className='text-xs text-red-500 mt-1'>{errors.companyId}</p>}
                                </div>
                                <Button type="button" onClick={nextStep} className='w-full bg-[#6A38C2] hover:bg-[#5b30a6]'>
                                    Next <ChevronRight className='ml-1 w-4 h-4' />
                                </Button>
                            </div>
                        )}

                        {step === 1 && (
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <Field label="Salary (LPA)" name="salary" type="number" placeholder="e.g. 12" required />
                                    <Field label="Location" name="location" placeholder="e.g. Bangalore" required />
                                    <Field label="Experience (years)" name="experience" type="number" placeholder="e.g. 2" required />
                                    <Field label="No. of Positions" name="position" type="number" placeholder="e.g. 3" required />
                                </div>
                                <div>
                                    <Label className='text-sm font-medium'>Job Type <span className='text-red-500'>*</span></Label>
                                    <Select value={input.jobType} onValueChange={v => { setInput(p => ({ ...p, jobType: v })); setErrors(p => ({ ...p, jobType: "" })) }}>
                                        <SelectTrigger className={`mt-1 ${errors.jobType ? "border-red-400" : ""}`}>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.jobType && <p className='text-xs text-red-500 mt-1'>{errors.jobType}</p>}
                                </div>
                                <Field label="Application Deadline" name="deadline" type="date" />
                                <div className='flex gap-3 pt-2'>
                                    <Button type="button" variant="outline" onClick={() => setStep(0)} className='flex-1'>
                                        <ChevronLeft className='mr-1 w-4 h-4' /> Back
                                    </Button>
                                    <Button type="submit" disabled={loading} className='flex-1 bg-[#6A38C2] hover:bg-[#5b30a6]'>
                                        {loading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Posting...</> : "Post Job"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob
