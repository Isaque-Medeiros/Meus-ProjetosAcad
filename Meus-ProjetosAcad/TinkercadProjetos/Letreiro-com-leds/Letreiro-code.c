char vNum [][35] = 
   {{0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,
     1,1,1,1,1,1,1,         //I
     0,0,0,0,0,0,0,
     0,0,0,0,0,0,0},
     {1,0,0,1,1,1,1,
      1,0,0,1,0,0,1,
      1,0,0,1,0,0,1,         //S
      1,0,0,1,0,0,1,
      1,1,1,1,0,0,1},
    {1,1,1,1,1,1,1,
     1,0,0,1,0,0,0,
     1,0,0,1,0,0,0,          //A
     1,0,0,1,0,0,0,
     1,1,1,1,1,1,1},
    {0,1,1,1,1,0,0,
     1,0,0,0,0,1,0,
     1,0,0,0,1,1,1,          //Q
     1,0,0,0,0,1,0,
     0,1,1,1,1,0,1},
    {1,1,1,1,1,1,1,
     0,0,0,0,0,0,1,
     0,0,0,0,0,0,1,          //U
     0,0,0,0,0,0,1,
     1,1,1,1,1,1,1},
    {1,1,1,1,1,1,1,
     1,0,0,1,0,0,1,
     1,0,0,1,0,0,1,           //E
     1,0,0,1,0,0,1,
     1,0,0,1,0,0,1}};
 

int nAux, nCont, nCont2, volta;
void setup()
{
  for(nCont= 2; nCont<14; nCont++)
    pinMode(nCont, OUTPUT);
}
void loop()
{
  for (volta=0; volta<20; volta++){
  nAux = -7;
for(nCont=6; nCont>1; nCont--)
{
  nAux+= 7;
  fnApagar();
  digitalWrite(nCont, 0);
  for(nCont2=7; nCont2<14; nCont2++)
    digitalWrite(nCont2, vNum [0][(nCont2 - 7) + nAux]);
} 
  }
  for (volta=0; volta<20; volta++){
  nAux = -7;
  for(nCont=6; nCont>1; nCont--)
{
  nAux+= 7;
  fnApagar();
  digitalWrite(nCont, 0);
  for(nCont2=7; nCont2<14; nCont2++)
    digitalWrite(nCont2, vNum [1][(nCont2 - 7) + nAux]);
}
}
{
 
  for (volta=0; volta<20; volta++){
  nAux = -7;
  for(nCont=6; nCont>1; nCont--)
{
  nAux+= 7;
  fnApagar();
  digitalWrite(nCont, 0);
  for(nCont2=7; nCont2<14; nCont2++)
    digitalWrite(nCont2, vNum [2][(nCont2 - 7) + nAux]);
}
} 
}
  {
  for (volta=0; volta<20; volta++){
  nAux = -7;
  for(nCont=6; nCont>1; nCont--)
{
  nAux+= 7;
  fnApagar();
  digitalWrite(nCont, 0);
  for(nCont2=7; nCont2<14; nCont2++)
    digitalWrite(nCont2, vNum [3][(nCont2 - 7) + nAux]);
}
} 
  }
  {
  for (volta=0; volta<20; volta++){
  nAux = -7;
  for(nCont=6; nCont>1; nCont--)
{
  nAux+= 7;
  fnApagar();
  digitalWrite(nCont, 0);
  for(nCont2=7; nCont2<14; nCont2++)
    digitalWrite(nCont2, vNum [4][ (nCont2 - 7) + nAux]);
}
} 
  }
  {
 
  for (volta=0; volta<20; volta++){
  nAux = -7;
  for(nCont=6; nCont>1; nCont--)
{
  nAux+= 7;
  fnApagar();
  digitalWrite(nCont, 0);
  for(nCont2=7; nCont2<14; nCont2++)
    digitalWrite(nCont2, vNum [5][ (nCont2 - 7) + nAux]);
}
} 
  }
}
 
void fnApagar()
  {
  delay(25);
  for(nCont2= 2; nCont2< 7; nCont2++)
    digitalWrite(nCont2, 1);
  for(nCont2= 7; nCont2< 14; nCont2++)
    digitalWrite(nCont2, 0);
}