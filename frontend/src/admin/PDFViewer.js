import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 
function PDFViewer() {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }){
    setNumPages(numPages);
  }

  return (
    <div className='pdf-div'>
      <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null,Array(numPages)).map((x,i)=>i+1).map(page=>{return(
            <Page pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} />
        )
            
        })}
        
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
export default PDFViewer;