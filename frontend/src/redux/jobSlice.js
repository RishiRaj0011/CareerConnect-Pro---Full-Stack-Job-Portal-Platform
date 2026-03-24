import { createSlice } from "@reduxjs/toolkit";

// jobSlice now owns ONLY UI search state.
// All server data (jobs, adminJobs, appliedJobs, singleJob) is managed by TanStack Query.
const jobSlice = createSlice({
    name: "job",
    initialState: {
        searchedQuery:   "",   // used by FilterCard, HeroSection → useGetAllJobs queryKey
        searchJobByText: "",   // used by AdminJobs input → AdminJobsTable client filter
    },
    reducers: {
        setSearchedQuery:   (state, action) => { state.searchedQuery   = action.payload; },
        setSearchJobByText: (state, action) => { state.searchJobByText = action.payload; },
    },
});

export const { setSearchedQuery, setSearchJobByText } = jobSlice.actions;
export default jobSlice.reducer;
