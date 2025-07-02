# CSV Property Import API (Backend)

**Technologies**: Node.js, Express, MongoDB, Redis, JWT, Multer  
**Features**: Bulk CSV Processing, Data Validation, Job Queue, Rate Limiting  

## Overview
Production-ready backend service for importing property listings from CSV files. Implements secure, high-performance batch processing with comprehensive error handling and job tracking.

## Note
The system requires Node.js 18+ and has been tested with:
- MongoDB 6.0+
- Redis 7.0+

## Technologies
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Job Queue**: Redis + BullMQ
- **Authentication**: JWT
- **File Processing**: Multer + csv-parser
- **Validation**: Joi
- **Logging**: Winston

## Key Features
✅ Secure CSV file uploads with size limits  
✅ Background job processing via Redis queue  
✅ Batch database inserts (1000 records/operation)  
✅ Comprehensive data validation  
✅ Detailed error reporting  
✅ Rate limiting (100 requests/15min)  
✅ JWT authentication  


## 🛠 Local Setup

1. **Prerequisites**  
   Ensure you have running instances of:
   ```bash
   MongoDB (mongod)
   Redis (redis-server)```
2. **Install Project**
    ```bash 
	cd task-2-refactor
	npm install```
3. **Create Env file** 
	```
	   PORT=7000
       MONGODB_URI=mongodb://localhost:27017/property-import ```
4. **Run the Project**
	```bash 
	npm run dev```
5. **Use the API localhost:7000/api/csv/upload** 
	
	   
	   
    
	
   

