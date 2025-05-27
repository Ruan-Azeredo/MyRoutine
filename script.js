const loki = require('lokijs');

// Criando o banco de dados e salvando em 'db.json'
const db = new loki('db.json', {
  autoload: true,
  autosave: true,
  autosaveInterval: 5000, // salva a cada 5 segundos automaticamente
  autoloadCallback: initDatabase
});

function initDatabase() {
  // Tenta obter a coleção 'usuarios'
  let usuarios = db.getCollection('usuarios');

  // Se não existir, cria a coleção
  if (!usuarios) {
    usuarios = db.addCollection('usuarios');
    console.log('Coleção criada.');
  }

  // Inserindo dados
  usuarios.insert({ nome: 'Alice', idade: 28 });
  usuarios.insert({ nome: 'Bruno', idade: 35 });

  // Mostrando dados
  console.log('Usuários cadastrados:', usuarios.find());

  // Salvando manualmente (opcional, já tem autosave)
  db.saveDatabase((err) => {
    if (err) {
      console.error('Erro ao salvar o banco:', err);
    } else {
      console.log('Banco salvo em db.json com sucesso!');
    }
  });
}