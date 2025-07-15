import { useState, useContext,createContext } from "react";
const SearchContext=createContext()

const SearchProvider=({children})=>{
    const [searchState,setSearchState]=useState({
        keyword:"",          //initial serch  null
        results:[]           // controller mathi j ave 6e
    })

    return(
        <SearchContext.Provider value={[searchState,setSearchState]}>
            {children}
        </SearchContext.Provider>
    )    
}

// custom hook
const useSearch=()=> useContext(SearchContext)

export{useSearch,SearchProvider}