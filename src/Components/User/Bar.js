import React, { useState, useEffect, useContext } from 'react';
import { useWebSocket } from '../../Context/WebSocketContext';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";
import AccountContext from '../../Context/AccountContext';

function Bar() {
  const { getSession } = useContext(AccountContext);
  const { socket, receivedProducts } = useWebSocket();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#000000');
  const [fontStyle, setFontStyle] = useState({ bold: false, italic: false, underline: false });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  let author = '';
  let ownername = '';

  // Retrieve user session details
  getSession()
    .then(session => {
      author = session.sub;
      ownername = session.name;
    })
    .catch(err => console.log(err));

  // Log updates to received products
  useEffect(() => {
   // console.log('Received products updated:', receivedProducts);
   // receivedProducts.forEach(product => console.log(`Product added: ${product.name}`));
  }, [receivedProducts]);

  // Configure AWS S3 client
  const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  // Upload a file to S3
  const uploadFile = async (file) => {
    try {
      const params = {
        Bucket: 'hangoutdata',
        Key: `post/admin/${file.name}`,
        Body: file.fileObject,
        ContentType: file.type,
      };
      
      const uploader = new Upload({ client: s3Client, params });
      uploader.on("httpUploadProgress", progress => console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`));
      const response = await uploader.done();
      console.log("Upload successful:", response);
      return response;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  };

  // Handle text content change
  const handleContentChange = (e) => setContent(e.target.value);

  // Handle file selection and preview generation
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return console.error('No files selected');

    const readFiles = selectedFiles.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result, fileObject: file });
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    }));

    Promise.all(readFiles)
      .then(fileData => {
        setFiles(prevFiles => [...prevFiles, ...fileData]);
        setPreviews(prevPreviews => [...prevPreviews, ...fileData.map(file => file.data)]);
      })
      .catch(error => console.error('File reading failed', error));
  };

  // Remove file preview
  const handleRemovePreview = (index) => {
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Trigger file input
  const handleFileUpload = () => document.getElementById('file-upload').click();

  // Submit files to S3
  const handleFileSubmit = async () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      for (const file of files) await uploadFile(file);
    } else {
      console.error('WebSocket is not open.');
    }
  };

  // Toggle font styles
  const handleFontStyleChange = (style) => {
    setFontStyle(prevState => ({ ...prevState, [style]: !prevState[style] }));
  };

  // Handle product selection
  const handleProductSelect = (e) => {
    const product = receivedProducts.find(p => p.id == e.target.value);
    setSelectedProduct(product);
    console.log(product.name);
  };

  // Submit post content
  const handleSubmit = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const body = {
        action: 'addpost',
        content,
        fontFamily,
        fontStyle: JSON.stringify(fontStyle),
        fontColor,
        selectedProduct: selectedProduct ? JSON.stringify({
          name: selectedProduct.name || null,
          price: selectedProduct.price || null,
          description: selectedProduct.description || null,
          id: selectedProduct.id || null,
        }) : null,
        author,
        ownername,
        files: JSON.stringify(files.map(file => `https://hangoutdata.s3.us-east-1.amazonaws.com/post/admin/${file.name}`)),
      };

      console.log('Sending WebSocket message:', body);
      socket.send(JSON.stringify(body));
      handleFileSubmit().then(() => {
        setContent('');
        setFiles([]);
        setPreviews([]);
        setSelectedProduct(null);
        alert('Post submitted successfully!');
        window.location.reload();
      }).catch(error => {
        console.error('Error uploading files:', error);
        alert('Error submitting post. Please try again.');
      });
    } else {
      console.error('WebSocket is not open.');
    }
  };

  return (<div className="bar-container p-3 mb-4 border rounded shadow-sm">
  <div className="d-flex flex-column align-items-start w-100">
    {/* Textarea for user input */}
    <div className="mb-3 w-100">
      <textarea
        className="form-control"
        rows="2"
        placeholder="What are you thinking?"
        value={content}
        onChange={handleContentChange}
        style={{
          fontFamily: fontFamily,
          color: fontColor,
          fontWeight: fontStyle.bold ? 'bold' : 'normal',
          fontStyle: fontStyle.italic ? 'italic' : 'normal',
          textDecoration: fontStyle.underline ? 'underline' : 'none',
        }}
      />
    </div>

    {/* Compact Toolbar */}
    <div
      className="d-flex align-items-center w-100"
      style={{ gap: '5px', flexWrap: 'nowrap', overflowX: 'auto' }}
    >
      {/* Styling buttons */}
      <button
        className={`btn ${fontStyle.bold ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => handleFontStyleChange('bold')}
        style={{ padding: '5px 8px' }}
      >
        B
      </button>
      <button
        className={`btn ${fontStyle.italic ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => handleFontStyleChange('italic')}
        style={{ padding: '5px 8px' }}
      >
        I
      </button>
      <button
        className={`btn ${fontStyle.underline ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => handleFontStyleChange('underline')}
        style={{ padding: '5px 8px' }}
      >
        U
      </button>

      {/* Font family dropdown */}
      <select
        className="form-select"
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        style={{
          width: '120px',
          padding: '5px',
          fontSize: '0.85rem',
          flexShrink: 0,
        }}
      >
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
      </select>

      {/* Font color */}
      <input
        type="color"
        className="form-control form-control-color"
        value={fontColor}
        onChange={(e) => setFontColor(e.target.value)}
        title="Choose text color"
        style={{
          width: '30px',
          height: '30px',
          padding: '0',
          border: '1px solid #ccc',
        }}
      />

      {/* Add Image or Video */}
      <button
        className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
        onClick={handleFileUpload}
        style={{ width: '30px', height: '30px', padding: '5px' }}
      >
        <i className="fas fa-image"></i>
      </button>
      <input
        type="file"
        className="d-none"
        id="file-upload"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
      />

      {/* Select Product */}
      <button
        className="btn btn-outline-primary d-flex align-items-center justify-content-center"
        onClick={() => setShowProductSelector(!showProductSelector)}
        style={{ width: '30px', height: '30px', padding: '5px' }}
      >
        <i className="fas fa-dollar-sign"></i>
      </button>

      {/* Post Button - Positioned beside dollar sign button */}
      <button
        className="btn btn-primary ms-auto"
        onClick={handleSubmit}
        style={{ padding: '5px 10px' }}
      >
        Post
      </button>
    </div>
  </div>

  {/* Previews */}
  {previews.length > 0 && (
    <div className="mt-3">
      <h6>Previews:</h6>
      <div className="d-flex flex-wrap">
        {previews.map((preview, index) => (
          <div key={index} className="position-relative me-2 mb-2">
            <img
              src={preview}
              alt={`File preview ${index + 1}`}
              className="me-2 mb-2"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            {/* "X" Button for removing preview */}
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0"
              style={{
                width: '20px',
                height: '20px',
                padding: '0',
                fontSize: '12px',
                borderRadius: '50%',
                backgroundColor: 'red',
                color: 'white',
              }}
              onClick={() => handleRemovePreview(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Product Selector */}
  {showProductSelector && (
    <div className="mt-4 w-100">
      <h5>Select a Product</h5>
      <select
        className="form-select mb-3"
        onChange={handleProductSelect}
        defaultValue=""
      >
        <option value="" disabled>
          Choose a product
        </option>
        {receivedProducts.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.price}
          </option>
        ))}
      </select>

      {selectedProduct && (
        <div>
          <h6>Selected Product:</h6>
          <p>Name: {selectedProduct.name}</p>
          <p>Price: {selectedProduct.price}</p>
          <p>Description: {selectedProduct.description}</p>
        </div>
      )}
    </div>
  )}
</div>
  );
}

export default Bar;
