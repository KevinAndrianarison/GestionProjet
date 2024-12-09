const ClientInfo = ({ client }) => (
    <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
        <img
            src={client.image ? client.image :
                !(client.type == "societe") ?
                    "https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif"
                    :
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4nNZc5akpfBa9kyw5Ry5m269i-ZRKL5SblopwkW3IkAO-eQVP"}
            alt={client.nom ? client.nom : "avatar placeholder"}
            className="inline-block relative object-cover object-center !rounded-full w-9 h-9 rounded-md"
        />
        <div className="flex flex-col ml-4 text-md tracking-wide font-semibold w-full">
            {client.type == "societe" ? <>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{client.nom_societe ? `${client.nom_societe} (${client.type})` : "nom du societe client"}</span>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{client.email_societe ? client.email_societe : "email du client societe"}</span>
            </> : <>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{client.nom ? `${client.nom} (${client.type})` : "nom du client"}</span>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{client.email ? client.email : "email du client"}</span>
            </>}
        </div>
    </div>
);

export default ClientInfo;