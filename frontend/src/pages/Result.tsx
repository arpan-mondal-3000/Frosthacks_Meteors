import { Link, useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrescriptionPDF from "../components/PrescriptionPdf";
import { useState, useEffect } from "react";
import { get_medicine_links, get_location, fetchMedicineDetails } from "../api";
import { InfinitySpin } from "react-loader-spinner";
import { MapPin, MessageCircle } from "lucide-react";
import GenericName from "../components/GenericName";
function toSentenceCase(str: string) {
  if (!str) return ""; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// const demoDataLink = {
//   medicines: [
//     {
//       image:
//         "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQOTNFlaD9XT05vyxV3sHnbMPE-VWLxLnG33yDV9xHkeshhNSZcBNISEfJlcHXHMaP8MuqIEUqY9j5MAm5nnMQ53GkJyFeoQ1dkhTo0AEFIO7JXp1MPl08JCRPL&usqp=CAE",
//       link: "https://www.google.com/url?url=https://www.apollopharmacy.in/medicine/dozolamide-t-eye-drops-5ml%3Fsrsltid%3DAfmBOooIAxzjx-hlixNfei2scng_NpPmCFLhHz-s1meiwVYEYtcuft0LFgc&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwjCnJCo47KLAxXydmwGHZdUM-oQ1SkIpAYoAA&usg=AOvVaw3LG8iMlNPm9NatPCWnUTis",
//       price: 209.7,
//       title: "Dozolamide T Eye Drops 5 ml",
//     },
//     {
//       image:
//         "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQOTNFlaD9XT05vyxV3sHnbMPE-VWLxLnG33yDV9xHkeshhNSZcBNISEfJlcHXHMaP8MuqIEUqY9j5MAm5nnMQ53GkJyFeoQ1dkhTo0AEFIO7JXp1MPl08JCRPL&usqp=CAE",
//       link: "https://www.google.com/url?url=https://www.apollopharmacy.in/medicine/dozolamide-t-eye-drops-5ml%3Fsrsltid%3DAfmBOooIAxzjx-hlixNfei2scng_NpPmCFLhHz-s1meiwVYEYtcuft0LFgc&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwjCnJCo47KLAxXydmwGHZdUM-oQ1SkIpAYoAA&usg=AOvVaw3LG8iMlNPm9NatPCWnUTis",
//       price: 209.7,
//       title: "Dozolamide T Eye Drops 5 ml",
//     },
//     {
//       image: "No image found",
//       link: "https://www.google.com/url?url=https://www.apollopharmacy.in/medicine/dozolamide-t-eye-drops-5ml%3Fsrsltid%3DAfmBOooIAxzjx-hlixNfei2scng_NpPmCFLhHz-s1meiwVYEYtcuft0LFgc&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwjCnJCo47KLAxXydmwGHZdUM-oQgOUECKkG&usg=AOvVaw30opaaDDV4Rr5G9iolfkGe",
//       price: 209.7,
//       title: "No title found",
//     },
//     {
//       image:
//         "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRtJrApdA5NMNkD0JOBvHFQFKGpKnz98UR508dcrFxDpCG2ZeRQhi5sCbY1yZOtEs_tQptsToo4oILI9koVfbUC-SdsqaXeIw&usqp=CAE",
//       link: "https://www.google.com/url?url=https://www.dawaadost.com/medicine/dorz-eye-drop-5ml%3Fsrsltid%3DAfmBOopQnMNYZQ_uM8P29mQeXvqTNPxPHqh0Eldvm3mXFzk0fiSWHfq2sLI&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwjCnJCo47KLAxXydmwGHZdUM-oQ1SkIswYoAA&usg=AOvVaw2PboVQ492gHNsgy9jE_18o",
//       price: 404,
//       title: "Dorz Eye Drop 5ml",
//     },
//     {
//       image:
//         "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRtJrApdA5NMNkD0JOBvHFQFKGpKnz98UR508dcrFxDpCG2ZeRQhi5sCbY1yZOtEs_tQptsToo4oILI9koVfbUC-SdsqaXeIw&usqp=CAE",
//       link: "https://www.google.com/url?url=https://www.dawaadost.com/medicine/dorz-eye-drop-5ml%3Fsrsltid%3DAfmBOopQnMNYZQ_uM8P29mQeXvqTNPxPHqh0Eldvm3mXFzk0fiSWHfq2sLI&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwjCnJCo47KLAxXydmwGHZdUM-oQ1SkIswYoAA&usg=AOvVaw2PboVQ492gHNsgy9jE_18o",
//       price: 404,
//       title: "Dorz Eye Drop 5ml",
//     },
//     {
//       image: "No image found",
//       link: "https://www.google.com/url?url=https://www.dawaadost.com/medicine/dorz-eye-drop-5ml%3Fsrsltid%3DAfmBOopQnMNYZQ_uM8P29mQeXvqTNPxPHqh0Eldvm3mXFzk0fiSWHfq2sLI&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwjCnJCo47KLAxXydmwGHZdUM-oQgOUECLgG&usg=AOvVaw1XgXRE7bUb0AGd5hM9zPyu",
//       price: 404,
//       title: "No title found",
//     },
//   ],
// };
const demoLocationdata = {
  location: [
    {
      address:
        "X92P+R89, Adisaptagram Station Rd, Barakhejuria, Adisaptagram, Bansberia, Mithapukur More, West Bengal 712502, India",
      gps_coordinates: {
        latitude: 22.952047699999998,
        longitude: 88.3858724,
      },
      hours: null,
      open_state: null,
      operating_hours: {},
      phone: "+91 98310 42015",
      photos_link:
        "https://serpapi.com/search.json?data_id=0x39f893738d54a0bf%3A0xd37abcf49ed7a39d&engine=google_maps_photos&hl=en",
      thumbnail:
        "//lh4.googleusercontent.com/XuNv7pZGZ9fUaxN4iChneoyr1eRjygPcFVRcCuSsz1wrDHy5SWVd_GKIa_2HYDUiAw=w163-h92-k-no",
      title: "Pal Pharmacy Medical Store",
      url: "https://www.google.com/maps/place/22.952047699999998,88.3858724",
      website: null,
    },
    {
      address: "Bandel Bazar St, Bandel, Kodalia, West Bengal 712103, India",
      gps_coordinates: {
        latitude: 22.919183699999998,
        longitude: 88.3760969,
      },
      hours: "Open ⋅ Closes 11 PM",
      open_state: "Open ⋅ Closes 11 PM",
      operating_hours: {
        friday: "6 AM–11 PM",
        monday: "6 AM–11 PM",
        saturday: "6 AM–11 PM",
        sunday: "6 AM–11 PM",
        thursday: "Closed",
        tuesday: "6 AM–11 PM",
        wednesday: "6 AM–11 PM",
      },
      phone: null,
      photos_link:
        "https://serpapi.com/search.json?data_id=0x39f893c0aa9c9793%3A0xb52272782470bb&engine=google_maps_photos&hl=en",
      thumbnail:
        "https://lh5.googleusercontent.com/p/AF1QipNKTeAgQmv5tEW2oxTPbJxFfJ95j5LsJ0TxmCv-=w80-h106-k-no",
      title: "M/s Medicine And Pathology Labs",
      url: "https://www.google.com/maps/place/22.919183699999998,88.3760969",
      website: null,
    },
    {
      address: "W9HR+78P, Sahaganj, Chinsurah, West Bengal 712104, India",
      gps_coordinates: {
        latitude: 22.928212,
        longitude: 88.39084319999999,
      },
      hours: null,
      open_state: null,
      operating_hours: {},
      phone: "+91 98306 09403",
      photos_link:
        "https://serpapi.com/search.json?data_id=0x39f89391f2f833f5%3A0x383417fc8a579f1d&engine=google_maps_photos&hl=en",
      thumbnail:
        "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=xfCs2kdrR-pkOkpvMbgYtQ&cb_client=search.gws-prod.gps&w=80&h=92&yaw=109.3214&pitch=0&thumbfov=100",
      title: "Abahan Pharmacy",
      url: "https://www.google.com/maps/place/22.928212,88.39084319999999",
      website: null,
    },
    {
      address:
        "Public Library, R.B, Nandan Road, near Bansberia, Bansberia, Chinsurah, West Bengal 712502, India",
      gps_coordinates: {
        latitude: 22.9586467,
        longitude: 88.40502939999999,
      },
      hours: "Closed ⋅ Opens 7 AM",
      open_state: "Closed ⋅ Opens 7 AM",
      operating_hours: {
        friday: "7 AM–2 PM, 4–11 PM",
        monday: "7 AM–2 PM, 4–11 PM",
        saturday: "7 AM–2 PM, 4–11 PM",
        sunday: "7 AM–2 PM, 4–11 PM",
        thursday: "Closed",
        tuesday: "7 AM–2 PM, 4–11 PM",
        wednesday: "7 AM–2 PM, 4–11 PM",
      },
      phone: "+91 33 2634 5615",
      photos_link:
        "https://serpapi.com/search.json?data_id=0x39f8949cc5e0a469%3A0xdfb4fdf58c06f0e7&engine=google_maps_photos&hl=en",
      thumbnail:
        "//lh6.googleusercontent.com/1FHe3_eV07m7v8YhKjK-Eh1-qAJN-dRLtVuXizVOB2yYWNmN3FGG6QjLgXRxPLY=w163-h92-k-no",
      title: "Maya Medical",
      url: "https://www.google.com/maps/place/22.9586467,88.40502939999999",
      website: null,
    },
    {
      address:
        "Keota, Main Road, Latbagan, Sahaganj, Bandel, West Bengal 712104, India",
      gps_coordinates: {
        latitude: 22.9260324,
        longitude: 88.3970252,
      },
      hours: "Closed ⋅ Opens 8 AM",
      open_state: "Closed ⋅ Opens 8 AM",
      operating_hours: {
        friday: "8 AM–11 PM",
        monday: "Closed",
        saturday: "8 AM–11 PM",
        sunday: "8 AM–11 PM",
        thursday: "8 AM–11 PM",
        tuesday: "8 AM–11 PM",
        wednesday: "8 AM–11 PM",
      },
      phone: "+91 85850 18540",
      photos_link:
        "https://serpapi.com/search.json?data_id=0x39f8938b8ba5244f%3A0x804efa0bb29361e2&engine=google_maps_photos&hl=en",
      thumbnail:
        "https://lh5.googleusercontent.com/p/AF1QipNdtz8PPivuSKMtalBRkMkLHhnBbNtG2hC7xZWn=w163-h92-k-no",
      title: "Getwell Pharmacy",
      url: "https://www.google.com/maps/place/22.9260324,88.3970252",
      website: null,
    },
  ],
};

const Result = () => {
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [linkErrorMessage, setLinkErrorMessage] = useState("");
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const location = useLocation();
  const [usageDropdown, setUsageDropdown] = useState(false);
  const [showGenericName, setShowGenericName] = useState(false);
  const [genericMedicineName, setGenericMedicineName] = useState("");

  const [medicineData, setMedicineData] = useState<any>({});
  const { data } = location.state || {};

  // Track which medicine's dropdown is open
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  // Default location: @22.958723,88.3777435 -> Adisaptagram
  const [geoLocation, setGeoLocation] = useState({
    latitude: 22.958723,
    longitude: 88.3777435,
  });

  useEffect(() => {
    setMedicineData(data);
  }, [data]);



  const demoData = {
    "detail": {
      "active_ingredient": "Active ingredient Paracetamol 160 mg",
      "definition": [
        "L-Oral PARACETAMOL Syrup Paracetamol METHYLPARABEN PROPYLPARABEN POTASSIUM SORBATE CITRIC ACID MONOHYDRATE SORBITOL PROPYLENE GLYCOL SUCRALOSE POVIDONE K30 GLYCERIN FD&C RED NO. 40 D&C RED NO. 33 WATER ACETAMINOPHEN ACETAMINOPHEN"
      ],
      "medicine_name": "paracetamol",
      "side_effects": "Not Available",
      "usage": "USES Temporarily relieves minor aches and pains due to: • The common cold • Flu • Headache • Sore throat • Toothache • Temporarily reduces fever",
      "warnings": "WARNINGS Liver warning: This product contains acetaminophen. Severe liver damage may occur if your child takes: • More than 5 doses in 24 hours, which is the maximum daily amount • With other drugs containing acetaminophen Allergy alert: acetaminophen may cause severe skin reactions. Symptoms may include: • Skin reddening • Blisters • Rash If a skin reaction occurs, stop use and seek medical help right away. Sore throat warning: If sore throat is severe, persists for more than 2 days, is accompanied or followed by fever, headache, rash, nausea, or vomiting, consult a doctor promptly. Do not use • With any other product containing acetaminophen (prescription or nonprescription). If you are not sure whether a drug contains acetaminophen, ask a doctor or pharmacist • If your child is allergic to acetaminophen or any of the inactive ingredients in this product Ask a doctor before use if your child has liver disease Ask a doctor or pharmacist before use if your child is taking the blood thinning drug warfarin When using this product, do not exceed recommended dose (see overdose warning) Stop use and ask a doctor if • Pain gets worse or last for more than 5 days • Fever gets worse or last for more than 3 days • New symptoms occur • Redness or swelling is present These could be signs of a serious condition. Keep out of the reach of children. Overdose warning: Taking more than the recommended dose (overdose) may cause liver damage. In case of overdose, get medical help or contact a Poison Control Center (1-800-222-1222) right away. Quick medical attention is critical for adults as well as children even if you do not notice any signs or symptoms."
    }
  }
  const handleUsage = async (e: any) => {
    const medName = e.currentTarget.name; // Medicine name
    const medIndex = Number(e.target.id); // Index of the medicine

    if (!usageDropdown) {
      setLoadingId(medName); // Set loading for this medicine
      setErrorMessage((prev) => ({ ...prev, [medName]: "" })); // Reset error

      try {
        setUsageDropdown(true);
        const usageData = await fetchMedicineDetails(medName);
        setLoadingId(null); // Remove loading state
        console.log("Usage details: ", usageData);

        // Update medicine data with the fetched usage
        setMedicineData((prevData: any) => {
          const updatedMedicines = [...prevData.medicines];
          updatedMedicines[medIndex] = {
            ...updatedMedicines[medIndex],
            usage: usageData.usage, // Add usage info
          };
          return {
            ...prevData,
            medicines: updatedMedicines,
          };
        });
      } catch (err) {
        console.error("Medicine usage cannot be fetched: ", err);
        setErrorMessage((prev) => ({
          ...prev,
          [medName]: "Medicine usage could not be fetched!",
        }));
        setLoadingId(null);
      }
    } else {
      setUsageDropdown(false);
    }
  };


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
        setMedicineData((prevData: any) => {
          const updatedMedicines = [...prevData.medicines]; // Create a new array
          updatedMedicines[e.target.id] = {
            ...updatedMedicines[e.target.id], // Copy existing medicine data
            websites: linkData.medicines, // Update only websites
          };
          return {
            ...prevData,
            medicines: updatedMedicines,
          };
        });

        console.log(linkData.medicines);
      } catch (err) {
        console.error("Medicine links cannot be fetched: ", err);
        setLinkErrorMessage("Medicine links could not be fetched!");
        setIsLoadingLinks(false);
      }
    }
  };

  const handleLocationLinks = async () => {
    try {
      setIsLoadingLocations(true);
      const locations = await get_location(geoLocation);
      console.log(locations);
      setNearbyLocations(locations.location);
      setIsLoadingLocations(false);
    } catch (err) {
      console.error("Error while fetching locations: ", err);
      setLocationErrorMessage("Nearby medical shops could not be fetched!");
      setIsLoadingLocations(false);
    }
  };

  const handleGenericNameSearch = (e: any) => {
    setShowGenericName(true);
    setGenericMedicineName(e.target.name);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  if (Object.keys(medicineData).length === 0)
    return (
      <div className="text-2xl font-red-500 font-bold text-center">
        There was a problem, please try again!
      </div>
    );
  else if(showGenericName) return <GenericName medicineName={genericMedicineName} setShowGenericName={setShowGenericName} />
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
      <span className="bg-white p-4 rounded-xl shadow-md text-gray-800 text-center font-bold text-3xl">
        Results
      </span>

      <div className="bg-white p-4 rounded-xl shadow-md text-gray-800 text-center font-medium">
        <strong className="underline underline-offset-2">
          General Instructions{" "}
        </strong>
        : {medicineData.general_instructions}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {medicineData.medicines.map((medicine: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-green-700">
              {medicine.name}
            </h2>
            <p className="text-gray-700">
              <strong>Dosage:</strong> {medicine.dosage}
            </p>
            <p className="text-gray-700">
              <strong>Frequency:</strong> {medicine.frequency}
            </p>
            <p className="text-gray-700">
              <strong>Route:</strong> {medicine.route}
            </p>
            <p className="text-gray-700">
              <strong>Instructions:</strong> {medicine.special_instructions}
            </p>

            {/* Dropdown Button */}
            <button
              onClick={(e) => handleMedicineLinks(e)}
              id={index.toString()}
              name={medicine.name}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              {openDropdown === index ? "Hide Links" : "Show Links"}
            </button>

            {/* Dropdown List */}
            {openDropdown === index && linkErrorMessage !== "" ? (
              <div className="my-4 text-red-500">{linkErrorMessage}</div>
            ) : (
              ""
            )}
            {openDropdown === index && (
              <div className="mt-3 border rounded-lg shadow-md bg-white p-4">
                {medicine.websites.length > 0 ? (
                  <ul className="space-y-3">
                    {medicine.websites.map((website: any, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <img
                          src={
                            website.image || "https://via.placeholder.com/50"
                          }
                          alt={website.title || "No Image"}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div className="flex-1 ml-4">
                          <p className="text-gray-900 font-semibold">
                            {website.title || "Unknown Product"}
                          </p>
                          <p className="text-green-700 font-bold">
                            Rs.{website.price}
                          </p>
                        </div>
                        <a
                          href={website.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition text-sm"
                        >
                          Buy Now
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    {isLoadingLinks ? (
                      <div className="flex flex-col justify-center items-center text-center">
                        <InfinitySpin width="200" color="#4fa94d" />
                        Loading...
                      </div>
                    ) : (
                      <p>No Links Are Found</p>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Usage Button */}
            <button
              className="px-4 py-2 ml-5 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
              name={medicine.name}
              id={index.toString()}
              onClick={handleUsage}
              disabled={loadingId === medicine.name}
            >
              {loadingId === medicine.name ? "Loading..." : "Usage"}
            </button>

            {usageDropdown && medicine.usage && (
              <div className="bg-white p-5 rounded-2xl shadow-lg text-gray-900 text-center font-medium mt-4 border border-gray-200">
                <strong className="text-blue-500 text-lg underline decoration-dotted">
                  Medicine Usage
                </strong>
                <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                  {medicine.usage}
                </p>
              </div>
            )}

            {/* /* 🔴 Error Message */}
            {errorMessage[medicine.name] && (
              <div className="mt-2 text-red-600 bg-red-100 border border-red-400 px-3 py-2 rounded-lg text-sm">
                {errorMessage[medicine.name]}
              </div>
            )}
            <button className="" name={medicine.name} onClick={handleGenericNameSearch}>Generic name search</button>
          </div>
        ))}
      </div>
      <div className="fixed bottom-20 right-10 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition">
        <Link to="/chatAI">
          <MessageCircle size={30} />
        </Link>
      </div>
      {/* Find nearby locations */}
      <button
        className="mt-6 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition self-center"
        onClick={handleLocationLinks}
      >
        Find medical shops near you
      </button>
      {locationErrorMessage !== "" && nearbyLocations.length === 0 ? (
        <div className="text-center text-red-500">{locationErrorMessage}</div>
      ) : (
        ""
      )}
      {isLoadingLocations ? (
        <div className="flex flex-col justify-center items-center text-center">
          <InfinitySpin width="200" color="#4fa94d" />
          Loading...
        </div>
      ) : (
        nearbyLocations.length !== 0 && (
          <div className="grid grid-cols-1 gap-6 p-6">
            <h2 className="text-center text-xl font-bold text-green-700">
              Nearby Locations
            </h2>
            {nearbyLocations.map((loc: any, idx) => (
              <div
                className="flex justify-between bg-white shadow-lg rounded-xl  p-6 items-center gap-4 w-full"
                key={idx}
              >
                <img
                  src={loc.thumbnail}
                  alt="Thumbnail"
                  className="h-20 w-20 rounded-xl "
                />
                <div>
                  <div className="font-semibold text-md">{loc.title}</div>
                  <div className="text-sm text-gray-400">{loc.address}</div>
                  <div className="text-sm">
                    <strong>Phone No</strong>: {loc.phone}
                  </div>
                </div>
                <a
                  className="bg-green-600 p-3 text-white rounded-lg"
                  href={loc.url}
                >
                  <MapPin />
                </a>
              </div>
            ))}
          </div>
        )
      )}
      {/* Download PDF Button */}
      <PDFDownloadLink
        document={<PrescriptionPDF data={data} />}
        fileName="prescription.pdf"
        className="mt-6 px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition self-center mb-20"
      >
        {({ loading }) => (loading ? "Generating PDF..." : "Download as PDF")}
      </PDFDownloadLink>

      <footer className="bg-white p-4 rounded-xl shadow-md text-gray-800 text-center font-medium mt-auto mb-20">
        <p>Hope you get well soon! 😊</p>
      </footer>
    </div>
  );
};

export default Result;
