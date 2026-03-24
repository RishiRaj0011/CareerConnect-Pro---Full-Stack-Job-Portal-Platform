import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";

const fetchCompanies = async () => {
    const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
    return res.data.companies;
};

const useGetAllCompanies = () =>
    useQuery({
        queryKey: ["companies"],
        queryFn:  fetchCompanies,
    });

export default useGetAllCompanies;
