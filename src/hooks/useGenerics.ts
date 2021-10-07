import { useState, useEffect, useContext } from "react";
import GenericsService from 'services/Generics'
import { useSession } from 'next-auth/client';

export default function useGenerics(input: string[]){
    const [generics, setGenerics] = useState({})
    const [loader, setLoader] = useState(false)
    const [session] = useSession()
    useEffect(()=> {
        setLoader(true)
        GenericsService.getAll(session?.token, input)
        .then(res => {
            setLoader(false)
            setGenerics(res)
        })
        .catch(err => {
            setLoader(false)
            console.error(err)  
        })
        return () => {}
    },[])

    return [generics, loader]
}