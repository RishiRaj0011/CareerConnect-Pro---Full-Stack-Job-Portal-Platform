import { createSlice } from "@reduxjs/toolkit";

// companySlice now owns ONLY UI search state.
// All server data (companies, singleCompany) is managed by TanStack Query.
const companySlice = createSlice({
    name: "company",
    initialState: {
        searchCompanyByText: "", // used by Companies input → CompaniesTable client filter
    },
    reducers: {
        setSearchCompanyByText: (state, action) => { state.searchCompanyByText = action.payload; },
    },
});

export const { setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;
