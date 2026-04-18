#define ledVermelho2 6
#define ledVermelho 2
#define ledAmarelo 4
#define ledVerde 3
#define ledVerde2 5
//  https://www.tinkercad.com/things/9phbRnrS6NN-led-pisca
void setup()
{
 pinMode(ledVermelho2, OUTPUT);
 pinMode(ledVermelho, OUTPUT); 
 pinMode(ledAmarelo, OUTPUT);
 pinMode(ledVerde, OUTPUT);
 pinMode(ledVerde2, OUTPUT);
 pinMode(4,OUTPUT);
}

void loop() 
{
  	digitalWrite(ledVermelho, 1);
  	digitalWrite(ledVerde2, 1);
  	delay(4000);
    digitalWrite(ledVermelho, 0);
	digitalWrite(ledVerde2, 0);
  	delay(1);
	semaforo();
}



void semaforo()
{
	piscaVermelho(100,200);
    piscaAmarelo(4000,200);
  	piscaVerde(2000,200);  	
}

void piscaVermelho(int pausa, int pausa2)
{
  digitalWrite(ledVermelho, 1);
  digitalWrite(ledVermelho2, 1);
  delay(600);
  digitalWrite(ledVermelho2, 0);
  delay(600);
  digitalWrite(ledVermelho2, 1);
  delay(600);
  digitalWrite(ledVermelho2, 0);
  delay(600);
  digitalWrite(ledVermelho2, 1);
  delay(600);
  digitalWrite(ledVermelho2, 0);
  delay(600);
  digitalWrite(ledVermelho2, 1);
  delay(600);
  digitalWrite(ledVermelho2, 0);
  delay(600);
  delay(pausa);
  digitalWrite(ledVermelho2, 1);
  digitalWrite(ledVermelho, 0);
  delay(pausa2);

}

void piscaVermelho2(int pausa, int pausa2)
{
  digitalWrite(ledVermelho2, 1);
  delay(pausa);
  digitalWrite(ledVermelho2, 0);
  delay(pausa2);

}

void piscaAmarelo(int pausa, int pausa2)
{
  digitalWrite(ledAmarelo, 1);
  delay(pausa);
  digitalWrite(ledAmarelo, 0);
  delay(pausa2);
}

void piscaVerde(int pausa, int pausa2) 
{ 
	digitalWrite(ledVerde, 1);
  	delay(pausa);
  	digitalWrite(ledVerde, 0);
    digitalWrite(ledVermelho2, 0);
  	delay(pausa2);
}