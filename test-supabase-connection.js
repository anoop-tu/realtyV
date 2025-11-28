const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not found');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Error: Environment variables not loaded properly');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n1. Testing basic connection...');
    
    // Test 1: Try to query properties table
    const { data, error, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      console.error('❌ Error querying properties:', error.message);
      return false;
    }

    console.log('✅ Connection successful!');
    console.log(`📊 Found ${count} properties in the database`);
    
    if (data && data.length > 0) {
      console.log('\n📋 Sample property:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('\n📋 No properties found in the database yet');
    }

    // Test 2: Check profiles table
    console.log('\n2. Testing profiles table...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profileError) {
      console.log('⚠️  Profiles table query:', profileError.message);
    } else {
      console.log('✅ Profiles table accessible');
    }

    // Test 3: Check media table
    console.log('\n3. Testing media table...');
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .limit(1);

    if (mediaError) {
      console.log('⚠️  Media table query:', mediaError.message);
    } else {
      console.log('✅ Media table accessible');
    }

    // Test 4: Check inquiries table
    console.log('\n4. Testing inquiries table...');
    const { data: inquiries, error: inquiriesError } = await supabase
      .from('inquiries')
      .select('*')
      .limit(1);

    if (inquiriesError) {
      console.log('⚠️  Inquiries table query:', inquiriesError.message);
    } else {
      console.log('✅ Inquiries table accessible');
    }

    console.log('\n✨ All connectivity tests completed!');
    return true;

  } catch (err) {
    console.error('\n❌ Unexpected error:', err.message);
    return false;
  }
}

testConnection();
