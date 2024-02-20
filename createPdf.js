import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createPdf(title, description, data) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();

    // Set up fonts and text size
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const pageHeight = page.getHeight();

    // Helper function to create a new page and reset yOffset
    const addNewPage = () => {
        page = pdfDoc.addPage();
        yOffset = pageHeight - 50; // Reset yOffset for new page
    };

    // Draw title
    let yOffset = pageHeight - 50;
    page.drawText(title, {
        x: 50,
        y: yOffset,
        size: fontSize + 4,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    yOffset -= 50; // Move down the yOffset

    // Draw description
    page.drawText(description, {
        x: 50,
        y: yOffset,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    yOffset -= 50; // Move down the yOffset

    // Draw data with indexing
    let index = 1;
    for (let i = 0; i < data.length; i++) {
        const { amenitieType, res } = data[i];

        // Check if there is enough space on the current page
        if (yOffset < 50) {
            addNewPage(); // Add new page if there isn't enough space
        }

        // Draw index
        page.drawText(`${index}.`, {
            x: 50,
            y: yOffset,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });

        // Draw amenity type
        page.drawText(`${amenitieType}:`, {
            x: 70,
            y: yOffset,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });

        // Draw res values
        res.forEach((item) => {
            yOffset -= fontSize + 2; // Adjust yOffset for the next item

            // Check if there is enough space for the next item
            if (yOffset < 50) {
                addNewPage(); // Add new page if there isn't enough space
            }

            page.drawText(`- ${item}`, {
                x: 90,
                y: yOffset,
                size: fontSize,
                font: helveticaFont,
                color: rgb(0, 0, 0),
            });
        });

        index++;
        yOffset -= 10; // Add some space between amenity types
    }

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    // Save the PDF to a file or return it as needed
    return pdfBytes;
}

export default createPdf;
