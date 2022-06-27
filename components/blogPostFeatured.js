import { convert } from 'url-slug'

const RESOURCE_URL = '/blog'

const BlogPostFeatured = ({ posts }) => {
    if (!posts) return null

    return (
        <div className="row mt-4 mb-2">
            <div className="col-12 mb-4 text-center">
                <h1 className="">Latest from our blog</h1>
            </div>

            {posts?.map((post, index) => (
                <div
                    key={index}
                    className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-5"
                >
                    <div className="card bg-white border-light p-3 rounded">
                        <a
                            href={`${RESOURCE_URL}/${post.id}/${convert(
                                post.title
                            )}`}
                            className="text-center card-img-area align-middle"
                        >
                            <img
                                src={
                                    post.mainImage?.formats?.small?.url ||
                                    '/assets/img/home/overlay.jpeg'
                                }
                                className="card-img-blog rounded"
                                alt={post.title}
                            />
                        </a>

                        <div className="card-body p-0 pt-4 card-title-area">
                            <a
                                href={`${RESOURCE_URL}/${post.id}/${convert(
                                    post.title
                                )}`}
                                className="h4"
                            >
                                {post.title.length > 40
                                    ? `${post.title.slice(0, 40)}...`
                                    : post.title}
                            </a>
                            <div className="d-flex align-items-center my-4">
                                <h3 className="h6 small ml-2 mb-0">
                                    {post.blog_categories[0]?.title}
                                </h3>
                            </div>
                        </div>
                        <p className="mt-4">
                            <a
                                href={`${RESOURCE_URL}/${post.id}/${convert(
                                    post.title
                                )}`}
                                className="btn btn-sm btn-primary btn-block animate-up-2"
                            >
                                view more
                            </a>
                        </p>
                    </div>
                </div>
            ))}

            <div className="col-12 text-right">
                <h6>
                    <a href="/blog">more blog posts</a>
                </h6>
            </div>
        </div>
    )
}

export default BlogPostFeatured
