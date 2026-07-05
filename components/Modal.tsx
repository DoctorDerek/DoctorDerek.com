import classNames from "@/utils/classNames"
import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Fragment } from "react"

export default function Modal({
  portfolioWork,
  showModal,
  setShowModal,
}: {
  portfolioWork: {
    projectTitle: string
    details: string
    tech: string[]
    isClicked: boolean
  }[]
  showModal: boolean
  setShowModal: (value: boolean) => void
}) {
  return (
    <Transition.Root show={showModal ? true : false} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setShowModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                    onClick={() => setShowModal(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex">
                  {portfolioWork.map((item) => {
                    return (
                      <div
                        className={classNames(!item.isClicked && "hidden")}
                        key={"modal-key"}
                      >
                        <h3 className="restorabold my-4 text-4xl">
                          {item.projectTitle}
                        </h3>
                        <p>{item.details}</p>
                      </div>
                    )
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
