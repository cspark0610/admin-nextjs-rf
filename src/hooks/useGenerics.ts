import { useState, useEffect, useContext } from "react";
import GenericsService from 'services/Generics'

export default function useGenerics(input: string[]){
    const [generics, setGenerics] = useState([])
    const [loader, setLoader] = useState(false)
    const genericsService = new GenericsService()
    useEffect(()=> {
        setLoader(true)
        genericsService.getAll(input)
        .then(res => {
            setLoader(false)
            setGenerics(res)
        })
        .catch(err => {
            setLoader(false)
            console.log(err)  
        })
        return () => {}
    },[])

    return [generics, loader]
}