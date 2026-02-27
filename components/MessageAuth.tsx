import { useEffect } from "react";

interface MessageAuthModalProps {
  isOpen: boolean;
  message: string;
  ispositve?: boolean;
  onClose: () => void;
}

export default function MessageAuthModal({ isOpen, message, onClose,ispositve }: MessageAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-red-50 rounded-full">
           {ispositve ? 
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg> :
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            }
          </div>
          {ispositve ? 
            <h3 className="text-xl font-semibold text-gray-900">Success!</h3> :
            <h3 className="text-xl font-semibold text-gray-900">Oops!</h3>
          }
          <p className="mt-3 text-gray-600 leading-relaxed">
            {message || ""}
          </p>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer mt-6 w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
};