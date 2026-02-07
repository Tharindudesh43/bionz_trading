"use client";

import CollectionManager from "@/components/AdminComponents/Admin_Course_Components/couese-editor/CollectionManager";
import IntroductionCourse from "@/components/AdminComponents/Admin_Course_Components/couese-editor/IntroductionCourse";
import AddMainCollectionForm from "@/components/AdminComponents/Admin_Course_Components/PopUpModels/PopUpMainModels/AddMainCollectionForm";
import DeleteMainCollectionForm from "@/components/AdminComponents/Admin_Course_Components/PopUpModels/PopUpMainModels/DeleteMainCollectionForm";
import EditMainCollectionForm from "@/components/AdminComponents/Admin_Course_Components/PopUpModels/PopUpMainModels/EditMainCollectionForm";
import AddSubCollectionForm from "@/components/AdminComponents/Admin_Course_Components/PopUpModels/PopUpSubModels/AddSubCollectionForm";
import DeleteSubCollectionConfirmation from "@/components/AdminComponents/Admin_Course_Components/PopUpModels/PopUpSubModels/DeleteSubCollectionForm";
import EditSubCollectionForm from "@/components/AdminComponents/Admin_Course_Components/PopUpModels/PopUpSubModels/EditSubCollectionForm";
import AddNewLessonForm from "@/components/AdminComponents/Admin_Course_Components/PopUpModels/PopUpSubModels/LessonModels/AddLessonForm";
import { MainCollection, SubCollection } from "@/types/collection_models";
import axios from "axios";
import { Timestamp } from "firebase/firestore";
import { JSX, useEffect, useState } from "react";

const EmptyOrAddBox: React.FC<{
  title: string;
  buttonText: string;
  onClick?: () => void;
}> = ({ title, buttonText, onClick }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-6 border-2 border-dashed border-gray-600 dark:border-gray-400 rounded-xl bg-gray-700 dark:bg-gray-100 text-center shadow-lg transition duration-300 hover:shadow-xl">
    <p className="text-gray-300 dark:text-gray-700 text-xl sm:text-2xl font-semibold mb-4">
      {title}
    </p>

    <button
      onClick={onClick}
      className="px-8 py-3 cursor-pointer bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
    >
      {buttonText}
    </button>
  </div>
);

const LoadingState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center min-h-[200px] p-6 bg-gray-800 dark:bg-gray-200 rounded-xl col-span-full">
    <p className="text-white dark:text-gray-800 text-lg sm:text-2xl font-medium animate-pulse">
      {message}
    </p>
  </div>
);

export default function CourseEditor() {
  // Data States
  const [mainCollection, setmainCollection] = useState<MainCollection[]>([]);
  const [subCollections, setsubCollections] = useState<SubCollection[]>([]);

  // Loading States
  const [maincollectionloading, setmaincollectionloading] =
    useState<boolean>(false);
  const [subcollectionloading, setsubcollectionloading] =
    useState<boolean>(false);

  //Main Model States
  const [showAddMainCollectionModal, setShowAddMainCollectionModal] =
    useState<boolean>(false);
  const [showEditMainCollectionModal, setShowEditMainCollectionModal] =
    useState<boolean>(false);
  const [showDeleteMainCollectionModal, setshowDeleteMainCollectionModal] =
    useState<boolean>(false);

  //Sub Model States
  const [showAddSubCollectionModal, setShowAddSubCollectionModal] =
    useState<boolean>(false);
  const [showEditSubCollectionModal, setShowEditSubCollectionModal] =
    useState<boolean>(false);
  const [showDeleteSubCollectionModal, setshowDeleteSubCollectionModal] =
    useState<boolean>(false);

  //Edit State
  const [itemToEdit, setItemToEdit] = useState<MainCollection | null>(null);
  const [itemToEditSub, setItemToEditSub] = useState<SubCollection | null>(
    null
  );

  //Delete State
  const [main_collection_id, Setmain_collection_id] = useState<string>("");
  const [sub_collection_id, Setsub_collection_id] = useState<string>("");

  //Lesson State
  const [sub_collection_lesson_id, Setsub_collection_lesson_id] =
    useState<string>("");

  async function fetchMainTypesCollcetion() {
    try {
      setmaincollectionloading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/GetCollection/GetMainCollection`
      );

      setmainCollection(
        Array.isArray(res.data.data) ? res.data.data : [res.data.data]
      );
    } catch (err) {
      console.error("Error fetching collections:", err);
    } finally {
      setmaincollectionloading(false);
    }
  }

  async function fetchSubTypesCollcetion() {
    try {
      setsubcollectionloading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/GetCollection/GetSubCollection`
      );
      setsubCollections(
        Array.isArray(res.data.data) ? res.data.data : [res.data.data]
      );
    } catch (err) {
      console.error("Error fetching collections:", err);
    } finally {
      setsubcollectionloading(false);
    }
  }

  useEffect(() => {
    fetchSubTypesCollcetion();
    fetchMainTypesCollcetion();
  }, []);

  function handleshowAddMainCollectionModal() {
    setShowAddMainCollectionModal(!showAddMainCollectionModal);
  }

  function handleshowAddSubCollectionModal() {
    setShowAddSubCollectionModal(!showAddSubCollectionModal);
  }

  function handleCloseAddMainCollectionModal() {
    setShowAddMainCollectionModal(false);
  }

  function handleshowEditMainCollectionModal(collection: MainCollection) {
    setItemToEdit(collection);
    setShowEditMainCollectionModal(!showEditMainCollectionModal);
  }

  function hanldeshowDeleteMainCollectionModel(collection_id: string) {
    setshowDeleteMainCollectionModal(!showDeleteMainCollectionModal);
    Setmain_collection_id(collection_id);
  }

  function hanldeshowDeleteSubCollectionModel(collection_id: string) {
    setshowDeleteSubCollectionModal(!showDeleteSubCollectionModal);
    Setsub_collection_id(collection_id);
  }

  const handleManEditCourse = (collection: MainCollection) => {
    setItemToEdit(collection);
  };

  const handleSubEditCourse = (editcollection: SubCollection) => {
    setItemToEditSub(editcollection);
  };

  function hanldeshowAddLessonModel(collection_id: string) {
    Setsub_collection_lesson_id(collection_id);
  }

  return (
  <div className="min-h-screen bg-gray-900 dark:bg-white transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      <header className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-400 dark:text-blue-600 border-b pb-4 border-gray-700 dark:border-gray-200 flex items-center gap-3">
          <span className="shrink-0">📚</span> 
          <span className="leading-tight">Course Management Dashboard</span>
        </h1>
      </header>


      <section className="mb-10 sm:mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-gray-800">
            Main Collection
          </h2>
        </div>
        
        <div className="rounded-2xl shadow-2xl p-4 sm:p-6 bg-gray-800 dark:bg-gray-100 border border-white/5 dark:border-gray-200">
          {maincollectionloading ? (
            <div className="py-10">
              <LoadingState message="Loading Introduction Course..." />
            </div>
          ) : mainCollection.length === 0 ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <EmptyOrAddBox
                onClick={handleshowAddMainCollectionModal}
                title="Empty Main Introduction Course"
                buttonText="+ Create New Main Course"
              />
            </div>
          ) : (
            
            <div className="overflow-hidden">
              <IntroductionCourse
                onEdit={handleManEditCourse}
                onDelete={() => {
                  hanldeshowDeleteMainCollectionModel(
                    mainCollection[0].collection_id
                  );
                }}
                data={mainCollection}
              />
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-gray-800">
            Sub Collections
          </h2>
        </div>

        {subcollectionloading ? (
          <div className="py-10">
            <LoadingState message="Loading Course Modules..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-4 sm:gap-6">
            {subCollections.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-gray-800 dark:bg-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-700 dark:border-gray-300">
                  <EmptyOrAddBox
                    title="No Course Modules Found"
                    buttonText="+ Add Your First Module"
                    onClick={handleshowAddSubCollectionModal}
                  />
                </div>
              </div>
            ) : (
              <>
                {subCollections.map((subCollection) => (
                  <div
                    key={subCollection.collection_id}
                    className="group col-span-1 bg-gray-800 dark:bg-gray-100 rounded-2xl shadow-md hover:shadow-2xl hover:ring-2 hover:ring-blue-500/50 transition-all duration-300 overflow-hidden border border-white/5 dark:border-gray-200"
                  >
                    <div className="p-1"> 
                      <CollectionManager
                        onEditLessonSuccess={fetchSubTypesCollcetion}
                        onDeleteLessonSuccess={fetchSubTypesCollcetion}
                        onAddNewLesson={() => {
                          hanldeshowAddLessonModel(subCollection.collection_id);
                        }}
                        onEdit={() => {
                          handleSubEditCourse(subCollection);
                        }}
                        onDelete={() => {
                          hanldeshowDeleteSubCollectionModel(
                            subCollection.collection_id
                          );
                        }}
                        collection={subCollection}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="col-span-full mt-4">
                  <div className="transition-transform active:scale-[0.98]">
                    <EmptyOrAddBox
                      onClick={handleshowAddSubCollectionModal}
                      title="Add New Course Module"
                      buttonText="+ Add New Module"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>

      {/* ALL THE MODELS --------------------------------------------------- */}
      {showAddMainCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <AddMainCollectionForm
              onClose={() => {
                handleCloseAddMainCollectionModal();
              }}
              onSubmitSuccess={fetchMainTypesCollcetion}
            />
          </div>
        </div>
      )}
      {itemToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <EditMainCollectionForm
              initialData={itemToEdit}
              onClose={() => setItemToEdit(null)}
              onEditSubmitSuccess={() => fetchMainTypesCollcetion()} 
            />
          </div>
        </div>
      )}
      {showDeleteMainCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <DeleteMainCollectionForm
              MainCollectionID={main_collection_id}
              onClose={() => {
                setshowDeleteMainCollectionModal(false);
              }}
              onDeleteSuccess={fetchMainTypesCollcetion}
            />
          </div>
        </div>
      )}
      {showAddSubCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <AddSubCollectionForm
              onClose={() => {
                setShowAddSubCollectionModal(false);
              }}
              onSubmitSuccess={() => {
                fetchSubTypesCollcetion();
              }}
            />
          </div>
        </div>
      )}
      {itemToEditSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <EditSubCollectionForm
              initialData={itemToEditSub}
              onClose={() => {
                setItemToEditSub(null);
              }}
              onEditSubmitSuccess={() => fetchSubTypesCollcetion()} // Function to re-fetch data after successful edit
            />
          </div>
        </div>
      )}
      {showDeleteSubCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <DeleteSubCollectionConfirmation
              SubCollectionID={sub_collection_id}
              onClose={() => {
                setshowDeleteSubCollectionModal(false);
              }}
              onDeleteSuccess={fetchSubTypesCollcetion}
            />
          </div>
        </div>
      )}
      {sub_collection_lesson_id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <AddNewLessonForm
              onClose={() => {
                Setsub_collection_lesson_id("");
              }}
              onSubmitSuccess={fetchSubTypesCollcetion}
              collectionId={sub_collection_lesson_id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
