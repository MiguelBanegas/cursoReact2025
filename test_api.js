const BASE_URL = "https://api.mabcontrol.ar/api";
const ID = "6F7vdMbaWyMBO0TycOju"; // Existing ID
const NEW_ID = "XM3VKVu5h2NIjhE3vDid"; // The one we just created

async function testEndpoint(method, url, body = null) {
  console.log(`Testing ${method} ${url}...`);
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    console.log(`Status: ${response.status} ${response.statusText}`);
    if (response.ok) {
      const text = await response.text();
      console.log("Response:", text.substring(0, 100));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log("---");
}

async function run() {
  // 1. PUT with query param
  await testEndpoint("PUT", `${BASE_URL}/products?id=${ID}`, {
    nombre: "Test Update Query Param",
  });

  // 2. DELETE with path param (using the new ID to avoid deleting the main one if it works)
  // If NEW_ID doesn't exist (maybe I should check), but let's try.
  if (NEW_ID) {
    await testEndpoint("DELETE", `${BASE_URL}/products/${NEW_ID}`);
  }

  // 3. DELETE with query param
  if (NEW_ID) {
    await testEndpoint("DELETE", `${BASE_URL}/products?id=${NEW_ID}`);
  }
}

run();
