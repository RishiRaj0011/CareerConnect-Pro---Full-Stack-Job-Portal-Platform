import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";

const fetchAllJobs = async (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== "" && v !== undefined) params.set(k, v); });
    const res = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`, { withCredentials: true });
    return res.data.jobs;
};

const useGetAllJobs = () => {
    const { searchedQuery, locationFilter, jobTypeFilter, salaryMin, salaryMax, experienceFilter } =
        useSelector((store) => store.job);

    return useQuery({
        queryKey: ["jobs", searchedQuery, locationFilter, jobTypeFilter, salaryMin, salaryMax, experienceFilter],
        queryFn:  () => fetchAllJobs({
            keyword:    searchedQuery,
            location:   locationFilter,
            jobType:    jobTypeFilter,
            salaryMin,
            salaryMax,
            experience: experienceFilter,
        }),
    });
};

export default useGetAllJobs;
