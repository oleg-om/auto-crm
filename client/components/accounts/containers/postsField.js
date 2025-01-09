import React from 'react'

const POSTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const PostsField = ({ state, onChange }) => {
  return (
    <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
      <label
        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
        htmlFor="grid-first-name"
      >
        Пост № (для печати талонов на одной точке на разных ПК)
      </label>
      <div className="flex-shrink w-full inline-block relative mb-3">
        <select
          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
          value={state.post}
          name="post"
          id="post"
          onChange={onChange}
        >
          <option value="" className="text-gray-800">
            Не выбран
          </option>
          {POSTS.map((it) => {
            return (
              <option value={it} key={`post-${it}`}>
                №{it}
              </option>
            )
          })}
        </select>
        <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default PostsField