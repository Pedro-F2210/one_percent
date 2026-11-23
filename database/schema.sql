create database if not exists one_percent_db;

use one_percent_db;

CREATE TABLE if not exists utilizadores(
    id bigint AUTO_INCREMENT PRIMARY KEY,
    nome varchar(100) NOT NULL,
    email varchar(150) NOT NULL UNIQUE,
    senha_hash varchar(255) NOT NULL,
    objetivo_foco_minutos INT DEFAULT 60,
    dias_seguidos INT DEFAULT 0,
    melhor_registo_dias INT DEFAULT 0,
    criado_em timestamp default current_timestamp
);  

CREATE TABLE IF NOT EXISTS tarefas(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id BIGINT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    concluida BOOLEAN DEFAULT FALSE,
    data_tarefa DATE NOT NULL,
    criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progresso_diario(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_registo DATE NOT NULL, 
    minutos_focados INT DEFAULT 0,
    intencao_dia VARCHAR(255),
    UNIQUE KEY unico_utilizador_dia (utilizador_id, data_registo),
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS objetivos_mensais(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id BIGINT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    progresso_atual INT DEFAULT 0,
    meta_total INT NOT NULL,
    mes_ano VARCHAR(7) NOT NULL,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE
);