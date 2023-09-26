export class AptTecExporter {
    #defaultPDFOptions = {
        format: 'ledger',
        orientation: 'landscape',
        unit: 'mm',
        putOnlyUsedFonts: true,
        floatPrecision: 16 // or "smart", default is 16
    };

    getPdfOptions(reportParams)
    {
        const newOptions = this.#defaultPDFOptions;
        newOptions.format = reportParams.Layout.PaperSize.toLowerCase();
        newOptions.orientation = reportParams.Layout.PaperLayout.toLowerCase();
        return newOptions;
    }

    generatePDF(sourceWindow, contentSelector, pdfOptions)
    {
        pdfOptions = (pdfOptions) ? pdfOptions : this.#defaultPDFOptions;
        const pdfDocumnet = new window.jspdf.jsPDF(pdfOptions);

        const pagesCount = sourceWindow.$(contentSelector).length;

        const deferreds = []; 
        for (let i = 0; i < pagesCount; i++)
        {
            if (i > 0)
                pdfDocumnet.addPage();
            var deferred = $.Deferred();
            deferreds.push(deferred.promise());
            this.generateCanvas(sourceWindow, pdfDocumnet, i+1, deferred);
        }

        $.when.apply($, deferreds).then(function ()
        { // executes after adding all images
            //pdfDocumnet.save(fileName);
            window.open(pdfDocumnet.output('bloburl'), '_blank');
            //pdfWindow.print();
        });

        // const exportParent = document.querySelector(".exportedCanvas");
        // exportParent.innerHTML = '';
        // exportParent.appendChild(canvas);
        // ShowPopup('designerModal', 'Exported Image', '.exportedCanvas');
    }

    generateCanvas(sourceWindow, pdfDocumnet, pageIndex, deferred)
    {
        sourceWindow.scrollTo(0, 0);
        const element = sourceWindow.$(`.pagedjs_page[data-page-number='${pageIndex}'] > .pagedjs_sheet`)[0];
        const area = element.getBoundingClientRect();
        const canvasOptions = {
            allowTaint: true,
            dpi: 300,
            letterRendering: true,
            logging: false,
            scrollX: 0,
            scrollY: -sourceWindow.scrollY,
            scale :1,
            //scale: .8 https://stackoverflow.com/questions/16541676/what-are-best-practices-for-detecting-pixel-ratio-density
            width: area.width,
            height: area.height
        };
        window.html2canvas(element, canvasOptions)
            .then(canvas => {
                this.addCanvasToPDFPage(canvas, pdfDocumnet);
                deferred.resolve();
            });
    }
    addCanvasToPDFPage(canvas, pdfDocumnet) { 
        var img = canvas.toDataURL();
        pdfDocumnet.addImage(img, 'PNG', 0, 0);
    }
}