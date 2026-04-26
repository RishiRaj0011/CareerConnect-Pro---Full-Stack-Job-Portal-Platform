import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        searchedQuery:    "",
        searchJobByText:  "",
        locationFilter:   "",
        jobTypeFilter:    "",
        salaryMin:        "",
        salaryMax:        "",
        experienceFilter: "",
    },
    reducers: {
        setSearchedQuery:    (state, action) => { state.searchedQuery    = action.payload; },
        setSearchJobByText:  (state, action) => { state.searchJobByText  = action.payload; },
        setLocationFilter:   (state, action) => { state.locationFilter   = action.payload; },
        setJobTypeFilter:    (state, action) => { state.jobTypeFilter    = action.payload; },
        setSalaryMin:        (state, action) => { state.salaryMin        = action.payload; },
        setSalaryMax:        (state, action) => { state.salaryMax        = action.payload; },
        setExperienceFilter: (state, action) => { state.experienceFilter = action.payload; },
        clearAllFilters:     (state) => {
            state.searchedQuery = state.locationFilter = state.jobTypeFilter =
            state.salaryMin = state.salaryMax = state.experienceFilter = "";
        },
    },
});

export const {
    setSearchedQuery, setSearchJobByText, setLocationFilter,
    setJobTypeFilter, setSalaryMin, setSalaryMax, setExperienceFilter, clearAllFilters,
} = jobSlice.actions;
export default jobSlice.reducer;
