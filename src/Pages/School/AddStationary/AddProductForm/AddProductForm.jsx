import React, { useState } from "react";
//import dltbtn from "../../../../Components/Images/DangerButton.png"
//import media from "../../../../Components/Images/Media.png"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AddProductForm = () => {
  const navigate = useNavigate();

  

    const [productName, setProductName] = useState("");
      const [description, setDescription] = useState("");
      const [productDetail, setProductDetail] = useState("");
      const [SKU, setSKU] = useState("");
      const [images, setImages] = useState([null, null, null]);
      const [selectedIndex, setSelectedIndex] = useState(null);
      const [error, setError] = useState("");
      const [row, setRow] = useState([
        { stockQty: "", price: "" },
      ]);

      const token = localStorage.getItem("schoolToken");

      const handleImageChange = (e, index) => {
        if (!e.target.files || e.target.files.length === 0) return;
    
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
          setImages((prevImages) => {
            const newImages = [...prevImages];
            newImages[index] = { file, previewURL: reader.result };
    
            if (selectedIndex === null) setSelectedIndex(index);
            return newImages;
          });
        };
    
        reader.readAsDataURL(file);
      };

      const handleRemoveImage = (index) => {
        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = null;
    
    
          if (selectedIndex === index) {
            const firstAvailable = newImages.findIndex((img) => img !== null);
            setSelectedIndex(firstAvailable !== -1 ? firstAvailable : null);
          }
    
          return newImages;
        });
      };

      const handleCancel = () => {

        setProductName("");
        setProductDetail("");
        setDescription("");
        setSKU("");
        setImages([null, null, null]);
        setRow([
          {
            stockQty: "",
            price: "",
          }
        ])
        setError("");
      };
    

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !description || !SKU || !row.stockQty || !row.price) {
    toast.error("Please fill in all required fields!");
    return;
  }

  const stationaryDetails = {
    stockQty: Number(row.stockQty),  
    price: Number(row.price),  
  };
   
  console.log("Sending Data:", stationaryDetails);

    


    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("category", "Stationary");
    formData.append("productDetail", productDetail);
    formData.append("SKU", SKU);
    formData.append("stationaryDetails", JSON.stringify(stationaryDetails));


    images.forEach((imageObj) => {
      if (imageObj?.file) {
        console.log("Appending file:", imageObj.file);
        formData.append("image", imageObj.file);
      }
    });

   
    console.log("Form Data:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await axios.post("https://e-commerce-backend-phi-five.vercel.app/api/product/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",

        },
        withCredentials: true,
      });

      console.log("Backend Response:", response.data); 

      if (response.status >= 200 && response.status < 300) {

        const uploadedImages = response.data?.image || []; 

        console.log("Uploaded Images from Backend:", uploadedImages); 

        const updatedProductData = {
          name: productName,
          description,
          category: "Stationary",
          productDetail,
          SKU,
          stationaryDetails: stationaryDetails,
          image: uploadedImages, 
        };

        console.log("Final Product Data Before Navigation:", updatedProductData); 


        toast.success("Product added successfully!", {
          position: "top-right",
          autoClose: 3000,
          className: "bg-green-500 text-white font-semibold p-4 rounded-md shadow-md",
          bodyClassName: "text-sm",
          progressClassName: "bg-green-700",
          onClose: () => navigate("/ProdReview", { state: { productData: updatedProductData }}),
    
        });
       

       setTimeout(() => navigate("/ProdReview", { state: { productData: updatedProductData }}), 2000);

      
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error("Error submitting form!");
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
      <div className="bg-gray-100 p-6 ">
      
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
                <div className=" h-[286px] border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center">
                  {selectedIndex !== null && images[selectedIndex] ? (<img
                    src={images[selectedIndex].previewURL}
                    alt="Placeholder for main product image"
                    className="mb-4 w-[120px] h-[120px] object-cover"
                  />) : (

                    <p className="text-gray-500 mb-4">
                      Drag and drop image here, or click add image
                    </p>


                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, images.findIndex((img) => img === null))}
                    className="hidden"
                    id="main-upload"
                  />
                  <label
                    htmlFor="main-upload"
                    className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Add Media
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`border-2 p-4 rounded-lg flex items-center justify-center relative ${selectedIndex === index ? "border-orange-400" : "border-dashed border-gray-300"
                        }`}
                      onClick={() => img && setSelectedIndex(index)}
                    >
                      {img ? (
                        <>
                          <img src={img.previewURL} alt={`Additional image ${index + 1}`} width="50" height="50" />
                          <button
                            className="absolute top-1 right-1 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <label className="text-gray-500 cursor-pointer">
                          Add Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            <div className="col-span-1 grid grid-cols-1 gap-4">
              <div>Cataegory : Stationary</div>
              <div>
                <label className="block text-gray-700">Product Name</label>
                <input
                  type="text"
                  value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  placeholder="Type product name here..."
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Product Description</label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type product description here..."
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700">Product Detail</label>
                <textarea
                  value={productDetail}
                  onChange={(e) => setProductDetail(e.target.value)}
                  placeholder="Enter Length, width, details, usage etc"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                ></textarea>
              </div>
              <div className="grid grid-cols-1">

                <div>
                  <label className="block text-gray-700">SKU</label>
                  <input
                    type="text"
                    value={SKU}
                      onChange={(e) => setSKU(e.target.value)}
                    placeholder="Type product SKU here..."
                    className="w-full border border-gray-300 p-2 rounded mt-1"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Product Info and variants</h2>



          <div className="flex items-center space-x-4 mb-4">
           
            <div className="flex-1">
              <label
                htmlFor="stockQty"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Qty
              </label>
              <select
                id="stockQty"
                value={row.stockQty}
                onChange={(e) =>
                  setRow({ ...row, stockQty: Number(e.target.value) })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select…</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>

            
            <div className="flex-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (in Rs)
              </label>
              <input
                type="text"
                id="price"
                value={row.price}
                onChange={(e) =>
                  setRow({ ...row, price: Number(e.target.value) })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Price"
              />
            </div>


          </div>

        </div>
      </div>



      <div className="bg-gray-100 p-6">
        

        <div className="flex justify-end space-x-2 mt-4  max-w-4xl mx-auto mb-3">
          <button
          type="button"
          onClick={handleCancel}
           className="bg-black text-white px-3 py-1 rounded-lg">
            Cancel
          </button>
          <button type="submit"  className="bg-orange-500 text-white px-3 py-1 rounded-lg"
          
          >
            Done
          </button>
          <ToastContainer />
        </div>
      </div>
      </form>

    </>

  );
};

export default AddProductForm;
