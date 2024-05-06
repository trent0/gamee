
#define VRX_PIN A0
#define VRY_PIN A1
#define SW_PIN 2

int ledPin = 9; 

int sensorValue = 0; 
int brightness = 0; 
int joyX = 0, joyY = 0, sw = 0;

const int numReadings = 10;

int xReadings[numReadings];  // the readings from the analog input
int yReadings[numReadings];
int readIndex = 0;          // the index of the current reading
float xTotal = 0, yTotal = 0;              // the running total
float xAverage = 0, yAverage = 0;            // the average
float xStart, yStart;
bool start = false;
unsigned long lastTime = 0;
const int interval = 16;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(SW_PIN, INPUT_PULLUP);

  for(int i = 0; i < numReadings; i++) {
    xReadings[i] = 0;
    yReadings[i] = 0;
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  int x = analogRead(VRX_PIN);
 
  int sw = digitalRead(SW_PIN);

  xTotal = xTotal - xReadings[readIndex];
  
  // read from the sensor:
  xReadings[readIndex] = x;
  
  // add the reading to the total:
  xTotal = xTotal + x;
 
  // advance to the next position in the array:
  readIndex = readIndex + 1;

  // calculate the average:
  xAverage = xTotal / numReadings;
  

  // if we're at the end of the array...
  if (readIndex >= numReadings) {
    // ...wrap around to the beginning:
    readIndex = 0;
    if (!start) {
      xStart = xAverage;
      
      start = true;
    }
  }
  sensorValue = analogRead(VRX_PIN); 
  brightness = map(sensorValue, 0, 1023, 0, 255); 
  analogWrite(ledPin, brightness); 

  if (sensorValue >= 900) { 
    digitalWrite(ledPin, HIGH); 
    
    digitalWrite(ledPin, LOW); 
    
  }

  if (start) {
    unsigned long now = millis();
    if (now - lastTime > interval) {
      //Serial.print("x = ");
      Serial.print((int) (xAverage-xStart));
      Serial.print(",");
      Serial.print((int) (yAverage-yStart));
      Serial.print(",");
      Serial.println(!sw);
    
      lastTime = now;
    }

    delay(150);
  }
}
