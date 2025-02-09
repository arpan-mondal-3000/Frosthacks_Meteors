import React, { useState, useEffect } from "react";
import { fetchGenericName, get_medicine_links } from "../api/index";
import { InfinitySpin } from "react-loader-spinner";
import { DiamondPlusIcon } from "lucide-react";
function toSentenceCase(str: string) {
    if (!str) return ""; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const GenericName = ({ medicineName, setShowGenericName }: { medicineName: string, setShowGenericName: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [isOpenItems, setIsOpenItems] = useState(false);
    const [genericResult, setGenericResult] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingLinks, setIsLoadingLinks] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [medicineData, setMedicineData] = useState<any>([]);


    const handleMedicineLinks = async (e: any) => {
        if (e.target.id && e.target.name) {
            setOpenDropdown(
                openDropdown === Number(e.target.id) ? null : Number(e.target.id)
            );
            console.log(openDropdown, Number(e.target.id));
            try {
                console.log(toSentenceCase(e.target.name));
                setIsLoadingLinks(true);
                const linkData = await get_medicine_links(
                    toSentenceCase(e.target.name)
                );
                setIsLoadingLinks(false);
                // data.medicines[e.target.id].websites = linkData.medicines;
                setMedicineData(linkData.medicines);

                console.log(linkData.medicines);
            } catch (err) {
                console.error("Medicine links cannot be fetched: ", err);
                setIsLoadingLinks(false);
            }
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchGenericName(medicineName);
                setGenericResult(result);
                setIsLoading(false);
                console.log("Generic Name: ", result);
            } catch (err) {
                console.error("Failed to fetch generic names: ", err);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);



    return (
        <>
            {isLoading ? (
                // 🔹 Loading Screen
                <div className="w-screen h-screen flex items-center justify-center">
                    <div className="flex flex-col justify-center items-center">
                        <InfinitySpin width="200" color="#4fa94d" />
                        <div className="animate-pulse text-gray-700 font-medium mt-2">
                            Please wait, AI is scanning...
                        </div>
                    </div>
                </div>
            ) : (
                // 🔹 Main Content
                <div className="max-w-2xl mx-auto p-6">
                    {/* Medicine Name */}
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        {genericResult.name}
                    </h2>

                    {/* More Medicines Section */}
                    <p className="mt-3 text-gray-600 font-medium text-center">
                        More Medicines Links
                    </p>

                    {/* Medicine List */}
                    <div className="mt-6 space-y-4">
                        {genericResult.results.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
                            >
                                {/* Medicine Name (Clickable) */}
                                <div className="text-gray-800 bg-white p-2 rounded-lg font-medium cursor-pointer text-center">
                                    {item}
                                </div>

                                {/* Buy Button */}
                                <div className="flex justify-center mt-2">
                                    {openDropdown !== index && (
                                        <button
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
                                            onClick={(e) => handleMedicineLinks(e)}
                                            id={index.toString()}
                                            name={item}
                                        >
                                            Buy
                                        </button>
                                    )}
                                </div>

                                {/* Links Section (Appears Below the Name) */}
                                {openDropdown === index && (
                                    <div className="mt-3">
                                        {isLoadingLinks ? (
                                            <div className="flex flex-col justify-center items-center text-center h-full w-full min-h-[150px]">
                                                <span className="text-gray-600 font-medium mt-2">Loading...</span>
                                            </div>

                                        ) : (
                                            <div className="mt-2 space-y-2 text-center">
                                                {medicineData.map((prod: any, idx: number) => (
                                                    <div key={idx} className="text-blue-600 font-medium">
                                                        <a
                                                            href={prod.link}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="hover:underline"
                                                        >
                                                            🔗 {prod.title}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </>
    );

};

export default GenericName;
