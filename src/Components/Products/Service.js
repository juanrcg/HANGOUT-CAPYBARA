import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const Service = ({ id, name, price, onEdit, onDelete }) => {
  return (
    <div className="p-3 mb-3 border rounded" style={{ backgroundColor: "#222", color: "#fff" }}>
      <h4>{name}</h4>
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">${price}</span>
        <div className="d-flex gap-2">
          <button onClick={() => onEdit(id)} className="btn btn-outline-light">
            <FontAwesomeIcon icon={faPencilAlt} className="text-black" size="lg" />
          </button>
          <button onClick={() => onDelete(id)} className="btn btn-outline-light">
            <FontAwesomeIcon icon={faTrash} className="text-black" size="lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Service;
