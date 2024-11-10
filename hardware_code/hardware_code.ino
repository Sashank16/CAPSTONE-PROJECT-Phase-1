#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_MLX90614.h>

// Replace with your WiFi credentials
const char* ssid = "Oppo F19";
const char* password = "Sash@123";

// Server endpoint
const char* serverUrl = "http:// 192.168.134.50:5000/sensor-data";

// Reporting interval
const unsigned long interval = 3000; // 5 seconds
unsigned long previousMillis = 0;

// MLX90614 sensor setup
Adafruit_MLX90614 mlx = Adafruit_MLX90614();

void setup() {
  Serial.begin(115200);
  
  // Initialize WiFi connection
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
  
  // Initialize MLX90614 sensor
  if (!mlx.begin()) {
    Serial.println("Error connecting to MLX sensor. Check wiring.");
    while (1);
  }
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Get actual temperature from MLX90614 sensor
    float bodyTemp = mlx.readObjectTempC();     // Object temperature

    // Generate random values for heart rate and SpO2
    float heartRate = random(70, 80); // example range for heart rate
    float spO2 = random(95, 100);      // example range for SpO2

    Serial.print("Heart Rate: "); Serial.println(heartRate);
    Serial.print("SpO2: "); Serial.println(spO2);
    Serial.print("Body Temp: "); Serial.println(bodyTemp);

    // Check if WiFi is still connected
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      // Create JSON payload with actual temperature and random heart rate, SpO2
      String payload = "{\"heartRate\":" + String(heartRate) +
                       ",\"spO2\":" + String(spO2) +
                       ",\"bodyTemp\":" + String(bodyTemp) + "}";

      int httpResponseCode = http.POST(payload);
      
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Data sent successfully: " + response);
      } else {
        Serial.println("Error sending data: " + String(httpResponseCode));
      }
      http.end();
    }
  }
}
