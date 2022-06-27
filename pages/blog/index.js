import getConfig from 'next/config'
import { useState } from 'react'
import { convert } from 'url-slug'
import Layout from '../../components/layout'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const RESOURCE_BLOG_CATEGORIES = '/blog-categories'
const RESOURCE_BLOG_POSTS = '/blog-posts'
const RESOURCE_URL = '/blog'

const Resource = ({ categories, posts, totalPosts }) => {
    const initialState = {
        totalPosts: totalPosts,
        currentPage: 0,
        totalPages: Math.floor(totalPosts / 10),
        currentCategory: '',
        categories: categories,
        posts: posts,
        loading: false,
        error: '',
    }

    const [query, setQuery] = useState(initialState)

    const handleCategory = (e) => {
        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            error: '',
            currentPage: 0,
        }))

        const category = e.currentTarget.dataset.category

        fetch(
            `${publicRuntimeConfig.apiUrl}${RESOURCE_BLOG_POSTS}/count?blog_categories=${category}`
        )
            .then((res) => res.json())
            .then((totalPosts) => {
                fetch(
                    `${publicRuntimeConfig.apiUrl}${RESOURCE_BLOG_POSTS}?blog_categories=${category}&_start=0&_limit=10`
                )
                    .then((res) => res.json())
                    .then((json) => {
                        setQuery((prevState) => ({
                            ...prevState,
                            posts: json,
                            loading: false,
                            error: '',
                            totalPosts: totalPosts,
                            totalPages: Math.floor(totalPosts / 10),
                            currentCategory: category,
                        }))
                    })
            })
    }

    const handlePagination = (e) => {
        const pageNumber = e.currentTarget.dataset.page
        if (query.currentPage === pageNumber) return

        setQuery((prevState) => ({
            ...prevState,
            loading: true,
            error: '',
        }))

        fetch(
            `${
                publicRuntimeConfig.apiUrl
            }${RESOURCE_BLOG_POSTS}?_limit=10&_start=${pageNumber * 10}${
                query.currentCategory
                    ? `&blog_categories=${query.currentCategory}`
                    : null
            }`
        )
            .then((res) => res.json())
            .then((json) => {
                setQuery((prevState) => ({
                    ...prevState,
                    posts: json,
                    loading: false,
                    error: '',
                    currentPage: pageNumber,
                }))
            })
    }

    return (
        <section>
            <section
                className="section section-header section-header-image section-image bg-primary overlay-primary text-white pt-8 pb-2 pb-md-2"
                data-background="/assets/img/home/banner-blog.jpg"
            >
                <div className="container">
                    <div className="row justify-content-center mt-6 mb-6">
                        <div className="col-12 col-xl-8 text-center">
                            <h1 className="display-2">
                                Everything you need to know
                            </h1>
                            <p className="lead">For your car and lifestyle</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="section section-lg pt-6">
                <div id="spaces-container" className="container">
                    <div className="row">
                        <aside
                            id="filters-container"
                            className="col-12 col-lg-3 mt-3 mt-lg-0 z-2 order-lg-2"
                        >
                            <div
                                // id="filters-sidebar"
                                className="d-none d-lg-block"
                            >
                                {query.categories?.map((category, index) => (
                                    <div
                                        key={index}
                                        className="card border-light p-3 mb-2"
                                    >
                                        <a
                                            className="accordion-panel-header w-100 d-flex align-items-center justify-content-between"
                                            role="button"
                                            onClick={handleCategory}
                                            data-category={category.id}
                                        >
                                            <span className="icon-title h6 mb-0 font-weight-bold">
                                                {category.title}
                                            </span>
                                            <span className="icon icon-xs">
                                                <span className="fas fa-angle-right"></span>
                                            </span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </aside>
                        <div className="col-12 col-lg-9 order-lg-1">
                            <div className="tab-content">
                                <div className="tab-pane fade show active">
                                    <div className="row">
                                        {query.loading === true && (
                                            <div className="col-12 text-center pt-4 pb-10">
                                                <div className="m-4">
                                                    <img
                                                        src="/assets/img/loading.gif"
                                                        width="16"
                                                        height="16"
                                                    />{' '}
                                                    Loading
                                                </div>
                                            </div>
                                        )}

                                        {query.loading === false &&
                                            query.posts?.map((post, index) => (
                                                <div
                                                    key={index}
                                                    className="col-12 col-md-6 col-lg-6 mb-3 mb-lg-2"
                                                >
                                                    <div className="card bg-white border-light p-3 rounded">
                                                        <a
                                                            href={`${RESOURCE_URL}/${
                                                                post.id
                                                            }/${convert(
                                                                post.title
                                                            )}`}
                                                            className="text-center"
                                                        >
                                                            <img
                                                                src={
                                                                    post
                                                                        .mainImage
                                                                        ?.formats
                                                                        ?.small
                                                                        ?.url ||
                                                                    '/assets/img/home/overlay.jpeg'
                                                                }
                                                                className="card-img-blog rounded"
                                                                alt={post.title}
                                                                width="400"
                                                            />
                                                        </a>
                                                        <div className="card-body text-center">
                                                            <p className="pt-0 pb-2">
                                                                <a
                                                                    href={`${RESOURCE_URL}/${
                                                                        post.id
                                                                    }/${convert(
                                                                        post.title
                                                                    )}`}
                                                                    className="btn btn-sm btn-primary btn-block animate-up-2"
                                                                >
                                                                    view more
                                                                </a>
                                                            </p>
                                                            <a
                                                                href="./blog-post.html"
                                                                className="h4"
                                                            >
                                                                {post.title}
                                                            </a>

                                                            <div className="d-flex align-items-center my-4">
                                                                {post.blog_categories?.map(
                                                                    (
                                                                        category,
                                                                        index
                                                                    ) => (
                                                                        <small
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="ml-2 mb-0 badge badge-primary"
                                                                        >
                                                                            <span className="fas fa-tag"></span>{' '}
                                                                            {
                                                                                category.title
                                                                            }
                                                                        </small>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                {query.totalPages > 0 && (
                                    <div className="col mt-6 d-flex justify-content-center">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                {/* <li className="page-item disabled">
                                                    <a
                                                        className="page-link"
                                                        tabIndex="-1"
                                                        href="#"
                                                    >
                                                        Previous
                                                    </a>
                                                </li> */}
                                                {[...Array(totalPages)].map(
                                                    (x, i) => (
                                                        <li
                                                            key={i}
                                                            className={`page-item ${
                                                                currentPage ===
                                                                i
                                                                    ? 'active'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <a
                                                                className="page-link"
                                                                onClick={handlePagination()}
                                                                data-page={i}
                                                            >
                                                                {i + 1}
                                                            </a>
                                                        </li>
                                                    )
                                                )}
                                                {/* <li className="page-item">
                                                    <a
                                                        className="page-link"
                                                        href="#"
                                                    >
                                                        Next
                                                    </a>
                                                </li> */}
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export async function getServerSideProps({ params }) {
    const categories = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}${RESOURCE_BLOG_CATEGORIES}?_limit=12`
        )
    ).json()

    const posts = await (
        await fetch(
            `${serverRuntimeConfig.apiUrl}${RESOURCE_BLOG_POSTS}?_limit=6&_sort=created_at:DESC`
        )
    ).json()

    const totalPosts = await (
        await fetch(`${serverRuntimeConfig.apiUrl}${RESOURCE_BLOG_POSTS}/count`)
    ).json()

    return {
        props: {
            categories,
            posts,
            totalPosts,
        },
    }
}

Resource.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export default Resource
