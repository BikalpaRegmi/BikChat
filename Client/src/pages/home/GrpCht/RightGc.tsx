
const RightGc = () => {
  return (
    <div className="col-span-2">
   
        <div className="w-full bg-gray-100 dark:bg-slate-900 neo-shadow p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center bg-slate-900 space-x-4">
            <div className="w-12 h-12 rounded-full neo-shadow flex items-center justify-center">
              <img
                
                className="rounded-full text-xl font-semibold text-gray-700 dark:text-gray-300"
                alt="Partner"
              />
            </div>
            <h1 className="text-2xl font-bold dark:text-gray-200">
              Steroid
            </h1>
          </div>

          {/* Messages */}
          <div
            className="h-96 overflow-y-auto neo-inset p-4 rounded-xl space-y-4"
          >
              <div
                
                className='flex items-start space-x-2 '
                  
              >
                <i
                  className='text-slate-500 self-center text-[12px]'
                >
                  time
                </i><p>c</p>
                <div
                  className='p-3 rounded-lg neo-shadow max-w-xs '
                >
                  <p
                    className='text-sm '
                    
                  >d
                  </p>
                </div>
                <i
                  className='text-slate-500 self-center text-[12px] '
                >
date                </i>
              </div>
            <div />
          </div>
          {/* Input Field */}
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <input
               
                type="text"
                placeholder="Type your message..."
                className="w-full p-4 rounded-xl neo-inset bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              className="p-4 rounded-xl neo-shadow neo-button focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      
    </div>
  );
}

export default RightGc
