export default function Dialog({ children, ...props }) {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
          <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-xl">
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="w-full sm:flex sm:items-start">
                {props.icon ? (
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    {props.icon}
                  </div>
                ) : null}
                <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-xl font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    {props.title}
                  </h3>
                  <div className="mt-2">
                    {props.description ? (
                      <p className="text-sm text-gray-500">
                        {props.description}
                      </p>
                    ) : null}
                    {children}
                  </div>
                </div>
              </div>
            </div>
            {props.footer ? (
              <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                {props.footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
