import WindowsControls from '#components/WindowsControls'
import WindowWrapper from '#hoc/WindowWrapper'
import { Download } from 'lucide-react'
import React from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import resume from "../assets/resume.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

/* function to download */
function downloadPDF() {
  const link = document.createElement("a");
  link.href = "files/resume.pdf";
  link.download = "Zeeshan_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function Resume() {
  return (
    <>
      <div id="window-header">
        <WindowsControls target="resume" />
        <h2>Resume.pdf</h2>

        {/* <a
          href="/files/resumez.pdf"
          
          className="cursor-pointer"
          title="Download Resume"
        > */}
        {/* <iframe src="files/resume.pdf" width="100%" height="800px" /> */}

        <button onClick={downloadPDF}><Download className="icon" /></button>
        {/* </a> */}
      </div>

      <Document file={resume}>
        <Page pageNumber={1}/>
      </Document>
    </>
  )
}

const ResumeWindow = WindowWrapper({
  Component: Resume,
  windowKey: "resume",
})

export default ResumeWindow
