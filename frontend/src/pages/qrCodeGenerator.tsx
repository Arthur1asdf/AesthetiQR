import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

const QRCodeGenerator: React.FC = () => {
  const [url, setUrl] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const qrRef = useRef<any>(null);
  const qrCode = useRef(new QRCodeStyling({
	width: 300,
	height: 300,
	dotsOptions: { color: "#000", type: "rounded" },
	backgroundOptions: { color: "#fff" },
	imageOptions: { crossOrigin: "anonymous", margin: 5 },
  }));

  useEffect(() => {
	if (qrRef.current) {
	  qrCode.current.append(qrRef.current);
	}
  }, []);

  const generateQR = () => {
	qrCode.current.update({
	  data: url,
	  image: image || undefined,
	});
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
	if (event.target.files && event.target.files[0]) {
	  const reader = new FileReader();
	  reader.onload = (e) => setImage(e.target?.result as string);
	  reader.readAsDataURL(event.target.files[0]);
	}
  };

  return (
	<div className="flex flex-col items-center p-5">
	  <input
		type="text"
		placeholder="Enter URL"
		value={url}
		onChange={(e) => setUrl(e.target.value)}
		className="p-2 border rounded w-80"
	  />
	  <input type="file" onChange={handleImageUpload} className="mt-3" />
	  <button onClick={generateQR} className="bg-blue-500 text-white p-2 rounded mt-3">
		Generate QR Code
	  </button>
	  <div ref={qrRef} className="mt-5"></div>
	</div>
  );
};

export default QRCodeGenerator;
