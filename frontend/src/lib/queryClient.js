import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime:  2 * 60 * 1000,  // data considered fresh for 2 min
            gcTime:     5 * 60 * 1000,  // cache kept for 5 min after unmount
            retry:      1,              // retry once on failure
            refetchOnWindowFocus: true, // auto-refetch when user returns to tab
        },
    },
});

export default queryClient;
