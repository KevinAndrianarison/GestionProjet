import React from 'react'

function NotResultat({ text }) {
    return (
        <div className="max-w-2xl mx-auto mt-8">
            <img src="https://www.creative-tim.com/twcomponents/svg/undraw_no_data_qbuo.svg" alt="content image" class="w-64 mx-auto" />
            <p className="mt-8 font-semibold text-center text-gray-500 dark:text-gray-200">
                {text}
            </p>
        </div>
    )
}

export default NotResultat