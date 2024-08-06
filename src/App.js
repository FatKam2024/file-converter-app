import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import './FileConverter.css';

const FileConverter = () => {
  const [file, setFile] = useState(null);
  const [convertedData, setConvertedData] = useState(null);
  const [error, setError] = useState(null);
  const [showHowToDraft, setShowHowToDraft] = useState(true);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setConvertedData(null);
    setError(null);
  };

  const convertToJSON = () => {
    if (!file) {
      setError('Please select a file to convert.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const lines = content.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const jsonData = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] ? values[index].trim() : '';
            return obj;
          }, {});
        });
        setConvertedData(JSON.stringify(jsonData, null, 2));
        setError(null);
      } catch (err) {
        setError('Error converting file. Please ensure it\'s a valid CSV or text file.');
      }
    };
    reader.readAsText(file);
  };

  const howToDraftContent = {
    excel: (
      <div>
        <h4>Excel Format:</h4>
        <ul>
          <li>Use the first row for column headers</li>
          <li>Each subsequent row is a data entry</li>
          <li>Each column represents a field or property</li>
          <li>Save as .xlsx or .xls file</li>
          <li>Example:
            <pre className="pre-block">
				Name    Age    City{'\n'}
				John    30     New York{'\n'}
				Jane    25     London
            </pre>
          </li>
        </ul>
      </div>
    ),
    csv: (
      <div>
        <h4>CSV Format:</h4>
        <ul>
          <li>First line should contain column headers</li>
          <li>Each line after is a data entry</li>
          <li>Values separated by commas</li>
          <li>Enclose fields with commas in double quotes</li>
          <li>Save as .csv file</li>
          <li>Example:
            <pre className="pre-block">
				Name,Age,City{'\n'}
				John,30,"New York, NY"{'\n'}
				Jane,25,London
            </pre>
          </li>
        </ul>
      </div>
    ),
    text: (
      <div>
        <h4>Text File Format:</h4>
        <ul>
          <li>Structure similar to CSV</li>
          <li>First line contains headers</li>
          <li>Each line is a data entry</li>
          <li>Values separated by commas</li>
          <li>Enclose fields with commas in double quotes</li>
          <li>Save as .txt file</li>
          <li>Example:
            <pre className="pre-block">
				Name,Age,City{'\n'}
				John,30,"New York, NY"{'\n'}
				Jane,25,London
            </pre>
          </li>
        </ul>
      </div>
    )
  };

  return (
    <div className="file-converter">
      <div className="card">
        <h1>File to JSON Converter</h1>
        <p>Convert your Excel, CSV, or text files to JSON format with ease.</p>

        <button className="button" onClick={() => setShowHowToDraft(!showHowToDraft)}>
          {showHowToDraft ? 'Hide' : 'Show'} How to Draft Your File
        </button>

        {showHowToDraft && (
          <div className="grid">
            {Object.entries(howToDraftContent).map(([key, content]) => (
              <div key={key} className="format-card">
                <h3>{key}</h3>
                {content}
              </div>
            ))}
          </div>
        )}

        <div className="file-upload">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv,.txt"
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Upload size={48} />
            <p>Click to upload or drag and drop</p>
            <p>Excel, CSV, or text file (MAX. 10MB)</p>
          </label>
        </div>

        <button className="button convert-button" onClick={convertToJSON} disabled={!file}>
          Convert to JSON
        </button>

        {error && (
          <div className="error">{error}</div>
        )}

        {convertedData && (
          <div>
            <h3>Converted JSON:</h3>
            <pre className="pre-block">
              <code>{convertedData}</code>
            </pre>
            <button className="button download-button">
              Download JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileConverter;