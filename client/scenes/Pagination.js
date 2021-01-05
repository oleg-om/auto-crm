import React from 'react'
import cx from 'classnames'

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage, currentPosts }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between rounded-lg shadow">
      <ul className="flex">
        <button
          type="button"
          className="mx-1 px-3 py-2 text-xs rounded-lg font-bold bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400"
          onClick={() => (currentPage > 1 ? paginate(currentPage - 1) : null)}
        >
          Назад
        </button>
        {pageNumbers
          .filter(
            (it) =>
              it === currentPage ||
              it === currentPage + 1 ||
              it === currentPage + 2 ||
              it === currentPage - 1
          )
          .map((number) => (
            <button
              type="button"
              key={number}
              onClick={() => paginate(number)}
              className={cx('mx-1 px-3 py-2 text-xs rounded-lg font-bold', {
                'bg-gray-600 text-gray-100 hover:text-gray-200 hover:bg-gray-700':
                  currentPage === number,
                'bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400':
                  currentPage !== number
              })}
            >
              {number}
            </button>
          ))}
        <button
          type="button"
          className="mx-1 px-3 py-2 text-xs rounded-lg font-bold bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400"
          onClick={() =>
            currentPage < totalPosts &&
            totalPosts > postsPerPage &&
            currentPosts.length >= postsPerPage
              ? paginate(currentPage + 1)
              : null
          }
        >
          Дальше
        </button>
      </ul>
    </nav>
  )
}

export default Pagination
