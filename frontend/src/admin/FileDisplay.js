import React from 'react';

const FileDisplay = ({ files }) => {
  return (
    <div>
      <h2>Files</h2>
      {files.map((file, index) => (
        <div key={index}>
          <p>File {index + 1}</p>
          <img src={file} alt={`File ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default FileDisplay;
