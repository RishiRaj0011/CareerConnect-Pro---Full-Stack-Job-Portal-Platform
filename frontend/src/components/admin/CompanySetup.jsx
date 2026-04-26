import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Loader2, Building2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getApiError } from '@/utils/apiError'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import queryClient from '@/lib/queryClient'
import { BackButton } from '../shared/PageHelpers'

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]

const EMPTY = { name: "", description: "", website: "", location: "", foundedYear: "", companySize: "", file: null }

const CompanySetup = () => {
    const { id } = useParams()
    const { data: singleCompany = {}, isLoading: fetching } = useGetCompanyById(id)
    const [input, setInput] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (singleCompany._id) {
            setInput({
                name:        singleCompany.name        || "",
                description: singleCompany.description || "",
                website:     singleCompany.website     || "",
                location:    singleCompany.location    || "",
                foundedYear: singleCompany.foundedYear || "",
                companySize: singleCompany.companySize || "",
                file:        null,
            })
        }
    }, [singleCompany])

    const validate = () => {
        const e = {}
        if (!input.name.trim())    e.name = "Company name is required"
        if (input.website && !/^https?:\/\/.+/.test(input.website)) e.website = "Enter a valid URL (https://...)"
        if (input.foundedYear && (input.foundedYear < 1800 || input.foundedYear > new Date().getFullYear()))
            e.foundedYear = `Year must be between 1800 and ${new Date().getFullYear()}`
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const changeHandler = (e) => {
        setInput(p => ({ ...p, [e.target.name]: e.target.value }))
        setErrors(p => ({ ...p, [e.target.name]: "" }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!validate()) return
        const formData = new FormData()
        Object.entries(input).forEach(([k, v]) => { if (k !== "file" && v !== "") formData.append(k, v) })
        if (input.file) formData.append("file", input.file)
        try {
            setLoading(true)
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            })
            if (res.data.success) {
                queryClient.invalidateQueries({ queryKey: ["companies"] })
                queryClient.invalidateQueries({ queryKey: ["company", id] })
                toast.success(res.data.message)
                navigate("/admin/companies")
            }
        } catch (err) {
            toast.error(getApiError(err))
        } finally {
            setLoading(false)
        }
    }

    const Field = ({ label, name, type = "text", placeholder = "" }) => (
        <div>
            <Label className='text-sm font-medium'>{label}</Label>
            <Input type={type} name={name} value={input[name]} onChange={changeHandler}
                placeholder={placeholder}
                className={`mt-1 ${errors[name] ? "border-red-400 focus-visible:ring-red-300" : ""}`} />
            {errors[name] && <p className='text-xs text-red-500 mt-1'>{errors[name]}</p>}
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-2xl mx-auto px-4 py-8'>
                <BackButton />
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center'>
                            <Building2 className='w-5 h-5 text-[#6A38C2]' />
                        </div>
                        <div>
                            <h1 className='text-xl font-bold text-gray-900'>Company Setup</h1>
                            <p className='text-sm text-gray-500'>Update your company information</p>
                        </div>
                    </div>

                    {fetching ? (
                        <div className='flex justify-center py-10'>
                            <Loader2 className='w-6 h-6 animate-spin text-[#6A38C2]' />
                        </div>
                    ) : (
                        <form onSubmit={submitHandler} className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <Field label="Company Name *" name="name" placeholder="e.g. Google" />
                                <Field label="Location" name="location" placeholder="e.g. Bangalore" />
                                <Field label="Website" name="website" placeholder="https://company.com" />
                                <Field label="Founded Year" name="foundedYear" type="number" placeholder="e.g. 2010" />
                            </div>

                            <div>
                                <Label className='text-sm font-medium'>Company Size</Label>
                                <Select value={input.companySize} onValueChange={v => setInput(p => ({ ...p, companySize: v }))}>
                                    <SelectTrigger className='mt-1'>
                                        <SelectValue placeholder="Select company size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMPANY_SIZES.map(s => <SelectItem key={s} value={s}>{s} employees</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className='text-sm font-medium'>Description</Label>
                                <textarea name="description" value={input.description} onChange={changeHandler}
                                    rows={3} placeholder="Brief description about your company..."
                                    className='mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none' />
                            </div>

                            <div>
                                <Label className='text-sm font-medium'>Company Logo</Label>
                                <Input type="file" accept="image/*" className='mt-1'
                                    onChange={e => setInput(p => ({ ...p, file: e.target.files?.[0] }))} />
                                {singleCompany.logo && (
                                    <img src={singleCompany.logo} alt="logo" className='mt-2 h-12 w-12 rounded-lg object-cover border' />
                                )}
                            </div>

                            <Button type="submit" disabled={loading} className='w-full bg-[#6A38C2] hover:bg-[#5b30a6] mt-2'>
                                {loading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Saving...</> : "Save Changes"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CompanySetup
