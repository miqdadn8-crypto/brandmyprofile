// Kuwait CV Template Pack - content for 4 roles, each as a bracketed template and a fictional filled example.
// Section item kinds: {p: text} paragraph, {b: text} bullet, {role: {title, org, dates}} job line.

const NOTE = 'HOW TO USE THIS TEMPLATE (delete this box before you send your CV): Replace every [bracketed] line with your own details and delete the brackets. Keep the section order and the single-column layout - applicant tracking systems read it reliably. Save as PDF to send, and keep this Word file for tailoring each application. Free template from BrandMyProfile. Want a person to check it? Free CV review: brandmyprofile.com/kuwait/free-cv-review';

const head = (name, role, contact, details) => ({ name, role, contact, details });

const roles = {
  general: {
    label: 'General (experienced professional)',
    template: {
      ...head('[FULL NAME]', '[Target job title, written exactly as in the advert]', '[+965 XXXX XXXX] · [name@email.com] · [linkedin.com/in/yourname] · [City], Kuwait', '[Nationality] · [Residency status, e.g. Article 18 residency] · Notice period: [e.g. 30 days]'),
      sections: [
        ['Professional Summary', [{ p: '[3-4 lines: what you do, for which kind of employer, and the one or two results you are proudest of. Rewrite this for every application.]' }]],
        ['Key Skills', [{ p: '[8-12 skills from the job description, separated by commas. Name tools exactly, e.g. "SAP MM", not "ERP systems".]' }]],
        ['Work Experience', [
          { role: { title: '[Job Title]', org: '[Employer], [City]', dates: '[Mon YYYY] – [Present]' } },
          { b: '[Result: action + tool or method + what changed. Use a number where you honestly have one.]' },
          { b: '[Result]' },
          { b: '[Result]' },
          { role: { title: '[Previous Job Title]', org: '[Employer], [City, Country]', dates: '[Mon YYYY] – [Mon YYYY]' } },
          { b: '[Result]' },
          { b: '[Result]' },
        ]],
        ['Education', [{ p: '[Degree], [Institution], [Country], [Year]' }]],
        ['Certifications and Licences', [{ b: '[Certification name], [Issuing body], [Year] – expires [Year, if it expires]' }]],
        ['Languages', [{ p: 'English ([level]) · Arabic ([level]) · [Other] ([level])' }]],
      ],
    },
    example: {
      ...head('EXAMPLE CANDIDATE', 'Supply Chain Coordinator', '+965 0000 0000 · candidate@email.com · linkedin.com/in/example · Kuwait City, Kuwait', 'Indian national · Kuwait residency (transferable) · Notice period: 30 days'),
      sections: [
        ['Professional Summary', [{ p: 'Supply chain coordinator with 6 years in Kuwait retail and FMCG distribution. Runs purchasing, stock control and supplier follow-up for multi-branch operations, and cut stock discrepancies by tightening weekly cycle counts. Looking for a coordinator or senior coordinator role with a Kuwait distributor.' }]],
        ['Key Skills', [{ p: 'Purchasing, Inventory control, Cycle counting, Supplier follow-up, SAP MM, Advanced Excel (pivot tables, XLOOKUP), Demand planning, Customs documentation, Reporting' }]],
        ['Work Experience', [
          { role: { title: 'Supply Chain Coordinator', org: 'Retail distribution company, Shuwaikh', dates: 'Mar 2022 – Present' } },
          { b: 'Coordinate purchasing for 14 branches in SAP MM, raising and tracking around 120 purchase orders a month.' },
          { b: 'Introduced weekly cycle counts on fast-moving lines, reducing month-end stock adjustments.' },
          { b: 'Prepare the weekly replenishment report used by the purchasing manager to set order quantities.' },
          { role: { title: 'Inventory Controller', org: 'FMCG distributor, Kuwait City', dates: 'Jan 2019 – Feb 2022' } },
          { b: 'Maintained stock records for a warehouse of 2,000+ SKUs and reconciled weekly counts against the system.' },
          { b: 'Handled customs paperwork for inbound shipments with the clearing agent.' },
        ]],
        ['Education', [{ p: 'Bachelor of Commerce, University of Mumbai, India, 2018' }]],
        ['Certifications and Licences', [{ b: 'Certified Supply Chain Professional (training course), 2023' }]],
        ['Languages', [{ p: 'English (fluent) · Hindi (native) · Arabic (basic)' }]],
      ],
    },
  },

  fresher: {
    label: 'Fresher / graduate',
    template: {
      ...head('[FULL NAME]', '[Target role, e.g. Graduate Accountant]', '[+965 XXXX XXXX] · [name@email.com] · [linkedin.com/in/yourname] · [City], Kuwait', '[Nationality] · [Residency status] · Available: [immediately / from Mon YYYY]'),
      sections: [
        ['Professional Summary', [{ p: '[2-3 lines: your degree, the kind of role you want, and the strongest thing you have done so far - a project, an internship or a result.]' }]],
        ['Education', [{ p: '[Degree and major], [University], [Country], [Year] · [Grade/GPA if it is strong]' }, { b: '[Relevant course, final-year project or award]' }]],
        ['Internships and Projects', [
          { role: { title: '[Intern title or project name]', org: '[Company or university], [City]', dates: '[Mon YYYY] – [Mon YYYY]' } },
          { b: '[What you did and what came of it - not "participated in".]' },
          { b: '[Result]' },
        ]],
        ['Skills', [{ p: '[Tools and skills from the job description, e.g. Excel, Power BI, Python, Arabic typing.]' }]],
        ['Training and Certifications', [{ b: '[Course or certificate], [Provider], [Year]' }]],
        ['Languages', [{ p: 'English ([level]) · Arabic ([level])' }]],
        ['Activities', [{ b: '[Society, volunteering or sport - one line, only if it shows responsibility or a skill.]' }]],
      ],
    },
    example: {
      ...head('EXAMPLE CANDIDATE', 'Graduate Accountant', '+965 0000 0000 · candidate@email.com · linkedin.com/in/example · Salmiya, Kuwait', 'Egyptian national · Kuwait residency (family) · Available immediately'),
      sections: [
        ['Professional Summary', [{ p: 'Accounting graduate looking for a graduate accountant role in Kuwait. Completed a 3-month audit internship and built the expense tracker my student society still uses.' }]],
        ['Education', [{ p: 'BSc Accounting, university in Kuwait, 2026 · GPA 3.4/4.0' }, { b: 'Final-year project: cash-flow forecast model for a small trading business, built in Excel.' }]],
        ['Internships and Projects', [
          { role: { title: 'Audit Intern', org: 'Audit firm, Kuwait City', dates: 'Jun 2025 – Aug 2025' } },
          { b: 'Prepared bank reconciliations and fixed-asset schedules for two client audits.' },
          { b: 'Matched 400+ supplier invoices to purchase orders during year-end testing.' },
        ]],
        ['Skills', [{ p: 'Excel (pivot tables, XLOOKUP), QuickBooks, IFRS basics, Bank reconciliation, Power BI (basic)' }]],
        ['Training and Certifications', [{ b: 'Introduction to IFRS, online course, 2025' }]],
        ['Languages', [{ p: 'Arabic (native) · English (fluent)' }]],
        ['Activities', [{ b: 'Treasurer, university accounting society, 2024–2025: kept the society\'s accounts and budget.' }]],
      ],
    },
  },

  nurse: {
    label: 'Nurse / healthcare',
    template: {
      ...head('[FULL NAME], [RN / your title]', '[Target role, e.g. Staff Nurse – ICU]', '[+965 XXXX XXXX] · [name@email.com] · [City], Kuwait', '[Nationality] · [Residency status] · Notice period: [e.g. 1 month]'),
      sections: [
        ['Professional Summary', [{ p: '[3 lines: your nursing specialty, years of experience, the settings you have worked in, and the role you want.]' }]],
        ['Licence and Registration', [{ b: '[Licence or registration type], [Issuing authority/country], No. [only if the employer asks], valid until [Mon YYYY]' }, { b: '[Kuwait licensing or verification status, if applicable - check current Ministry of Health requirements for your role]' }]],
        ['Clinical Experience', [
          { role: { title: '[Job Title, e.g. Staff Nurse]', org: '[Hospital or clinic], [City, Country]', dates: '[Mon YYYY] – [Present]' } },
          { b: '[Unit and capacity, e.g. "20-bed medical ICU", and your usual patient load.]' },
          { b: '[Procedures, equipment and systems you use, named exactly.]' },
          { b: '[A responsibility or result: charge duty, training new staff, an audit you led.]' },
        ]],
        ['Certifications', [{ b: '[BLS / ACLS / PALS], [Provider], expires [Mon YYYY]' }]],
        ['Education', [{ p: '[Nursing degree or diploma], [Institution], [Country], [Year]' }]],
        ['Languages', [{ p: 'English ([level]) · Arabic ([level]) · [Other] ([level])' }]],
      ],
    },
    example: {
      ...head('EXAMPLE CANDIDATE, RN', 'Staff Nurse – Medical ICU', '+965 0000 0000 · candidate@email.com · Hawalli, Kuwait', 'Filipino national · Kuwait residency · Notice period: 1 month'),
      sections: [
        ['Professional Summary', [{ p: 'Registered nurse with 7 years in adult critical care, the last 4 in a medical ICU. Experienced with ventilated patients, central lines and charge-nurse shifts. Looking for a staff nurse post in an ICU in Kuwait.' }]],
        ['Licence and Registration', [{ b: 'Registered Nurse, Professional Regulation Commission (Philippines), valid until Mar 2028' }]],
        ['Clinical Experience', [
          { role: { title: 'Staff Nurse, Medical ICU', org: 'Private hospital, Kuwait City', dates: 'Feb 2022 – Present' } },
          { b: '16-bed medical ICU; usual load of 2 ventilated patients per shift.' },
          { b: 'Manage mechanical ventilation, arterial and central lines, and infusion pumps; document in the hospital EMR.' },
          { b: 'Take charge-nurse shifts twice a month and orient new ICU staff.' },
          { role: { title: 'Staff Nurse, Critical Care', org: 'Tertiary hospital, Manila, Philippines', dates: 'Jun 2019 – Jan 2022' } },
          { b: 'Rotated through surgical and cardiac ICU; cared for post-operative cardiac patients.' },
        ]],
        ['Certifications', [{ b: 'BLS and ACLS, American Heart Association, expire Sep 2027' }]],
        ['Education', [{ p: 'BSc Nursing, university in Manila, Philippines, 2018' }]],
        ['Languages', [{ p: 'English (fluent) · Filipino (native) · Arabic (conversational)' }]],
      ],
    },
  },

  driver: {
    label: 'Driver',
    template: {
      ...head('[FULL NAME]', '[Target role, e.g. Light Vehicle Driver / Delivery Driver]', '[+965 XXXX XXXX] · [name@email.com] · [Area], Kuwait', '[Nationality] · [Residency status] · Available: [immediately / from Mon YYYY]'),
      sections: [
        ['Profile', [{ p: '[2 lines: years driving professionally, the vehicles you drive, and the kind of work - company, delivery, transport.]' }]],
        ['Driving Licence', [{ b: '[Licence type], issued in [country], valid until [Mon YYYY]' }, { b: 'Vehicles: [e.g. cars, vans, light trucks - only the ones your licence covers]' }]],
        ['Work Experience', [
          { role: { title: '[Driver job title]', org: '[Employer], [City]', dates: '[Mon YYYY] – [Present]' } },
          { b: '[Vehicle types driven and the areas or routes you covered in Kuwait.]' },
          { b: '[Daily volume or responsibility, e.g. deliveries per day, staff transport, vehicle checks.]' },
          { b: '[Safety record - only if it is true, e.g. "No accidents or traffic violations".]' },
        ]],
        ['Training', [{ b: '[Defensive driving / first aid / other], [Provider], [Year]' }]],
        ['Languages', [{ p: '[English (level)] · [Arabic (level)] · [Other (level)]' }]],
      ],
    },
    example: {
      ...head('EXAMPLE CANDIDATE', 'Delivery Driver (Light Vehicles)', '+965 0000 0000 · candidate@email.com · Farwaniya, Kuwait', 'Nepali national · Kuwait residency · Available from Jan 2027'),
      sections: [
        ['Profile', [{ p: 'Professional driver with 5 years in Kuwait, driving vans and light trucks for food and parcel delivery across all six governorates.' }]],
        ['Driving Licence', [{ b: 'Kuwait driving licence (light vehicles), valid until Aug 2029' }, { b: 'Vehicles: cars, vans, pickup trucks' }]],
        ['Work Experience', [
          { role: { title: 'Delivery Driver', org: 'Food distribution company, Sulaibiya', dates: 'May 2021 – Present' } },
          { b: 'Deliver to around 25 restaurants and shops a day across Farwaniya, Hawalli and the Capital.' },
          { b: 'Do daily vehicle checks and keep delivery notes and cash collections accurate.' },
          { b: 'No accidents or traffic violations in 5 years of driving in Kuwait.' },
        ]],
        ['Training', [{ b: 'Defensive driving course, employer training, 2023' }]],
        ['Languages', [{ p: 'English (good) · Hindi (good) · Nepali (native) · Arabic (basic)' }]],
      ],
    },
  },
};

module.exports = { NOTE, roles };
