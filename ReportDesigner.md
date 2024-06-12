# Report designer

The report designer allows the user to fully customize the report.

## Layout section

This helps to setup the printable portion of the paper.

* Page size - pre-configured page sizes. "A3", "A4", "A5", "B4", "B5", "Letter", "Legal", "Ledger"
  Identify the dimensions from wiki. [Paper size - Wikipedia](https://en.wikipedia.org/wiki/Paper_size)
* Page layout - portrait, landscape
* Margins in millimeters - Top, Left, Right, and Bottom
* Page header- users can configure HTML content that appears at the **top of every page** using the WYSIWYG editor
* Page footer- users can configure HTML content that appears at the **bottom of every page** using the WYSIWYG editor
* Report header - users can configure HTML content that appears at the **top of the report** using the WYSIWYG editor
* Report footer - users can configure HTML content that appears at the **bottom of the report** using the WYSIWYG editor

![Alt text](./diagrams/LayoutDesigner.drawio.svg?raw=true&sanitize=true "Layout Designer")

## Table Designer

Refer: [How To Create Template section](HowToTemplate.md) to understand the 'Table Designer'

![Alt text](./diagrams/TableDesigner.drawio.svg?raw=true&sanitize=true "Table Designer")

## WYSIWYG HTML Editors

* Standard text edit tool bar - Bold, Italics, Underline, alignments, styles, etc
* Table edit operations - Add, insert & remove rows and columns, etc
* Below built-in functions and variables can be used
  * Variable names {{`VariableName`}}
    * PI - Current Page Index
    * PC - Total Pages Count
    * CurrentDateTime
* The developers can add their custom variables names.

![Alt text](./diagrams/HTMLDesigner.drawio.svg?raw=true&sanitize=true "HTML Designer")
