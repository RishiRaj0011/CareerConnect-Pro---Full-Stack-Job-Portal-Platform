import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";

const fetchCompanyById = async (companyId) => {
    const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, { withCredentials: true });
    return res.data.company;
};

const useGetCompanyById = (companyId) =>
    useQuery({
        queryKey: ["company", companyId],
        queryFn:  () => fetchCompanyById(companyId),
        enabled:  !!companyId,
    });

export default useGetCompanyById;
