import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";

const fetchAllJobs = async (keyword) => {
    const params = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
    const res = await axios.get(`${JOB_API_END_POINT}/get${params}`, { withCredentials: true });
    return res.data.jobs;
};

const useGetAllJobs = () => {
    const { searchedQuery } = useSelector((store) => store.job);

    return useQuery({
        queryKey: ["jobs", searchedQuery],
        queryFn:  () => fetchAllJobs(searchedQuery),
    });
};

export default useGetAllJobs;
