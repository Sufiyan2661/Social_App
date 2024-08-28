import {useQuery,useMutation,useQueryClient,useInfiniteQuery} from "@tanstack/react-query"
import { useAuth } from "../../utils/AuthContext"




export const useCreateUserAccountMutation = () =>{
    const {createUserAccount} = useAuth()
    return useMutation({
        mutationFn:(credentials) => createUserAccount(credentials.user)
    })
}

