
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import { ArrowLeft, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Blogs(){
    const [loader, setLoader] = useState(false);
    const [blogData, setBlogData] = useState([]);
    const [category_id, setCategoryId] = useState([]);
    const [search, setSearch] = useState('');
    const [filterData, setFilterData] = useState({
        filters: '',
        searchfilter: ''
    });
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const getAllPosts = async () =>{
            setLoader(true);
            try{
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/posts`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(filterData)
                })
                const data = await response.json();
                if(response.ok){
                    // sort on the bases of best likes
                    data.data.posts.sort((a, b) => b.likes - a.likes);
                    setBlogData(data.data.posts);
                    setCategories(data.data.categories);
                }
            }catch(error){
                console.log(error);
            }finally{
                setLoader(false);
            }
        }
        getAllPosts();
    }, [filterData]);
   const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
 
    // Total pages
    const totalPages = Math.ceil(blogData.length / itemsPerPage);


    // Current blogs
    const currentBlogs = blogData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    // on page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const filterButton = async (id) => {
        
        const nextCategories = category_id.includes(id)
            ? category_id.filter((catId) => catId !== id)
            : [...category_id, id];

        setCategoryId(nextCategories);

        setFilterData(prevFilterData => ({
            ...prevFilterData,
            filters: nextCategories.join(",")
        }));
    }


    const onSearchChange = (e) => {
        setSearch(e.target.value);
    }
    const onSearchSubmit = (e) => {
        e.preventDefault();
        setFilterData(prevFilterData => ({
            ...prevFilterData,
            searchfilter: search.toLowerCase()
        }));
        setCurrentPage(1);
    }

return(
    <main className="w-full h-auto bg-gray-100">
    <Header />
    <div className="w-full h-full py-8 px-4 md:py-10 md:px-12 text-gray-900">
       
        <div className="layout flex flex-col gap-5 md:gap-10 w-full">
            <div className="text-center w-full h-auto rounded-xl p-4 md:p-10">
                <h1 className="text-2xl md:text-3xl font-bold">Blogs</h1>
            </div>
            {/* search bar */}
            <div className="w-full h-full grid md:grid-cols-1 grid-cols-1 gap-10">
                <div className="md:w-[40%] w-full flex mx-auto">
                    <input onChange={onSearchChange} type="text" placeholder="Search" className="md:w-[80%] w-[70%] focus:outline-none px-4 py-2 border border-gray-200 rounded-l-full" />
                    <button onClick={onSearchSubmit} className="md:w-[20%] w-[30%] px-4 py-2 bg-orange-400 text-white rounded-r-full">Search</button>
                </div>
            </div>
            <div className="w-full h-full grid md:grid-cols-1 grid-cols-1 items-center justify-items-center gap-10">
                
                {/* Categories */}
                <div className="md:w-[80%] w-full flex items-center flex-wrap justify-center md:gap-3 gap-1">
                    {categories.map((category) => (
                        <div key={category.id} onClick={() => filterButton(category.id)} className={`cursor-pointer hover:text-white hover:bg-orange-400 bg-white md:px-6 px-4 py-2 md:py-2 mb-2 border border-gray-200 rounded-3xl ${category_id.includes(category.id) ? "bg-orange-500 text-white" : ""}`}>
                            <div className="flex items-center justify-between">
                                <h3 className="md:text-lg text-sm  md:font-bold font-semibold ">{category.cat_name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {loader ? (
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
                    <CircularProgress aria-label="Loading…" />
                </Box>
                ) : (
            <div className="w-full h-full grid md:grid-cols-1 grid-cols-1 gap-10">

                {/* Blogs */}
                <div className="md:w-[80%] w-full mx-auto h-full grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-5">
                    {currentBlogs.map((blog) => (
                        <div key={blog.id} className="mb-4 p-5 border bg-white border-gray-200 rounded-3xl">
                            <div className="w-full h-auto mb-4 overflow-hidden rounded-3xl">
                                <Link to={`/blog/${blog.slug}`}><img className="w-full hover:scale-110 transition-all duration-300 ease-in-out " src={blog.post_image_url} alt={blog.title} /></Link>
                            </div>
                            <div className="flex justify-between gap-1">
                                {
                                blog.categories ? 
                                    blog.categories.map((category) => (
                                        <Link to={`/category/${category.cat_slug}`}><span key={category.id} className="w-fit h-fit text-sm text-white rounded-[100px] p-2 bg-orange-400 ">{category.cat_name}</span></Link>
                                    ))
                                : 
                                null
                                }
                            <div className="w-full h-full flex items-end justify-end gap-2">
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-500">{blog.likes}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ThumbsDown className="w-4 h-4 text-red-500" />
                                    <span className="text-gray-500">{blog.dislikes}</span>
                                </div>
                            </div>
                            </div>
                            <Link to={`/post/${blog.slug}`}><h2 className="mt-2 font-semibold text-2xl cursor-pointer hover:underline">{blog.title}</h2></Link>
                            <div className="mt-2 flex flex-row gap-4">
                                <span className="text-sm flex items-center gap-1 px-1">By: <img className="w-[16px] h-[16px] rounded-full  hover:scale-110 transition-all duration-300 ease-in-out " src={blog.author.profile_image} alt={blog.author.title} /><Link to={`/author/${blog.author.id}`}>{blog.author.user_name}</Link></span>
                                <span className="text-sm">{dayjs(blog.created_at).tz('Asia/Karachi').format('ddd, MMMM YYYY')}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-[80%] mx-auto flex justify-center ">

                    <Stack spacing={2}>
                        <Pagination
                            page={currentPage}
                            count={totalPages}
                            onChange={handlePageChange}
                            renderItem={(item) => (
                                <PaginationItem
                                    slots={{
                                        previous: ArrowLeft,
                                        next: ArrowRight,
                                    }}
                                    {...item}
                                />
                            )}
                        />
                    </Stack>

                </div>
            </div>
                )}
        </div>
    </div>
    <Footer />
    </main>
);

}