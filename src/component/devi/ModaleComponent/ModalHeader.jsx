import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ModalHeader = ({ close }) => (
    <div className='w-full flex justify-end mb-5'>
        <FontAwesomeIcon onClick={close} icon={faXmark} className='text-[#e0e0e0] text-lg hover:text-red-500 cursor-pointer' />
    </div>
);

export default ModalHeader