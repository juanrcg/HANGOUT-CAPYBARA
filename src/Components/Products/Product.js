import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const Product = ({ id, name, price, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <span>
        {name} - ${price}
      </span>
      <div className="flex gap-2">
        <button onClick={() => onEdit(id)}>
          <FontAwesomeIcon icon={faPencilAlt} className="text-black" size="lg" />
        </button>
        <button onClick={() => onDelete(id)}>
          <FontAwesomeIcon icon={faTrash} className="text-black" size="lg" />
        </button>
      </div>
    </div>
  );
};

export default Product;
