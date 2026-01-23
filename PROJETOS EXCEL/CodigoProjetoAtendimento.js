function onEdit(e) {
  // Define o nome da aba onde o usuário interage
  const abaEntrada = 'Pagina de busca'; 
  // Define o nome da aba onde os dados são salvos
  const abaDestino = 'Pagina de Sistema';

  const range = e.range;
  const sheet = range.getSheet();

  // Garante que a edição ocorreu na aba correta antes de prosseguir
  if (sheet.getName() !== abaEntrada) {
    return;
  }

  // --- Processo de Salvar Dados e Limpar ---
  // Verifica se a edição ocorreu na célula B10 (salva os dados e depois limpa)
  if (range.getA1Notation() === 'B10') {
    const ss = e.source;
    const sheetEntrada = ss.getSheetByName(abaEntrada);
    const sheetDestino = ss.getSheetByName(abaDestino);

    // Pega todos os valores do intervalo de entrada de uma vez
    const valoresDeEntrada = sheetEntrada.getRange('B5:B10').getValues();

    // Verifica se algum campo está vazio. Se sim, sai da função.
    for (let i = 0; i < valoresDeEntrada.length; i++) {
      if (valoresDeEntrada[i][0] === '') {
        // Se encontrar um campo vazio, o script para aqui.
        return; 
      }
    }

    // Se todos os campos estiverem preenchidos, continua com o processo de salvar
    const bp = valoresDeEntrada[0][0];
    const nome = valoresDeEntrada[1][0];
    const motivo = valoresDeEntrada[2][0];
    const codigo = valoresDeEntrada[3][0];
    const nota = valoresDeEntrada[4][0];
    const comentario = valoresDeEntrada[5][0];

    // Encontra a próxima linha vazia
    let proximaLinha = 2;
    while (sheetDestino.getRange('A' + proximaLinha).getValue() !== '') {
      proximaLinha++;
    }

    // Grava os dados na próxima linha vazia da aba de destino
    sheetDestino.getRange('A' + proximaLinha).setValue(bp);
    sheetDestino.getRange('B' + proximaLinha).setValue(nome);
    sheetDestino.getRange('C' + proximaLinha).setValue(codigo);
    sheetDestino.getRange('D' + proximaLinha).setValue(motivo);
    sheetDestino.getRange('E' + proximaLinha).setValue(nota);
    sheetDestino.getRange('H' + proximaLinha).setValue(comentario);

    // Limpa as células de entrada após registrar os dados
    sheetEntrada.getRange('B5:B10').clearContent();
    
    // Adiciona a fórmula na célula B6 após a limpeza
    sheetEntrada.getRange('B6').setFormula('=INDEX(AF:AF; MATCH(B5; AA:AA; 0))');

  // --- Processo de Limpeza Independente ---
  // Verifica se a edição ocorreu na célula G5 para apenas limpar
  } else if (range.getA1Notation() === 'G5') {
    const ss = e.source;
    const sheetEntrada = ss.getSheetByName(abaEntrada);
    sheetEntrada.getRange('B5:B10').clearContent();
    
    // Adiciona a fórmula na célula B6 após a limpeza
    sheetEntrada.getRange('B6').setFormula('=INDEX(AF:AF; MATCH(B5; AA:AA; 0))');
  }
}