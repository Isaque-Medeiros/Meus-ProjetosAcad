#define sinalVermelho 3
#define sinalAzul 4
#define sinalVerde 5
#define botao 2
// https://www.tinkercad.com/things/8Xt5vo2Z8Qu-neat-borwo-vihelmo
int contador = 0;
void setup()
{
 pinMode (sinalVermelho, OUTPUT);
 pinMode (sinalAzul,OUTPUT);
 pinMode (sinalVerde, OUTPUT);
 
 pinMode (botao, INPUT);
 
}

void loop()
{
  if(digitalRead(botao)== 1){
    contador = contador + 1;
    delay (200); // contador++ ou contador +=
  	if (contador == 1) {
    digitalWrite(sinalVermelho, 1);
	digitalWrite(sinalVerde, 0);
    digitalWrite(sinalAzul, 0);
    }
  
    if (contador == 2){
	digitalWrite(sinalVermelho, 0);
	digitalWrite(sinalVerde, 0);
    digitalWrite(sinalAzul, 1); 
    }
    
    if (contador == 3){
	digitalWrite(sinalVermelho, 0);
	digitalWrite(sinalVerde, 1);
    digitalWrite(sinalAzul, 0);
    }
      
    if (contador == 4){
	digitalWrite(sinalVermelho, 1);
	digitalWrite(sinalVerde, 0);
    digitalWrite(sinalAzul, 1);
    }
    
    if (contador == 5){
	digitalWrite(sinalVermelho, 1);
	digitalWrite(sinalVerde, 1);
    digitalWrite(sinalAzul, 0);
    }
        
    if (contador == 6){
	digitalWrite(sinalVermelho, 1);
	digitalWrite(sinalVerde, 1);
    digitalWrite(sinalAzul, 1);
      
   }
    if (contador == 7){
	digitalWrite(sinalVermelho, 0);
	digitalWrite(sinalVerde, 1);
    digitalWrite(sinalAzul, 1);
    (contador = 0);
    }
  }
}
 