# Aiven Connection Troubleshooting

## Current Configuration
- **Host:** auth-app-mysql-monica232004-f55d.i.aivencloud.com
- **Port:** 16189
- **Database:** defaultdb
- **User:** avnadmin

## DNS Resolution Failed

The hostname cannot be resolved. Please verify:

### 1. Check Aiven Console
1. Go to https://console.aiven.io/
2. Navigate to your MySQL service
3. Click on "Connection information" or "Overview"
4. Verify the exact hostname shown there

### 2. Common Aiven Hostname Formats
Aiven hostnames typically look like:
- `your-service-name.a.aivencloud.com`
- `your-service-name.i.aivencloud.com` (internal)
- `your-service-name.d.aivencloud.com` (public)

**Note:** The `.i.` subdomain might be for internal connections only.

### 3. Get Connection String from Aiven
1. In Aiven console, look for "Connection string" or "Connection parameters"
2. Copy the exact hostname shown
3. It might look like: `mysql://avnadmin:password@hostname:port/defaultdb?ssl-mode=REQUIRED`

### 4. Alternative: Use Connection String Format

If Aiven provides a connection string, we can use it directly. Update your `.env` file with the connection string format.

### 5. Check Service Status
- Ensure the Aiven MySQL service is running
- Check if there are any service alerts
- Verify the service is in "RUNNING" state

### 6. Network/Firewall
- Check if your network allows outbound connections
- Verify if your IP needs to be whitelisted in Aiven
- Some corporate networks block external database connections

## Next Steps

1. **Verify hostname in Aiven console** - Copy the exact hostname
2. **Update `.env` file** with the correct hostname
3. **Run test again:** `node test-connection.js`

If the hostname is different, update `backend/.env` with the correct value.
