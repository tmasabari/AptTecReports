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

1. To select whether a column to appear on the report or not
2. Heading/Title of the column
3. Column width. All the standard CSS width units are supported  [CSS values and units - Learn web development | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
4. Format - Js functions to be invoked to format the data. The developers can add their own js functions.
   1. ShortDateTime - The value can be either JS Date or MS Date time stamp. This will be shown as **M/D/YYYY HH:MM:ss**. The developers can add their custom functions.
   2. Decimal
   3. Percent
   4. Currency
   5. DateTime24 - "12/19/2012, 19:00:00"
5. To print only the first N characters from a column. The rest of of the characters will be ignored. Specify 0 to include all the characters.

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