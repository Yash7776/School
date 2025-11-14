import React,{useState} from "react";
import AuthContext from '../Contex/AuthContext.jsx'
import { useContext } from "react";
const Instruction = () => {
  let { postInstruction } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
      setIsOpen(false);
    console.log("Submitted message:", message);
    setMessage("Form Submited");
  };
  return (
    <div>
      {/* Open Modal Button */}
      <button
        className="group relative inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Send Instructions</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-slideUp">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Instructions</h2>
                  <p className="text-green-100 text-sm">Share important information</p>
                </div>
              </div>
            </div>

            <form method="post" onSubmit={postInstruction} className="p-6">
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl p-4 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                rows="6"
                placeholder="Type your instructions here..."
                id="content"
                name="content"
                required
              ></textarea>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
                >
                  Send Instructions
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
