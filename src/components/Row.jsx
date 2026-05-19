import React, { useEffect, useState } from 'react'
import tmdbAxiosInstance from '../tmdbAxiosInstance'
import './Row.css'
function Row({title,fetchUrl}) {
const [allMovies,setAllMovies]=useState([])
const base_url="https://image.tmdb.org/t/p/original/"

useEffect(()=>{
    const fetchData=async()=>{
       const {data}= await tmdbAxiosInstance.get(fetchUrl)
       setAllMovies(data.results || [])
    }

    fetchData()
},[fetchUrl])

  return (
    <div className='row'>
        <h1>{title}</h1>
        <div className="all_movies">

            {

                allMovies.map((item,index)=>(
                    <div className='ba' key={item.id ?? `${title}-${index}`}>
                       <div className='iim'> <img className='movie' src={`${base_url}/${item.poster_path}`} alt="" />
                        
                            <div className='back'>
            
                                    <img className='bacimg' src={`${base_url}/${item.backdrop_path}`} alt="" />
                                    <div style={{padding: "10px"}}>
                                        <div className='butt'>
                                            
                                              <button className='watchnow'>Watch now</button> <button className='plus'>+</button>                     
        
                                        </div>
                                        <h2>{item.original_title}</h2>
                                        <div style={{display:"flex"}}>
                                            <h3>{item.release_date?.slice(0,4) || 'N/A'}</h3>
                                            <h3> &nbsp;.&nbsp; </h3>
                                            <h3>Rating: {item.vote_average}</h3>
                                        </div>
                                        <p>
                                            {item.overview?.slice(0,80)}
                                        </p>
                                    </div>
            
                                </div>
                                </div>
                        </div>
                ))
            }
           
        </div>


    </div>
  )
}

export default Row
