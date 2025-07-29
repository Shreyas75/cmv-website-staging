# Donation Management API Endpoints

## Authentication
All admin endpoints require admin credentials in the request body:
```json
{
  "username": "admin_username",
  "password": "admin_password"
}
```

## 1. Get Recent Donations (Paginated)
**Endpoint:** `POST /api/admin/donations/recent`

**Request Body:**
```json
{
  "username": "admin_username",
  "password": "admin_password",
  "page": 1,
  "limit": 20,
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "status": "completed",
  "reasonForDonation": "General Donation",
  "minAmount": 100,
  "maxAmount": 5000
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "donations": [
      {
        "_id": "donation_id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "9876543210",
        "panCardNumber": "ABCDE1234F",
        "state": "Maharashtra",
        "city": "Mumbai",
        "pinCode": "400001",
        "address": "123 Sample Street",
        "seek80G": "yes",
        "amount": 5000,
        "transactionId": "UPI123456789",
        "reasonForDonation": "Gurudakshina",
        "purpose": "For temple maintenance",
        "status": "completed",
        "createdAt": "2025-07-29T10:30:00.000Z",
        "updatedAt": "2025-07-29T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

## 2. Get Donation Statistics
**Endpoint:** `POST /api/admin/stats/donations`

**Request Body:**
```json
{
  "username": "admin_username",
  "password": "admin_password",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "status": "completed",
  "reasonForDonation": "General Donation",
  "minAmount": 100,
  "maxAmount": 5000
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalDonations": 150,
      "totalAmount": 250000,
      "avgAmount": 1666,
      "pendingCount": 5,
      "completedCount": 140,
      "failedCount": 5
    },
    "reasonBreakdown": [
      {
        "_id": "General Donation",
        "count": 80,
        "totalAmount": 120000
      },
      {
        "_id": "Gurudakshina",
        "count": 40,
        "totalAmount": 80000
      }
    ]
  }
}
```

## 3. Export Donations to CSV
**Endpoint:** `POST /api/admin/export/donations`

**Request Body:**
```json
{
  "username": "admin_username",
  "password": "admin_password",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "status": "completed",
  "reasonForDonation": "General Donation",
  "minAmount": 100,
  "maxAmount": 5000
}
```

**Response:**
- **Success (200):** CSV file download with proper headers
- **Error (401):** `{ "error": "Unauthorized" }`
- **Error (404):** `{ "error": "No donations found" }`
- **Error (500):** `{ "error": "Server error" }`

**CSV Format:**
```csv
Full Name,Email,Phone,PAN,State,City,Pin Code,Address,80G,Amount,Transaction ID,Reason,Purpose,Status,Date
John Doe,john@example.com,9876543210,ABCDE1234F,Maharashtra,Mumbai,400001,123 Sample Street,yes,5000,UPI123456789,Gurudakshina,For temple maintenance,completed,2025-07-29
```

## Database Schema (MongoDB)
```javascript
const donationSchema = {
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  panCardNumber: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pinCode: { type: String, required: true },
  address: { type: String, required: true },
  seek80G: { type: String, enum: ['yes', 'no'], required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true, unique: true },
  reasonForDonation: { type: String, required: true },
  purpose: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## Implementation Notes

### Backend Requirements:
1. **Authentication Middleware:** Verify admin JWT token
2. **CSV Generation:** Use libraries like `csv-writer` or `json2csv`
3. **Filtering:** MongoDB aggregation pipeline for complex filters
4. **Pagination:** Skip/limit with total count
5. **Error Handling:** Proper HTTP status codes and error messages

### Frontend Features:
1. **Real-time Filtering:** Apply filters without page reload
2. **Export Progress:** Show loading state during CSV generation
3. **Responsive Design:** Works on mobile and desktop
4. **Pagination:** Navigate through large datasets
5. **Statistics Dashboard:** Visual representation of donation data

### Security Considerations:
1. **Admin-only Access:** All endpoints require admin authentication
2. **Input Validation:** Sanitize and validate all filter inputs
3. **Rate Limiting:** Prevent abuse of export functionality
4. **Audit Logging:** Log all admin actions for compliance
