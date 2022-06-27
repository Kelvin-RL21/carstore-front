export default function SearchBar({ children }) {
    return (
        <div className="container mt-4 search-box-header">
            <div className="search-bar-postcode pb-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-8 text-center">
                        <h4 className="display-2">Find your space</h4>
                        <p className="lead">
                            Where would you like your vehicle stored?
                        </p>
                    </div>
                </div>
                <div className="row justify-content-center m-1">
                    <div className="col-12 col-md-8">
                        <div className="card p-md-2">
                            <div className="card-body p-2 p-md-0">
                                <form
                                    autoComplete="off"
                                    className="row"
                                    action="/storage/search"
                                    method="get"
                                >
                                    <div className="col-12 col-lg-8">
                                        <div className="form-group form-group-lg mb-lg-0">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <span className="fas fa-map-marker-alt"></span>
                                                    </span>
                                                </div>
                                                <input
                                                    id="search-location"
                                                    type="text"
                                                    name="postcode"
                                                    className="form-control autocomplete"
                                                    placeholder="Postcode eg. MK16 8NP"
                                                    required={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <button
                                            className="btn btn-lg btn-secondary btn-block animate-right-2"
                                            type="submit"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center pt-5 pb-6">
                <div className="col-12 text-center">
                    <h4 className="text-primary">
                        Check the cost & availability of the UK’s best car
                        storage facilities
                    </h4>
                </div>
            </div>
        </div>
    )
}
