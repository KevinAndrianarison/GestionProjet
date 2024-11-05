export default function SousProjet() {
  return (
    <>
      <div className=" text-xs p-2">
        <h1 className="font-bold">Créer une grande étapes : </h1>
        <div className="flex mt-2 items-end flex-wrap">
          <div>
            <label>Nom de la grande étape</label>
            <input
              type="text"
              placeholder="Nom de la grande étape"
              className="mt-1 mr-2 pl-3 pr-3 block w-60 h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              className="mt-1 
            mr-2 pl-3 pr-3 block w-60 min-h-8 h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            ></textarea>
          </div>
          <div>
            <label>Date de fin réel</label>
            <input
              type="date"
              className="mt-1 mr-2 pl-3 pr-3 block w-60  h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            />
          </div>
          <button className="border px-5 bg-blue-500 text-white  h-8 rounded">
            Enregistrer
          </button>
        </div>
        <div className="mt-5 bg-red-500">LISTE</div>
      </div>
    </>
  );
}
