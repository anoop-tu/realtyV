# Supabase Storage Setup

## Create Storage Bucket for Property Images

1. Go to your Supabase Dashboard: https://yabdjurzgsobtoxfcmjp.supabase.co
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `property-images`
   - **Public bucket**: ✅ Check this box (so images are publicly accessible)
   - Click **Create bucket**

## Set Storage Policies (Optional but Recommended)

If you want more control over who can upload:

1. Click on the `property-images` bucket
2. Go to **Policies** tab
3. Add these policies:

### Policy 1: Public Read Access
```sql
CREATE POLICY "Public can read property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');
```

### Policy 2: Authenticated Upload (Admin only)
```sql
CREATE POLICY "Admins can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

### Policy 3: Admins can delete
```sql
CREATE POLICY "Admins can delete property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

## Verify Setup

Once the bucket is created, your PropertyForm component will be able to upload images automatically.

## CSV Upload Format

For bulk upload via CSV, use this format:

```csv
title,description,price,type,lat,lng,address,features,status
Luxury Villa,Beautiful 3BHK villa,5000000,sale,28.7041,77.1025,"123 Main St, Delhi","{""bedrooms"": 3, ""bathrooms"": 2}",active
Modern Apartment,2BHK in prime location,25000,rent,19.0760,72.8777,"456 Park Ave, Mumbai","{""bedrooms"": 2, ""bathrooms"": 1}",active
```

Note: The `features` column should be a JSON string.
