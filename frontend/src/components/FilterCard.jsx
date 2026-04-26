import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import {
    setLocationFilter, setJobTypeFilter,
    setSalaryMin, setSalaryMax, setExperienceFilter, clearAllFilters,
} from '@/redux/jobSlice'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Button } from './ui/button'
import { Input } from './ui/input'

const LOCATIONS = ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"];
const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"];
const EXPERIENCE_LEVELS = [
    { label: "Fresher (0 yrs)", value: "0" },
    { label: "Up to 1 yr",      value: "1" },
    { label: "Up to 3 yrs",     value: "3" },
    { label: "Up to 5 yrs",     value: "5" },
];

// Debounce hook — delays dispatch until user stops typing
const useDebounce = (value, delay = 500) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
};

const FilterCard = () => {
    const dispatch = useDispatch();
    const { locationFilter, jobTypeFilter, salaryMin, salaryMax, experienceFilter } =
        useSelector(s => s.job);

    // Local salary state — debounced before dispatching to avoid API call on every keystroke
    const [localSalaryMin, setLocalSalaryMin] = useState(salaryMin);
    const [localSalaryMax, setLocalSalaryMax] = useState(salaryMax);
    const debouncedMin = useDebounce(localSalaryMin);
    const debouncedMax = useDebounce(localSalaryMax);

    useEffect(() => { dispatch(setSalaryMin(debouncedMin)); }, [debouncedMin]);
    useEffect(() => { dispatch(setSalaryMax(debouncedMax)); }, [debouncedMax]);

    return (
        <div className='w-full bg-white p-4 rounded-md shadow-sm border border-gray-100 min-w-[220px]'>
            <div className='flex items-center justify-between mb-3'>
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
                <Button variant='ghost' size='sm' className='text-xs text-[#6A38C2]'
                    onClick={() => { dispatch(clearAllFilters()); setLocalSalaryMin(""); setLocalSalaryMax(""); }}>
                    Clear All
                </Button>
            </div>
            <hr className='mb-3' />

            {/* Location */}
            <div className='mb-4'>
                <h2 className='font-semibold text-sm mb-2 text-gray-700'>Location</h2>
                <RadioGroup value={locationFilter} onValueChange={v => dispatch(setLocationFilter(v === locationFilter ? "" : v))}>
                    {LOCATIONS.map((loc, i) => (
                        <div key={i} className='flex items-center space-x-2 my-1'>
                            <RadioGroupItem value={loc} id={`loc-${i}`} />
                            <Label htmlFor={`loc-${i}`} className='text-sm cursor-pointer'>{loc}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Job Type */}
            <div className='mb-4'>
                <h2 className='font-semibold text-sm mb-2 text-gray-700'>Job Type</h2>
                <RadioGroup value={jobTypeFilter} onValueChange={v => dispatch(setJobTypeFilter(v === jobTypeFilter ? "" : v))}>
                    {JOB_TYPES.map((type, i) => (
                        <div key={i} className='flex items-center space-x-2 my-1'>
                            <RadioGroupItem value={type} id={`jt-${i}`} />
                            <Label htmlFor={`jt-${i}`} className='text-sm cursor-pointer'>{type}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Salary Range */}
            <div className='mb-4'>
                <h2 className='font-semibold text-sm mb-2 text-gray-700'>Salary (LPA)</h2>
                <div className='flex gap-2'>
                    <Input placeholder='Min' type='number' value={localSalaryMin}
                        onChange={e => setLocalSalaryMin(e.target.value)} className='h-8 text-sm' />
                    <Input placeholder='Max' type='number' value={localSalaryMax}
                        onChange={e => setLocalSalaryMax(e.target.value)} className='h-8 text-sm' />
                </div>
            </div>

            {/* Experience */}
            <div className='mb-2'>
                <h2 className='font-semibold text-sm mb-2 text-gray-700'>Experience</h2>
                <RadioGroup value={experienceFilter} onValueChange={v => dispatch(setExperienceFilter(v === experienceFilter ? "" : v))}>
                    {EXPERIENCE_LEVELS.map((lvl, i) => (
                        <div key={i} className='flex items-center space-x-2 my-1'>
                            <RadioGroupItem value={lvl.value} id={`exp-${i}`} />
                            <Label htmlFor={`exp-${i}`} className='text-sm cursor-pointer'>{lvl.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    )
}

export default FilterCard
