# AptTec Reporting: Unveiling Comprehensive Features

Experience the power of **AptTec Reporting**, our innovative tool that revolutionizes the way you handle reports. [Say goodbye to cumbersome server-side hardware and software expenses,](ServersideReportingIssues.md) and say hello to effortless multi-tenancy reporting with unmatched flexibility and customization.

Here's how **AptTec Reporting** can supercharge your reporting process:

1. **Browser-Based Rendering:** Reports are seamlessly rendered within your browser, eliminating the need for costly server-side hardware and software. Enjoy lightning-fast report generation without the burden of heavy infrastructure.
2. **Print Time Configuration:** Preview data based on default formats set by the Business Analysts. However, retain the flexibility to fine-tune all parameters after previewing the data, ensuring that reports meet end users specific needs.
3. **Enhanced Customization with WYSIWYG Editors:** Enjoy an intuitive experience with WYSIWYG HTML editors for customizing and saving report designs effortlessly. The end users now have the ability to tailor logos, header and footer designs, select columns to print, define column titles, column formats, column width, and even specify the number of characters to be printed for each column. This granular control ensures that reports are tailored precisely to your end users' needs.
4. **Diverse data sets and categories:** Now, users can effortlessly customize multiple printable tables and multiple HTML sections within a single report. This feature is perfect for creating comprehensive reports that cover diverse data sets and categories.
5. **Multi-Tenancy Reporting:** Business Analysts can easily configure templates for each specific tenant, tailoring the reports to their unique requirements.
6. **Advanced Styling with CSS:** For advanced users, we offer the ability to fine-tune the look and feel of reports using custom CSS style sheets. Achieve a polished and professional appearance that aligns with your brand identity.
7. **Eco-Friendly Paper Saving:** Empower users to optimize data elements' width and height, enabling significant paper savings. Contribute to a greener environment without compromising on data readability.

# Revolutionary Architecture and Design:

1. Behind the scenes, **AptTec Reporting** employs an ingenious architecture that loads HTML and supporting files from a common static website.
2. This means that in large corporate environments featuring multiple websites, a single reporting site can be reused across various products and front-ends.
3. This not only improves maintainability but also allows different teams to easily integrate the reporting engine with minimal code. They can maintain distinct templates and server-side services, tailored to their specific needs.
4. This library has built in logic to integrate with the Telerik/Kendo Grids and standard json services

![Alt text](/diagrams/ClientReportingFlow.drawio.svg?raw=true&sanitize=true "Solution")

# Unlock the True Potential of Reporting

Discover the ultimate reporting solution that enhances productivity, reduces costs, and with **AptTec Reporting's** user-friendly interface and powerful features, reporting has never been this customizable and efficient.

Experience the future of reporting, where your reports are not just static documents, but dynamic, personalized insights that reflect your unique requirements. Elevate your reporting game with **AptTec Reporting** today!

# Features

**Design Time Configuration** :

1. Developers/BAs can enable or add multiple HTML sections and Tables using the template file
2. The users can **only **select the columns from the list set from the template file.
3. The settings set on the template files will be the default settings applied for all the users.
4. If users click the Reset button on the report designer the settings will be reverted back to the templates files settings.


**Print Time Configuration** : Allows the end users to configure the below options from the browser

1. Page size - pre-configured page sizes. "A3", "A4", "A5", "B4", "B5", "Letter", "Legal", "Ledger"
   Identify the dimensions from wiki. [Paper size - Wikipedia](https://en.wikipedia.org/wiki/Paper_size)
2. Page layout - portrait, landscape
3. Margins in millimeters - Top, Left, Right, and Bottom
4. Page header- users can configure HTML content that appears at the **top of every page **using the WYSIWYG editor
5. Page footer- users can configure HTML content that appears at the **bottom of every page **using the WYSIWYG editor
6. Report header - users can configure HTML content that appears at the **top of the report** using the WYSIWYG editor
7. Report footer - users can configure HTML content that appears at the **bottom of the report** using the WYSIWYG editor
8. Table Editor
   1. To select a column to appear on the report or not
   2. Column title
   3. Column width. The units can be taken from [CSS values and units - Learn web development | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
   4. Format - only us date time is supported as of now. The rest of the formats is to be coded.
   5. To print only the first N characters from a column.

![Alt text](/diagrams/PageLayout.drawio.svg?raw=true&sanitize=true "Print time configurations")