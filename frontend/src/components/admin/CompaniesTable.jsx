import React, { useMemo } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const CompaniesTable = () => {
    const { data: companies = [], isLoading } = useGetAllCompanies();
    const { searchCompanyByText } = useSelector(store => store.company);
    const navigate = useNavigate();

    const filterCompany = useMemo(() => {
        if (!searchCompanyByText) return companies;
        return companies.filter(c =>
            c?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
        );
    }, [companies, searchCompanyByText]);

    if (isLoading) return <span className='text-gray-400 text-sm'>Loading companies...</span>;

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.map(company => (
                        <TableRow key={company._id}>
                            <TableCell>
                                <Avatar><AvatarImage src={company.logo} /></Avatar>
                            </TableCell>
                            <TableCell>{company.name}</TableCell>
                            <TableCell>{company?.createdAt?.split("T")[0] ?? "—"}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                            <Edit2 className='w-4' /><span>Edit</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable
