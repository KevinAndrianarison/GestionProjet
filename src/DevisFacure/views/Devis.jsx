import React, { useState } from 'react'
import PageTitle from '../../component/devi/PageTitle';
import ActionButton from '../../component/devi/ActionButton';
import { dataTestCommende } from '../../utils/dataTestcommende';
import DataTable from '../../component/devi/DataTable';
import ModaleCommende from '../../component/devi/ModaleCommende';

function DevisPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false)
  const handleNewOrder = () => {
    toogleShowModal();
  };

  const toogleShowModal = () => {
    setShowModal(!showModal)
  };

  return (
    <div>
      {showModal && <ModaleCommende close={toogleShowModal}/>}
      <PageTitle title="Tous les commandes" />
      <div className="flex items-center space-x-2">
        <ActionButton text="Nouveau commande" onClick={handleNewOrder} />
      </div>
      {dataTestCommende.length && <div className="flex justify-center items-center mt-2">
        <div className="flex justify-between items-center h-[34px] pl-2 w-fit overflow-hidden rounded-md border border-gray-400">
          <div className='h-full flex py-2 pr-1 border-r border-r-gray-400 mr-1'>
            <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/faq-8-svg1.svg" alt="search" />
          </div>
          <input
            className="focus:outline-none bg-white w-[200px]"
            type="text"
            placeholder="Recherche"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

        </div>
      </div>}
      <div className="p-6 overflow-auto px-0 pt-2">
        <DataTable data={dataTestCommende} name={"commandes"} searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default DevisPage