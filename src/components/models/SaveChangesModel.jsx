import React from 'react';

const SaveChangesModel = ({ isChanged, onSave, setShowSavePopup }) => {
    if (!isChanged) return null; // Only show the modal if changes were made

    return (
        <div className="fixed inset-x-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-background-dark p-4 rounded-t-lg shadow-lg text-center flex items-center justify-between">
                {/* Question Text */}
                <p className="text-sm px-4 py-2 dark:text-white">Do you want to save your changes?</p>
                {/* Buttons */}
                <div className="flex space-x-6">
                    <button
                        onClick={() => {
                            onSave(); // Call the save function passed as a prop
                            setShowSavePopup(false); // Close the modal after saving
                        }}
                        className="px-4 py-2 bg-button dark:bg-buttonDark text-white rounded-lg shadow hover:bg-button-hover dark:hover:bg-button-darkhover text-sm"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => { console.log("Cancel clicked"); setShowSavePopup(false) }} // Close modal on cancel
                        className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow ml-2 hover:bg-gray-400 text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveChangesModel;
