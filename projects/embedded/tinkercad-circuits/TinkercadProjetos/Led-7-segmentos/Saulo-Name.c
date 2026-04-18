// PRIGRAMA DE EXEMPLO
int vNumeros [][7] = {{1, 1, 1, 1, 1, 1, 0},// combinações para formar um caracter, sendo 1 para acender e 0 para apagar.
                     {0, 1, 1, 0, 0, 0, 0},// 1
                     {1, 1, 0, 1, 1, 0, 1},//2
                     {1, 1, 1, 1, 0, 0, 1},//3
                     {0, 1, 1, 0, 0, 1, 1},//4
                     {1, 0, 1, 1, 0, 1, 1},//5
                     {1, 0, 1, 1, 1, 1, 1},//6
                     {1, 1, 1, 0, 0, 0, 0},//7
                     {1, 1, 1, 1, 1, 1, 1},//8
                     {1, 1, 1, 1, 0, 1, 1},//9
                     {1, 1, 1, 0, 1, 1, 1},//A
                     {0, 0, 0, 1, 1, 1, 0},//L
                     {0, 1, 1, 1, 1, 1, 0}};//U

void setup()
{
  for(int nCont=2; nCont<9; nCont++)
  {
    pinMode(nCont, OUTPUT); //pinMode para usar a porta, sendo output ou input
    digitalWrite(nCont, 0);//Semelhante a Print, colocar o valor 1 de 2 a 8.
  }
   pinMode(14, OUTPUT); 
   digitalWrite(14, 0);
   pinMode(15, OUTPUT); 
   digitalWrite(15, 0);
   pinMode(16, OUTPUT); 
   digitalWrite(16, 0);
   pinMode(17, OUTPUT); 
   digitalWrite(17, 0);
  pinMode(18, OUTPUT); 
   digitalWrite(18, 0);
}

void loop()
{
  Escrever(5, 14);
  delay(10);
  Escrever(10, 15);
  delay(10);
  Escrever(12, 16);
  delay(10);
  Escrever(11, 17);
  delay(10);
  Escrever(0, 18);
  delay(10);

}

void Escrever(int nNum, int nDig)
{
  digitalWrite(14, 1);
  digitalWrite(15, 1);
  digitalWrite(16, 1);
  digitalWrite(17, 1);
  digitalWrite(18, 1);
  digitalWrite(nDig, 0);
  
  for(int nCont=2; nCont<9; nCont++)
    digitalWrite(nCont, vNumeros[nNum][nCont - 2]);
  
}
