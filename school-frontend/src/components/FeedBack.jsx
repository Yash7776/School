import React,{useState} from "react";
import AuthContext from '../Contex/AuthContext.jsx'
import { useContext } from "react";
const Instruction = () => {
  let { postFeedBack } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
      setIsOpen(false);
    console.log("Submitted message:", message);
    setMessage("Form Submited");
  };
  return (
    <div className="p-6">
      {/* Open Modal Button */}
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        onClick={() => setIsOpen(true)}
      >
        Send FeedBack
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Modal Content */}
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Enter Your Message</h2>

            <form method="post" onSubmit={postFeedBack}>
              <textarea
                className="w-full border border-gray-300 rounded p-2 mb-4 resize-none"
                rows="5"
                placeholder="Type your feedback..."
                id="content"
                name="content"
              ></textarea>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instruction;
