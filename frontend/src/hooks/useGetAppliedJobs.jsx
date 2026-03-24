import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

const fetchAppliedJobs = async () => {
    const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
    return res.data.applications;
};

const useGetAppliedJobs = () =>
    useQuery({
        queryKey: ["appliedJobs"],
        queryFn:  fetchAppliedJobs,
    });

export default useGetAppliedJobs;
