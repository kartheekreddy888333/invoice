# Tally Prime Invoice Template - Quick Reference

## 📄 Invoice Structure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        TAX INVOICE                              │
│                                    (ORIGINAL FOR RECIPIENT)     │
│                                                                 │
├──────────────────┬─────────────────────────────────────────────┤
│                  │                                             │
│  SELLER DETAILS  │         INVOICE INFORMATION PANEL           │
│  (LEFT)          │         (RIGHT - 13 FIELDS)                │
│                  │                                             │
│  Company Name    │  Invoice No. | INV-2026-0001               │
│  Address         │  Dated       | 01-Jun-26                   │
│  GSTIN/UIN       │  ...13 more fields...                      │
│  State & Code    │                                             │
│  Phone & Email   │                                             │
│                  │                                             │
├──────────────────┴─────────────────────────────────────────────┤
│                                                                 │
│  CONSIGNEE (Ship To)          BUYER (Bill To)                 │
│  ├─ Customer Name              ├─ Customer Name               │
│  ├─ Address                    ├─ Address                     │
│  ├─ GSTIN/UIN                  ├─ GSTIN/UIN                   │
│  └─ State & Code               └─ State & Code                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ITEMS TABLE (12 COLUMNS)                                      │
│  ┌──┬─────┬───┬───┬────┬────┬────┬───┬───┬───┬───┬────┐      │
│  │S │Item │HSN│Qty│Unit│Rate│Rate│GST│CGS│SGS│Tax│Amou│      │
│  │l │Name │   │  │   │+  │ -  │% │T% │T% │ % │nt │      │
│  │  │     │   │  │   │Tax│Tax │  │   │   │   │    │      │
│  ├──┼─────┼───┼───┼────┼────┼────┼───┼───┼───┼───┼────┤      │
│  │1 │Brown│484│3.5│TONS│1,3 │1,5 │ 9 │4.5│4.5│568│455 │      │
│  │  │Pap. │940│  │   │0,00│3,40│%  │% │% │80 │000 │      │
│  │  │     │000│  │   │0   │0   │   │   │   │.00│.00 │      │
│  │  │     │   │  │   │    │    │   │   │   │   │    │      │
│  │2 │Black│484│1.5│TONS│1,1 │1,1 │ 9 │4.5│4.5│107│177 │      │
│  │  │Pap. │940│  │   │8,00│8,00│%  │% │% │55 │000 │      │
│  │  │     │000│  │   │0   │0   │   │   │   │.00│.00 │      │
│  │  │     │   │  │   │    │    │   │   │   │   │    │      │
│  └──┴─────┴───┴───┴────┴────┴────┴───┴───┴───┴───┴────┘      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TAX SUMMARY (RIGHT-ALIGNED)                                   │
│  Taxable Value.......................... ₹6,32,000.00          │
│  CGST Total (9%)........................ ₹28,440.00           │
│  SGST Total (9%)........................ ₹28,440.00           │
│  Grand Total............................ ₹6,88,880.00          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Amount in Words:                                              │
│  Six Lakh Eighty Eight Thousand Eight Hundred Eighty Only      │
│                                                                 │
├──────────────────┬─────────────────────────────────────────────┤
│  BANK DETAILS    │  AUTHORIZED SIGNATORY                       │
│  ├─ Bank Name    │                                             │
│  ├─ Account No.  │  [Signature Line]                          │
│  ├─ IFSC         │                                             │
│  ├─ Branch       │  Company Name                               │
│  └─ UPI ID       │                                             │
│                  │                                             │
├──────────────────┴─────────────────────────────────────────────┤
│                                                                 │
│  Terms & Conditions:                                           │
│  Subject to Jurisdiction of Courts in [City].                 │
│  This is a computer generated invoice.                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Form Fields - Tally Prime Invoice Details

```
┌─ BASIC INVOICE DETAILS ─────────────────────────────────┐
│ Invoice Number: INV-2026-0001 (Auto-generated)          │
│ Invoice Date:   01-Jun-26 (Today's date)                │
│ Due Date:       01-Jul-26 (30 days default)             │
│ Customer:       [Dropdown - Select customer]            │
│ GST Type:       [CGST+SGST or IGST]                     │
└─────────────────────────────────────────────────────────┘

┌─ TALLY PRIME INVOICE DETAILS (New Fields) ──────────────┐
│ □ Delivery Note: [Text input]                           │
│ □ Mode of Payment: [Text input - Credit/Cash/Cheque]    │
│ □ Reference No. & Date: [Text input]                    │
│ □ Buyer's Order No.: [Text input]                       │
│ □ Dispatch Doc No.: [Text input]                        │
│ □ Delivery Note Date: [Date picker]                     │
│ □ Dispatched Through: [Text input - Truck/Courier]      │
│ □ Destination: [Text input - City/Place]                │
│ □ Vehicle Number: [Text input - Vehicle/Truck No]       │
│ □ Bill of Lading/LR-RR No.: [Text input]               │
│ □ Terms Of Delivery: [Text input - FOB/CIF/COD]        │
│ □ eWay Bill Number: [Text input]                        │
└─────────────────────────────────────────────────────────┘

┌─ ITEMS SECTION ─────────────────────────────────────────┐
│ Product: [Dropdown - Product from inventory]            │
│ Quantity: [Number input]                                │
│ [ADD BUTTON]                                            │
│                                                          │
│ ITEMS TABLE:                                            │
│ ├─ Product Name | HSN | Qty | Unit | Rate | GST | ... │
│ ├─ Banganapalli | 08045020 | 25 | kg | ₹60 | 5% | ... │
│ └─ [DELETE BUTTONS FOR EACH ITEM]                       │
└─────────────────────────────────────────────────────────┘

┌─ PAYMENT SECTION ───────────────────────────────────────┐
│ Payment Status: [Unpaid / Partially Paid / Paid]         │
│ Paid Amount: [Number input]                             │
│ Outstanding: [Auto-calculated display]                  │
└─────────────────────────────────────────────────────────┘

┌─ ADDITIONAL DETAILS ────────────────────────────────────┐
│ Status: [Draft / Pending / Completed]                   │
│ Round Off: [Number input]                               │
│ Notes: [Text area - Terms & conditions]                 │
└─────────────────────────────────────────────────────────┘

┌─ ACTION BUTTONS ────────────────────────────────────────┐
│ [CREATE INVOICE] [CANCEL]                               │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Template Selection

```
After Invoice is Created:

┌─ TEMPLATE OPTIONS ────────────────────────────────────────┐
│ [🎨 Tally Prime Style] [📋 Classic Tally]                │
│ [🏢 Modern Business]   [📊 GST Detailed]                 │
└──────────────────────────────────────────────────────────┘
     (Default: Tally Prime Style)

Below: Live Invoice Preview

[DOWNLOAD PDF] [PRINT] [EMAIL] [SHARE]
```

## 💾 File Organization

```
src/
├── components/
│   ├── TallyPrimeTemplate.jsx ........... ✨ NEW - Tally Prime Layout
│   ├── InvoicePreview.jsx .............. ✏️ UPDATED - Added Template
│   ├── InvoiceForm.jsx ................. ✏️ UPDATED - Added Fields
│   ├── InvoiceTemplate1.jsx ............ (Existing - Classic)
│   ├── InvoiceTemplate2.jsx ............ (Existing - Modern)
│   ├── InvoiceTemplate3.jsx ............ (Existing - GST Detailed)
│   └── ... other components
│
├── pages/
│   ├── Invoices.jsx .................... (Invoice Management)
│   ├── Products.jsx .................... (Inventory)
│   ├── Customers.jsx ................... (Customer Data)
│   └── ... other pages
│
└── TALLY_PRIME_TEMPLATE_GUIDE.md ....... 📖 Documentation (NEW)
```

## 🔄 Workflow Example

```
START
  │
  ├─→ Add Customer
  │   └─→ Fill: Name, Address, GSTIN, State
  │       └─→ Save
  │
  ├─→ Create Invoice
  │   ├─→ Fill Basic Details
  │   │   ├─ Select Customer
  │   │   ├─ Set Invoice Date
  │   │   └─ Choose GST Type
  │   │
  │   ├─→ Fill Tally Prime Details
  │   │   ├─ Delivery Note
  │   │   ├─ Dispatch Doc No
  │   │   ├─ Vehicle Number
  │   │   └─ ... (11 fields total)
  │   │
  │   ├─→ Add Items
  │   │   ├─ Select Product
  │   │   ├─ Enter Quantity
  │   │   ├─ System auto-fills: HSN, Unit, Price, GST%
  │   │   ├─ Add Item
  │   │   └─ Repeat for more items
  │   │
  │   ├─→ Set Payment Status
  │   │   ├─ Unpaid / Partially Paid / Paid
  │   │   └─ Enter Paid Amount
  │   │
  │   └─→ Click "Create Invoice"
  │       └─→ Stock Automatically Deducts
  │
  ├─→ Preview Invoice
  │   ├─→ Select Template (Default: Tally Prime)
  │   ├─→ View Professional Layout
  │   └─→ Verify All Details
  │
  ├─→ Export/Print
  │   ├─→ Download PDF
  │   │   └─→ File: INV-2026-0001.pdf (A4, High Quality)
  │   │
  │   └─→ Print to Printer
  │       ├─→ Buttons Hidden During Print
  │       ├─→ Professional Layout
  │       └─→ Ready for Delivery
  │
  └─→ END
```

## ✅ Data Validation

```
Required Fields:
├─ Customer: MUST select a customer
├─ Invoice Date: MUST be a valid date
└─ Items: MUST add at least ONE item

Stock Validation:
├─ Current Stock >= Quantity (prevents overselling)
└─ Alert shown if insufficient stock

Payment Validation:
├─ Payment Status is set
├─ Paid Amount <= Grand Total
└─ Outstanding Amount auto-calculated

GST Validation:
├─ GST Type determines: CGST+SGST or IGST
├─ Tax rates applied per product
└─ All totals auto-calculated
```

## 📊 Calculations Performed Automatically

```
For Each Item:
├─ Taxable Amount = Quantity × Rate (Excl. Tax)
├─ Tax Amount = Taxable Amount × GST% / 100
├─ Amount (Incl. Tax) = Taxable Amount + Tax Amount
└─ CGST/SGST/IGST = Tax Amount ÷ 2 (for intra-state) or All (for inter-state)

For Invoice:
├─ Subtotal = Sum of all Taxable Amounts
├─ Total CGST = Sum of all CGST amounts
├─ Total SGST = Sum of all SGST amounts (intra-state)
├─ Total IGST = Sum of all IGST amounts (inter-state)
├─ Grand Total = Subtotal + Total Tax
├─ Amount in Words = Automatic conversion
├─ Outstanding = Grand Total - Paid Amount
└─ Stock Deduction = Item Qty subtracted from Inventory
```

## 🎯 What to Provide When Creating Invoice

### Minimum Required:
✅ Customer Name
✅ At least 1 Product with Quantity

### Recommended for Professional Invoice:
✅ Delivery Note Number
✅ Mode of Payment
✅ Dispatch Documentation
✅ Vehicle Information
✅ Destination Details
✅ Bill of Lading (for shipping)
✅ Terms of Delivery

### Payment Information:
✅ Payment Status (Unpaid/Partial/Paid)
✅ Paid Amount (if partially paid)

### System Auto-Fills:
✅ Invoice Number (based on sequence)
✅ Invoice Date (today's date)
✅ Product HSN Code
✅ Product Unit
✅ Product Price
✅ Product GST Rate
✅ All Tax Calculations
✅ Grand Total
✅ Amount in Words
✅ Company Details from Settings

---

## 🚀 Get Started Now!

1. **Set Company Details** → Go to Settings, fill Company Info
2. **Add Products** → Go to Products, add your product catalog
3. **Add Customers** → Go to Customers, add your customers
4. **Create First Invoice** → Go to Invoices, click "Create Invoice"
5. **Generate PDF** → Click "Download PDF" for professional invoice
6. **Print** → Click "Print" for A4 paper output

**Your Tally Prime-style invoices are ready!** 🎉
