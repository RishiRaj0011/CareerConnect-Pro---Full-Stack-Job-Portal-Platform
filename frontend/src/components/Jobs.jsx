import React, { useMemo } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Jobs = () => {
    const { data: allJobs = [], isLoading } = useGetAllJobs();
    const { searchedQuery } = useSelector(store => store.job);

    const filterJobs = useMemo(() => {
        if (!searchedQuery) return allJobs;
        const q = searchedQuery.toLowerCase();
        return allJobs.filter(job =>
            job.title.toLowerCase().includes(q) ||
            job.description.toLowerCase().includes(q) ||
            job.location.toLowerCase().includes(q)
        );
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {isLoading ? (
                        <span className='flex-1 text-center py-10 text-gray-400'>Loading jobs...</span>
                    ) : filterJobs.length === 0 ? (
                        <span className='flex-1 text-center py-10'>No jobs found</span>
                    ) : (
                        <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                            <div className='grid grid-cols-3 gap-4'>
                                {filterJobs.map(job => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Jobs
