# 🚀 Getting Started Guide - First 5 Minutes

## ⏱️ Quick Start (5 Minutes)

This guide gets you creating your first professional invoice in **5 minutes**.

---

## ✅ Step 1: Verify Application is Running (1 minute)

### Check if app is running on your computer:
1. Open your web browser (Chrome, Firefox, Edge, Safari)
2. Go to: **http://localhost:5173**
3. You should see the **"GST Invoice Generator"** home page

✅ If you see the app, move to Step 2
❌ If not, open Terminal and run: `npm run dev`

---

## ✅ Step 2: Navigate to Customers Page (30 seconds)

1. Click **"Customers"** in the left menu
2. You'll see **"0 total customers"** (database is empty)
3. Click **"Add Customer"** button (blue button)

---

## ✅ Step 3: Create Your First Customer (1 minute)

### Fill in this customer information:

```
Customer Name:    M R FRUIT & COVERS
Address:          1-117, Yadamalapeta, Chinna Vedhi, 
                  Sri Bommaraju Puram, Tirupati
Mobile:           +91-9876543210
Email:            contact@mrfruitcovers.com
State:            Andhra Pradesh
GSTIN:            37ACHFM0005A1ZZ
```

4. Click **"Add Customer"** button
5. You should see success notification ✅

---

## ✅ Step 4: Create First Invoice (2 minutes)

### Navigate to Invoices:
1. Click **"Invoices"** in the left menu
2. Click **"Create Invoice"** button

### Fill in Invoice Details:
```
Invoice Date:     Today (auto-filled)
Due Date:         30 days from today (auto-filled)
Customer:         Select "M R FRUIT & COVERS"
GST Type:         "CGST + SGST (Intra-state)"
```

### Add Items to Invoice:
1. In **"Add Items"** section:
   - **Product:** Select "Banganapalli" (mango - pre-loaded)
   - **Quantity:** Enter `25` (kg)
   - Click **"ADD"** button

2. You'll see item added to table with:
   - HSN: 08045020 ✅
   - Rate: ₹60 ✅
   - GST: 5% ✅
   - **Total: ₹1,575** (calculated automatically) ✅

### Set Payment Status:
1. **Payment Status:** Select "Unpaid"
2. **Paid Amount:** Leave as 0

### Create Invoice:
3. Click **"CREATE INVOICE"** button
4. Invoice saved successfully! ✅

---

## ✅ Step 5: View & Export Your Professional Invoice (1 minute)

### After invoice is created:
1. You'll see the **Invoices** page with your new invoice in the table
2. Look for your invoice number (e.g., "INV-2026-0001")
3. Click the invoice to view details
4. You'll see the **"Tally Prime Style"** invoice preview

### Export to PDF:
1. Click **"Download PDF"** button
2. File saves to your Downloads folder: `INV-2026-0001.pdf`
3. Open the PDF to see professional Tally Prime format ✅

### Print Invoice:
1. Click **"Print"** button
2. Select your printer
3. Click **"Print"**
4. Your professional A4 invoice prints! ✅

---

## ✅ Verify Stock Was Deducted (30 seconds - BONUS!)

1. Click **"Products"** in left menu
2. Look for **"Banganapalli"** row
3. Stock should show: **475 kg** (was 500, sold 25)
4. Check **"Stock Movement"** page to see audit trail ✅

---

## 🎉 You Did It!

You've successfully:
- ✅ Created a customer
- ✅ Created a professional GST invoice
- ✅ Exported to PDF
- ✅ Printed A4 invoice
- ✅ Verified stock deduction

**Total Time: 5 minutes** ⏱️

---

## 🎯 What's Next?

### Option 1: Create More Invoices
- Go to Invoices page
- Click "Create Invoice"
- Repeat the process
- Create 3-5 invoices to test

### Option 2: Explore Features
- **Products page:** See all 5 mango products
- **Stock Movement:** View audit trail
- **Reports:** See charts and analytics
- **Accounting:** View profit and revenue
- **Dashboard:** See KPI cards

### Option 3: Customize
- **Settings page:** Update company details
- **Company logo:** Upload your company logo
- **Products:** Add your own products
- **Templates:** Try other invoice templates

### Option 4: Share
- **Send PDFs:** Email invoices to customers
- **Print:** Use physical printer
- **Archive:** Keep all PDFs on computer
- **Backup:** Save data locally

---

## 📋 Tally Prime Invoice Details (Optional)

When creating future invoices, you can fill these **Tally Prime fields** (shown in blue section):

```
✓ Delivery Note: DN-2026-001
✓ Mode of Payment: Credit
✓ Reference No.: REF-2026-001
✓ Buyer's Order No.: BO-2026-001
✓ Dispatch Doc No.: DIS-2026-001
✓ Delivery Note Date: [Today]
✓ Dispatched Through: Truck
✓ Destination: PUTTUR
✓ Vehicle Number: AP39TF3815
✓ Bill of Lading: LR-2026-001
✓ Terms Of Delivery: FOB
```

All optional - fill only what you need!

---

## ❓ Common Issues & Solutions

### Issue: Can't find app
**Solution:** Make sure app is running (`npm run dev` in terminal)

### Issue: Customer dropdown is empty
**Solution:** Create a customer first using "Add Customer" button

### Issue: Product dropdown is empty
**Solution:** Go to Products page to add products (5 are pre-loaded)

### Issue: PDF doesn't download
**Solution:** Check browser download settings - may need to allow downloads

### Issue: Stock didn't reduce
**Solution:** Stock only reduces on "Create Invoice", not on edit

### Issue: Button not responding
**Solution:** Wait a moment - sometimes browser is processing

---

## 📞 Need Help?

### Quick Reference
- Open: **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Visual diagrams
- Time: 5 minutes
- Best for: Understanding fields and workflow

### Complete Guide
- Open: **[TALLY_PRIME_TEMPLATE_GUIDE.md](TALLY_PRIME_TEMPLATE_GUIDE.md)** - Full instructions
- Time: 15 minutes
- Best for: Detailed learning

### Project Overview
- Open: **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Features checklist
- Time: 10 minutes
- Best for: Understanding what's included

---

## 🎨 Invoice Templates Available

After creating an invoice, you can choose from 4 templates:

1. **🎨 Tally Prime Style** (DEFAULT - Professional tax invoice)
2. **📋 Classic Tally** (Traditional format)
3. **🏢 Modern Business** (Contemporary design)
4. **📊 GST Detailed** (Enhanced tax breakdown)

Try switching templates to see the difference!

---

## 💡 Pro Tips

1. **Pre-filled Data:** Company (K2C AGRO TECH) and Products (5 mangoes) are pre-loaded
2. **Auto Calculations:** All taxes and totals calculate automatically
3. **Stock Tracking:** Every invoice automatically updates inventory
4. **Payment Status:** Track paid/unpaid/partial invoices
5. **CSV Export:** Stock movements can be exported as CSV
6. **Dark Mode:** Toggle dark mode with 🌙 button
7. **Print Format:** Buttons hide automatically when printing

---

## 🚀 Ready for Production?

Once you're comfortable, you can:

### Deploy to Web:
```bash
npm run build
# Upload dist/ folder to Vercel, Netlify, or your server
```

### Backup Data:
```
All data is in browser's localStorage
Persists automatically between sessions
```

### Share with Team:
```
Share the URL with team members
Each person has their own data (on their device)
```

---

## 📊 Data Included by Default

### Company: K2C AGRO TECH
- GSTIN: 29AAFCU5055K1Z0
- Phone: +91-9876543210
- Email: contact@k2cagro.com
- Bank: SBI Account

### Products (5 Mangoes):
1. **Banganapalli** - 500 kg @ ₹60/kg
2. **Himayat** - 400 kg @ ₹75/kg
3. **Alphonso** - 300 kg @ ₹90/kg
4. **Kesar** - 350 kg @ ₹80/kg
5. **Dasheri** - 450 kg @ ₹70/kg

All with HSN: 08045020 (Standard mango classification)

---

## ✅ Success Checklist

After your first 5 minutes, verify:

- [ ] App loaded at http://localhost:5173
- [ ] Customer "M R FRUIT & COVERS" created
- [ ] Invoice "INV-2026-0001" created
- [ ] Invoice shows in table
- [ ] PDF downloaded successfully
- [ ] Stock reduced from 500 to 475 kg
- [ ] Print button works
- [ ] All 4 templates visible
- [ ] Data persists after refresh
- [ ] No error messages

**All checked?** 🎉 You're ready to use the system!

---

## 🎯 Next Steps

1. **Go to Invoices page** - http://localhost:5173/invoices
2. **Click "Create Invoice"**
3. **Follow the 5-minute guide above**
4. **Create 3-5 test invoices**
5. **Export each to PDF**
6. **Review the other features**
7. **Share with your team**

---

## 💬 Questions?

### Quick Questions
→ See **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Common issues section

### Detailed Questions
→ See **[TALLY_PRIME_TEMPLATE_GUIDE.md](TALLY_PRIME_TEMPLATE_GUIDE.md)** - Support section

### Technical Questions
→ See **[CODE_CHANGES.md](CODE_CHANGES.md)** - Implementation details

### Project Questions
→ See **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Project overview

### All Documentation
→ See **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete index

---

## 🎉 Congratulations!

You now have a **professional GST billing system** that:
- ✅ Generates Tally Prime-style invoices
- ✅ Tracks inventory automatically
- ✅ Calculates GST correctly
- ✅ Exports to PDF
- ✅ Prints on A4 paper
- ✅ Manages multiple invoices
- ✅ Tracks payments
- ✅ Provides detailed reporting
- ✅ Works without internet
- ✅ Stores data locally

**Ready to go live! 🚀**

---

**Start Now:** Go to http://localhost:5173 and click "Invoices" to create your first invoice!

**Time Estimate:** 5 minutes to first professional invoice ⏱️

**No setup required:** Everything pre-configured and ready to use! ✨

---

**Questions?** Open **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** for detailed help.

**Ready to learn more?** Open **[TALLY_PRIME_TEMPLATE_GUIDE.md](TALLY_PRIME_TEMPLATE_GUIDE.md)** for complete guide.

**Want all docs?** Open **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** for index.
