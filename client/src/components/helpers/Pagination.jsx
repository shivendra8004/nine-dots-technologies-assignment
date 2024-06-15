const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    return (
        <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                    onClick={() => handleClick(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
};
