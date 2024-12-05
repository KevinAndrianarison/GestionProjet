import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function ModaleCommende({close}) {

    const etat = "Broullion";
    const remise = 50;
    const tva = 20;

    return (
        <div className="fixed top-0 left-0 w-full min-h-screen z-10 flex justify-center items-center">
            <div onClick={close} className="fixed top-0 left-0 w-full min-h-screen backdrop-blur-sm bg-gray-900 bg-opacity-50"></div>
            <div className=" p-4 rounded-lg relatif z-20 bg-white m-4 w-fit h-fit max-h-[90vh]">
                <div className='w-full flex justify-end mb-5'>
                    <FontAwesomeIcon onClick={close} icon={faXmark} className='text-[#e0e0e0] text-lg hover:text-red-500' />
                </div>
                <div className=" max-w-6xl mx-auto sm:px-6 lg:px-8 max-h-[calc(100vh-20vh)] overflow-y-auto">
                    <div className="">
                        <div className=" grid grid-cols-1 md:grid-cols-2 w-fit gap-2">
                            <div className="w-full p-6 mr-2 bg-gray-100 dark:bg-gray-800 sm:rounded-lg">
                                <h1 className="text-normal text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400">
                                    Nouvelle commande
                                </h1>

                                <div className="flex w-full justify-end items-center mt-2 text-gray-600 dark:text-gray-400">
                                    <div
                                        className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none py-1 px-2 text-xs rounded-md ${etat === 'Confirmer'
                                            ? 'bg-green-500/20 text-green-600'
                                            : etat === 'Broullion'
                                                ? 'bg-yellow-500/20 text-yellow-600'
                                                : 'bg-red-500/20 text-red-700'
                                            }`}
                                    >
                                        <span>{etat}</span>
                                    </div>
                                </div>

                                <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                                        alt="Profile avatar placeholder large"
                                        className="inline-block relative object-cover object-center !rounded-full w-9 h-9 rounded-md"
                                    />
                                    <div className="flex flex-col ml-4 text-md tracking-wide font-semibold w-full">
                                        <span>name</span>
                                        <span>emal@exemple.com</span>
                                    </div>
                                </div>

                                <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
                                    <div className="text-md tracking-wide font-semibold w-full whitespace-nowrap">
                                        Taux journalier moyenne : 50 €
                                    </div>
                                </div>

                                <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                                    <div className="text-md tracking-wide font-semibold w-full whitespace-nowrap">
                                        Budger total : 50 000 €
                                    </div>
                                </div>
                                {(tva || remise) && <div className="flex justify-between items-center w-full mt-2 text-gray-600 dark:text-gray-400">
                                    {tva && <div className="text-md tracking-wide font-semibold whitespace-nowrap">
                                        TVA : {tva} %
                                    </div>}

                                    {remise && <div className="text-md text-red-400 tracking-wide font-semibold whitespace-nowrap">
                                        Remise : {remise} %
                                    </div>}
                                </div>}
                                <div className="flex flex-col items-center mt-4 text-gray-600 dark:text-gray-400">
                                    <h1 className="text-normal text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
                                        Les Services
                                    </h1>
                                    <div className="w-full min-w-[300px] max-h-[246px] overflow-y-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                                                    <th className="px-2 py-3 w-full">Service</th>
                                                    <th className="px-2 py-3 whitespace-nowrap">Jours</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white">
                                                <tr className="text-gray-600">
                                                    <td className="px-2 py-3 border w-full">
                                                        <p className="font-semibold">Sufyan</p>
                                                    </td>
                                                    <td className="px-2 py-3 text-ms font-semibold border text-center">22</td>
                                                </tr>
                                                <tr className="text-gray-600">
                                                    <td className="px-2 py-3 border w-full">
                                                        <p className="font-semibold">Stevens</p>
                                                    </td>
                                                    <td className="px-2 py-3 text-md font-semibold border text-center">27</td>
                                                </tr>
                                                <tr className="text-gray-600">
                                                    <td className="px-2 py-3 border w-full">
                                                        <p className="font-semibold">Nora</p>
                                                    </td>
                                                    <td className="px-2 py-3 text-md font-semibold border text-center">17</td>
                                                </tr>
                                                <tr className="text-gray-600">
                                                    <td className="px-2 py-3 border w-full">
                                                        <p className="font-semibold">Ali</p>
                                                    </td>
                                                    <td className="px-2 py-3 border text-md font-semibold text-center">23</td>
                                                </tr>
                                                <tr className="text-gray-600">
                                                    <td className="px-2 py-3 border w-full">
                                                        <p className="font-semibold">Khalid</p>
                                                    </td>
                                                    <td className="px-2 py-3 border text-md font-semibold text-center">20</td>
                                                </tr>
                                                <tr className="text-gray-600">
                                                    <td className="px-2 py-3 border w-full">
                                                        <p className="font-semibold">Khalid</p>
                                                    </td>
                                                    <td className="px-2 py-3 border text-md font-semibold text-center">20</td>
                                                </tr>
                                                <tr className="text-gray-600">
                                                    <td className="px-2 py-3 border w-full">
                                                        <p className="font-semibold">Khalid</p>
                                                    </td>
                                                    <td className="px-2 py-3 border text-md font-semibold text-center">20</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                </div>
                            </div>

                            <form className="min-w-[348px] p-3 flex flex-col justify-between">
                                <h1 className="text-normal text-center text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400 mb-4">
                                    Ajouter une nouvelle commande
                                </h1>
                                <div className="flex items-end flex-col mb-2">
                                    <select className="w-fit mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none">
                                        <option selected>L'etat </option>
                                        <option value="Broullion">Broullion</option>
                                        <option value="Cofirmer">Cofirmer</option>
                                        <option value="Annuler">Annuler</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <input type="text" placeholder="Nom ou email client" className="w-full mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col mt-2">
                                    <input type="text" placeholder="Taux journalier moyenne" className="w-full mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                </div>

                                <div className="flex gap-5 mt-2">
                                    <div className='w-full min-w-[100px] relative flex items-center'>
                                        <input type="number" placeholder="Tva" className="w-full min-w-[100px] mt-2 py-3 px-3 pr-7 rounded-lg dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                        <p className='absolute right-2 top-4 text-base'>%</p>
                                    </div>
                                    <div className='w-full min-w-[100px] relative flex items-center'>
                                        <input type="number" placeholder="Remise" className="w-full min-w-[100px] mt-2 py-3 px-3 pr-7 rounded-lg dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                        <p className='absolute right-2 top-4 text-base'>%</p>
                                    </div>
                                </div>
                                <form className='w-full mt-8'>
                                    <h1 className="text-normal text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
                                        Ajouter un nouveau service
                                    </h1>
                                    <div className="flex flex-col mt-2">
                                        <input type="text" placeholder="Designation du servise" className="w-full mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                        <div className="flex gap-5 mt-2">
                                            <div className='w-full min-w-[100px] relative flex items-center'>
                                                <input type="number" placeholder="Durée par jours" className="w-full min-w-[100px] mt-2 py-3 px-3 pr-10 rounded-lg dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                                <p className='absolute right-2 top-5 text-normal'>/ jours</p>
                                            </div>
                                            <div className=' min-w-[100px] relative flex items-center justify-end'>
                                                <button className="md:w-32 bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300">
                                                    Ajouter
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </form>

                                <button className="md:w-32 bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300">
                                    Enregistrer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModaleCommende