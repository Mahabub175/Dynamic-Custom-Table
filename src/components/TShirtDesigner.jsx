import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";

const TShirtDesigner = () => {
  const [logo, setLogo] = useState(null);
  const designRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Utility function to combine refs
  const setCombinedRefs = (el) => {
    designRef.current = el;
    dropZoneRef.current = el;
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (designRef.current) {
      const canvas = await html2canvas(designRef.current, { useCORS: true });
      const link = document.createElement("a");
      link.download = "tshirt-design.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = "#4CAF50"; // Highlight border
    }
  };

  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = "#e5e7eb"; // Reset border
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = "#e5e7eb"; // Reset border
    }
    handleLogoUpload(e);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 space-y-4 bg-gray-100">
      <h1 className="text-2xl font-bold">T-Shirt Designer</h1>

      <div className="flex flex-col lg:flex-row items-center space-y-4 gap-10 relative">
        {/* T-Shirt Design Section */}
        <div
          ref={setCombinedRefs}
          className="relative w-72 h-96 bg-white shadow-xl rounded overflow-hidden border border-gray-300"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img
            src="/shirt.jpg"
            alt="T-Shirt"
            className="w-full h-full object-cover"
          />
          {logo && (
            <Rnd
              bounds="parent"
              default={{
                x: 50,
                y: 50,
                width: 100,
                height: 100,
              }}
              lockAspectRatio
              className="absolute cursor-move"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </Rnd>
          )}

          {/* Dropzone Overlay */}
          {!logo && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 border-2 border-dashed border-gray-300 text-gray-500">
              Drag and Drop Logo Here
            </div>
          )}
        </div>

        {/* Upload and Download Buttons */}
        <div className="flex flex-col gap-4">
          <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 text-center">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
          >
            Download Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default TShirtDesigner;
