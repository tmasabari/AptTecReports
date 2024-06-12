# How-to

* [Integrate to your website](DeveloperGuide.md "How to integrate")
* [Report Designer](ReportDesigner.md "Report designer section")
* [Customize the report templates](HowToTemplate.md "Customize the report templates")

# AptTec Reporting: Unveiling Comprehensive Features

Experience the power of **AptTec Reporting**, our innovative tool that revolutionizes the way you handle reports. [Say goodbye to cumbersome server-side hardware and software expenses,](ServersideReportingIssues.md) and say hello to effortless multi-tenancy reporting with unmatched flexibility and customization.

Here's how **AptTec Reporting** can supercharge your reporting process:

![Alt text](../diagrams/features.drawio.svg?raw=true&sanitize=true "Features")

# Revolutionary Architecture and Design:

1. Behind the scenes, **AptTec Reporting** employs an ingenious architecture that loads HTML and supporting files from a common static website.
2. This means that in large corporate environments featuring multiple websites, a single reporting site can be reused across various products and front-ends.
3. This not only improves maintainability but also allows different teams to easily integrate the reporting efrom the browserngine with minimal code. They can maintain distinct templates and server-side services, tailored to their specific needs.
4. This library has built in logic to integrate with the Telerik/Kendo Grids and standard json services

![Alt text](../diagrams/ClientReportingFlow.drawio.svg?raw=true&sanitize=true "Solution")

# Unlock the True Potential of Reporting

Discover the ultimate reporting solution that enhances productivity, reduces costs, and with **AptTec Reporting's** user-friendly interface and powerful features, reporting has never been this customizable and efficient.

Experience the future of reporting, where your reports are not just static documents, but dynamic, personalized insights that reflect your unique requirements. Elevate your reporting game with **AptTec Reporting** today!

# Features

**Design Time Configuration** :

1. Developers/BAs can enable or add multiple HTML sections and Tables using a template file for each report.
2. The full control on the set of data to be available for end users is with the developers/BAs.
3. The settings set on the template files will be the default settings applied for all the users.
4. Please refer the [Customize report templates Section](HowToTemplate.md "Customize report templates Section") page for further information.

**Print Time Configuration** :

The end users has full control over the page layout, table designer, WYSIWYG editors for different sections, etc allowed by the developers & BAs at the time of printing. Please refer the [Report Designer section](ReportDesigner.md "Report designer section") page for further information.

![Alt text](../diagrams/LayoutDesigner.drawio.svg?raw=true&sanitize=true "Layout Designer")
![Alt text](../diagrams/TableDesigner.drawio.svg?raw=true&sanitize=true "Table Designer")
![Alt text](../diagrams/HTMLDesigner.drawio.svg?raw=true&sanitize=true "HTML Designer")

![Alt text](../diagrams/PageLayout.drawio.svg?raw=true&sanitize=true "Print time configurations")
