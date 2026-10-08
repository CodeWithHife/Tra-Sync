# TRA-SYNC

> **Real-Time Payment & Inventory Synchronization Platform**  
> Stop stock leakage. Verify payments before release.

TRA-SYNC bridges commercial banks, POS terminals, and physical inventory. It automatically holds stock until funds are 100% verified by bank webhooks, eliminating fake payment alerts, inventory loss, and manual end-of-day reconciliation.

---

## 🌟 Key Product Features

- **Real-Time Bank Verification**: Direct integration with commercial bank APIs ensures funds are locked and settled before transaction authorization.
- **Inventory Stock Locking**: Automatic stock reservation prevents double-selling and unauthorized item release during pending payments.
- **NIPOST Digital Postcode Location Verification**: Validates terminal operations within authorized geographical boundaries using official Nigerian Postal Service (NIPOST) digital postcodes.
- **AI Audit Engine**: Continuously monitors transaction flows to flag suspicious payment patterns, unverified receipts, and inventory mismatches.
- **Automated Reporting**: Generates and distributes encrypted EOD audit summaries directly to stakeholders.

---

## ⚡ The Verification Flow

```
CUSTOMER ➔ PAYMENT ➔ BANK ➔ TRA-SYNC ➔ POS ➔ INVENTORY
                                              │
                      SYSTEM STATUS: PAYMENT VERIFIED ➔ INVENTORY RELEASED
```

1. **Create Sale**: Cashier initiates a transaction at the point of sale.
2. **Generate Reference**: TRA-SYNC issues a unique reference (e.g., `TS-892`).
3. **Customer Pays**: Customer transfers funds using the reference as description/memo.
4. **Bank Confirms**: Instant webhook response directly from the commercial bank API.
5. **POS Updates**: POS screen updates to verified state without manual cashier refresh.
6. **Inventory Releases**: Real-time stock reservation releases the item for customer dispatch.

---

## 🗺️ Product Journey & Application Routes

```
Landing Page (/) ➔ Auth (/auth) ➔ Onboarding (/onboard) ➔ Dashboard (/dashboard) ➔ POS Screen (/pos)
```

### 1. Landing Page (`/`)
- Demonstrates real-time verification value proposition.
- Showcases NIPOST location verification, operational metrics, AI audit engine, and automated EOD reporting.

### 2. Authentication Portal (`/auth`)
- Secure single sign-on (OAuth with Google & Direct Business Email).
- Includes NIPOST Location Verification Policy agreement.

### 3. Merchant Onboarding (`/onboard`)
- **Business Profile**: Name, business type, contact info.
- **Location Verification**: Resolves NIPOST Digital Postcodes (e.g., `LA-100001-0842`).
- **Terminal Setup**: Configures POS hardware nodes and links location IDs.

### 4. Operational Dashboard (`/dashboard`)
- **Real-Time Metrics**: Today's Sales, Verified Transactions, Reserved Inventory, Active Alerts.
- **Live Activity Table**: Tracks transaction references, payment status (Verified vs. Pending), and stock release state (Released vs. Locked).
- **Modules**: Inventory Status, Payment Security, NIPOST Location Sync, AI Audit Center, EOD Reports.

### 5. POS Terminal (`/pos`)
- **Cart Summary**: Real-time total calculation and stock reservation.
- **Payment Screen**: Unique reference generation (`TS-892`), live bank confirmation listener.
- **Auto-Release**: Automatic transition to verified state and receipt printing upon 100% bank confirmation.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/CodeWithHife/Tra-Sync.git

# Navigate to the application directory
cd Tra-Sync/tra-sync-app

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### Building for Production

```bash
npm run build
npm run start
```

---

## 👥 Project Team Members

- **Oluwafemi Ajifowowe**
- **Obadimu Ifeoluwa**
- **Dosunmu Victor**
- **Monsur**

---

## 🛡️ License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
