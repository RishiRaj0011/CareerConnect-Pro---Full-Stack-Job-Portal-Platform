import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";

const fetchAdminJobs = async () => {
    const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
    return res.data.jobs;
};

const useGetAllAdminJobs = () =>
    useQuery({
        queryKey: ["adminJobs"],
        queryFn:  fetchAdminJobs,
    });

export default useGetAllAdminJobs;
