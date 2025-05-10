
// Default template text
export const DEFAULT_TEMPLATE = `Out-of-Network Insurance Reimbursement Guide & Cover Sheet
Supporting your wellness — every step of the way

We've prepared this document to help you submit your superbill to your insurance provider for possible out-of-network reimbursement. While we do not bill insurance directly, many of our patients receive partial or full reimbursement depending on their plan. If you have any questions or need a new copy, we're happy to help!

Patient & Superbill Summary
Patient Name: {{patient.name}}

Date of Birth: {{patient.dob}}

Dates of Service: {{superbill.visitDateRange}}

Total Number of Visits: {{superbill.totalVisits}}

Total Charges: {{superbill.totalFee}}

Note: This is not a bill. It is a superbill, a detailed receipt to support your claim for insurance reimbursement.

Step-by-Step Reimbursement Instructions
1. Confirm Your Insurance Benefits: Call your insurance provider or check your online portal. Ask if your plan covers out-of-network chiropractic care. Note your deductible, out-of-network benefits, and required claim forms.
2. Complete a Claim Form: Most insurance companies use a CMS-1500 or proprietary claim form. Download it from your provider's website or call to request a copy. Fill out the member and patient sections as instructed.
3. Attach Your Superbill: Ensure the superbill includes your name, DOB, dates of service, ICD-10 and CPT codes, payment amounts, and provider details.
4. Submit Your Claim: Follow your insurance provider's submission instructions (mail, fax, or upload). Keep a copy for your records.
5. Wait for Reimbursement: Processing may take 2–6 weeks. Monitor your Explanation of Benefits (EOB).
6. Follow Up if Needed: If you don't hear back, call your provider. Reference the dates of service and provider info on the superbill.

Clinic Information for Insurance Use
Provider: {{clinic.provider}}
Clinic: {{clinic.name}}
Address: {{clinic.address}}
Phone: {{clinic.phone}}
Email: {{clinic.email}}
EIN: {{clinic.ein}}
NPI #: {{clinic.npi}}

Final Checklist Before You Submit
□ Claim form is complete
□ Superbill is attached
□ You have kept a copy for your records
□ You know how to follow up

Need Help?
If you misplace this form or have questions, we're here to support you. You can visit our help page, which has FAQs and more information.

Thank you for choosing our clinic. We're honored to be a part of your wellness journey!`;
