// import React from "react";
// import "./ConfirmModal.css";

// const ConfirmModal = ({ message, onConfirm, onCancel }) => {
//   return (
//     <div className="modal-overlay" onClick={onCancel}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <p>{message}</p>
//         <div className="modal-actions">
//           <button className="confirm-btn" onClick={onConfirm}>
//             Yes
//           </button>
//           <button className="cancel-btn" onClick={onCancel}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmModal;



// ✅ Refactored ConfirmModal.jsx
import React from "react";
import ModalWrapper from "./ModalWrapper";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <ModalWrapper onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-base text-gray-800 dark:text-gray-100">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmModal;

