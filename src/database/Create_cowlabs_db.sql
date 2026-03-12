-- ETAPA 1 — Script de Criação da Base

CREATE DATABASE cowlabs_db;
GO

USE cowlabs_db;
GO

--Tabela de Usuários

CREATE TABLE tb_user (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    user_name VARCHAR(100),
    user_real_name VARCHAR(250),
    user_cpf VARCHAR(11),
    user_email VARCHAR(100) UNIQUE,
    user_senha VARCHAR(64),
    user_tipo VARCHAR(20),

    user_endereco VARCHAR(200),
    user_num VARCHAR(10),
    user_complemento VARCHAR(100),
    user_bairro VARCHAR(100),
    user_cidade VARCHAR(100),
    user_uf VARCHAR(2),
    user_cep VARCHAR(8),

    user_create_data DATETIME DEFAULT GETDATE()
);


GO

--Tabela de Cursos

CREATE TABLE tb_curso (
    curso_id INT IDENTITY(1,1) PRIMARY KEY,
    curso_name VARCHAR(150) NOT NULL
);

GO

--Relação Usuário ↔ Curso
CREATE TABLE tb_user_curso (
    tb_user_user_id INT,
    tb_curso_curso_id INT,

    PRIMARY KEY (tb_user_user_id, tb_curso_curso_id),

    FOREIGN KEY (tb_user_user_id)
        REFERENCES tb_user(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (tb_curso_curso_id)
        REFERENCES tb_curso(curso_id)
        ON DELETE CASCADE
);
GO

--Tabela de Demandas

CREATE TABLE tb_demandas (
    demanda_id INT IDENTITY(1,1) PRIMARY KEY,
    demanda_title VARCHAR(250),
    demanda_content VARCHAR(MAX),

    demanda_file VARBINARY(MAX),

    demanda_create_data DATETIME DEFAULT GETDATE(),

    tb_user_user_id INT,

    demandas_status VARCHAR(20),
    demandas_status_date DATETIME,

    FOREIGN KEY (tb_user_user_id)
        REFERENCES tb_user(user_id)
        ON DELETE SET NULL
);
GO

--Relação Demanda ↔ Curso

CREATE TABLE tb_demandas_curso (

    tb_demandas_demanda_id INT,
    tb_curso_curso_id INT,

    PRIMARY KEY (tb_demandas_demanda_id, tb_curso_curso_id),

    FOREIGN KEY (tb_demandas_demanda_id)
        REFERENCES tb_demandas(demanda_id)
        ON DELETE CASCADE,

    FOREIGN KEY (tb_curso_curso_id)
        REFERENCES tb_curso(curso_id)
        ON DELETE CASCADE
);
GO

-- Tags das Demandas
CREATE TABLE tb_tags (

    tag_id INT IDENTITY(1,1) PRIMARY KEY,
    tag_name VARCHAR(50)
);
GO
--relaçao demandas <-> tags

CREATE TABLE tb_demanda_tags (

    demanda_id INT,
    tag_id INT,

    PRIMARY KEY(demanda_id, tag_id),

    FOREIGN KEY(demanda_id)
        REFERENCES tb_demandas(demanda_id)
        ON DELETE CASCADE,

    FOREIGN KEY(tag_id)
        REFERENCES tb_tags(tag_id)
        ON DELETE CASCADE
);
GO

-- Comentários das Demandas
CREATE TABLE tb_coment (

    coment_id INT IDENTITY(1,1) PRIMARY KEY,
    demanda_id INT,
    user_id INT,

    coment_content VARCHAR(MAX),

    FOREIGN KEY (demanda_id)
        REFERENCES tb_demandas(demanda_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES tb_user(user_id)
        ON DELETE SET NULL
);
GO

--Certificados

CREATE TABLE tb_certificates (

    certificates_id INT IDENTITY(1,1) PRIMARY KEY,

    tb_user_user_id INT,
    tb_demandas_demanda_id INT,

    FOREIGN KEY (tb_user_user_id)
        REFERENCES tb_user(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (tb_demandas_demanda_id)
        REFERENCES tb_demandas(demanda_id)
        ON DELETE CASCADE
);
GO

-- Chamados de suporte

CREATE TABLE tb_chamados (

    chamado_id INT IDENTITY(1,1) PRIMARY KEY,

    chamado_user_name VARCHAR(250),
    chamado_user_email VARCHAR(100),
    chamado_user_tel VARCHAR(20),

    chamado_content VARCHAR(MAX),

    chamado_status VARCHAR(45),
    chamado_resp VARCHAR(MAX),

    tb_user_id INT,

    FOREIGN KEY (tb_user_id)
        REFERENCES tb_user(user_id)
        ON DELETE SET NULL
);
GO

--Comentários de chamados


CREATE TABLE tb_chamado_coment (

    chamado_coment_id INT IDENTITY(1,1) PRIMARY KEY,

    chamado_id INT,
    user_id INT,
    comentario TEXT,
    data_comentario DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (chamado_id)
        REFERENCES tb_chamados(chamado_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES tb_user(user_id)
);
GO

--logs do sistema


CREATE TABLE tb_log (

    log_id INT IDENTITY(1,1) PRIMARY KEY,

    log_date DATETIME DEFAULT GETDATE(),

    log_recurso_acessado VARCHAR(500),
    log_method VARCHAR(50),
    log_status_resp VARCHAR(50),

    tb_user_user_id INT,

    FOREIGN KEY (tb_user_user_id)
        REFERENCES tb_user(user_id)
        ON DELETE SET NULL
);
GO

--Anomalias de Log

CREATE TABLE tb_anomalias_log (

    anomalias_id INT IDENTITY(1,1) PRIMARY KEY,

    anomalia_descricao TEXT,
    anomalia_data DATETIME DEFAULT GETDATE()
);
GO;

go

-- log de performance
CREATE TABLE tb_performance_log (

    perf_id INT IDENTITY(1,1) PRIMARY KEY,

    perf_date DATETIME DEFAULT GETDATE(),

    perf_load_time INT,
    load_page VARCHAR(50),

    perf_user_browser VARCHAR(100),
    perf_user_OpSystem VARCHAR(100)
);
GO

-- inserindo os cursos necessários

INSERT INTO tb_curso (curso_name) VALUES
('Administração'),
('Arquitetura e Urbanismo'),
('Ciência da Computação'),
('Direito'),
('Educação Física'),
('Enfermagem'),
('Engenharia Ambiental'),
('Engenharia Civil'),
('Engenharia de Alimentos'),
('Engenharia de Computação'),
('Engenharia de Produção'),
('Engenharia Elétrica'),
('Engenharia Mecânica'),
('Engenharia Química'),
('Sistemas de Informação');

go

--Inserir os usuários principais (SEM criptografia)

INSERT INTO tb_user
(user_name,user_real_name,user_cpf,user_email,user_senha,user_tipo,
user_uf,user_cidade,user_endereco,user_num,user_complemento)

VALUES
('WesleyBalbino','Wesley Pinheiro Balbino','00000000000','202420243@unifoa.edu.br','202420243','Admin','uf','cidade','endereco','numero','complemento'),

('LucasAndrade','Lucas Nogueira Andrade','00000000000','202420312@unifoa.edu.br','202420312','Admin','uf','cidade','endereco','numero','complemento'),

('MarceloReis','Marcelo Ferreira Reis','00000000000','202420542@unifoa.edu.br','202420542','Admin','uf','cidade','endereco','numero','complemento'),

('PedroVieira','Pedro Vieira Carvalho','00000000000','202410630@unifoa.edu.br','202410630','Admin','uf','cidade','endereco','numero','complemento'),

('YuriMarch','Yuri Rocha March','00000000000','202420752@unifoa.edu.br','202420752','Admin','uf','cidade','endereco','numero','complemento'),

('MestreYoda','Jedi Master','00000000000','mestreyoda2@unifoa.edu.br','maytheforcebewithyou','Professor','uf','cidade','endereco','numero','complemento'),

('SkyWalker','Luke Skywalker','00000000000','skywalker@unifoa.edu.br','r2d2','Aluno','uf','cidade','endereco','numero','complemento');

go

--Gerar automaticamente mais 43 usuários

DECLARE @i INT = 1

WHILE @i <= 43
BEGIN

INSERT INTO tb_user
(user_name,user_real_name,user_cpf,user_email,user_senha,user_tipo,
user_uf,user_cidade,user_endereco,user_num,user_complemento)

VALUES(

'user'+CAST(@i AS VARCHAR),
'Usuario Teste '+CAST(@i AS VARCHAR),
RIGHT('00000000000'+CAST(@i AS VARCHAR),11),
'user'+CAST(@i AS VARCHAR)+'@email.com',
CONVERT(VARCHAR(64),HASHBYTES('SHA2_256','senha'+CAST(@i AS VARCHAR)),2),
'Aluno',
'RJ',
'Volta Redonda',
'Rua Teste',
CAST(@i AS VARCHAR),
'Apto'
)

SET @i = @i + 1
END
GO


--Inserir as demandas fornecidas
INSERT INTO tb_demandas
(demanda_title,demanda_content,tb_user_user_id,demandas_status)

VALUES

('Criar plano de negócios startup','Criar plano de negócios completo para startup',1,'aberta'),

('Projetar espaço urbano sustentável','Projeto urbano com áreas verdes',2,'aberta'),

('Sistema web de tarefas','Sistema web com autenticação',3,'aberta'),

('Petição inicial danos morais','Redigir petição inicial com jurisprudência',4,'aberta'),

('Plano treino idosos','Plano funcional para idosos',5,'aberta'),

('Protocolo cuidados diabetes','Protocolo enfermagem diabetes tipo 2',6,'aberta'),

('Redução resíduos bairro','Plano de redução resíduos urbanos',7,'aberta'),

('Projeto ponte pedestres','Estrutura ponte pedestres',8,'aberta'),

('Produto alimentício funcional','Novo alimento funcional',9,'aberta'),

('Reconhecimento facial python','Sistema reconhecimento facial',10,'aberta'),

('Fluxo produção fábrica','Melhorar fluxo produção',11,'aberta'),

('Circuito iluminação residencial','Projeto circuito eficiente',12,'aberta'),

('Simulação transmissão automotiva','Modelagem mecânica transmissão',13,'aberta'),

('Purificação água carvão','Purificação com carvão ativado',14,'aberta');

go

--Gerar demandas extras até chegar a 20

DECLARE @i INT = 1;

WHILE @i <= 20
BEGIN

    INSERT INTO tb_demandas
    (
        demanda_titulo,
        demanda_descricao,
        demanda_status,
        demanda_data_criacao
    )
    VALUES
    (
        CONCAT('Projeto de Pesquisa ', @i),
        CONCAT('Descrição detalhada do projeto ', @i),
        'Aberto',
        GETDATE()
    );

    SET @i = @i + 1;

END;
GO

--Gerar 100 comentários

DECLARE @i INT = 1;

WHILE @i <= 100
BEGIN

    INSERT INTO tb_coment
    (
        demanda_id,
        user_id,
        coment_content
    )
    VALUES
    (
        ABS(CHECKSUM(NEWID())) % 20 + 1,
        ABS(CHECKSUM(NEWID())) % 50 + 1,
        CONCAT('Comentario de teste numero ', @i)
    );

    SET @i = @i + 1;

END;

GO

--Gerar logs realistas
DECLARE @i INT = 1;

WHILE @i <= 200
BEGIN

    INSERT INTO tb_log
    (
        log_recurso_acessado,
        log_method,
        log_status_resp,
        tb_user_user_id
    )
    VALUES
    (
        CASE ABS(CHECKSUM(NEWID())) % 5
            WHEN 0 THEN '/login'
            WHEN 1 THEN '/demandas'
            WHEN 2 THEN '/perfil'
            WHEN 3 THEN '/comentarios'
            WHEN 4 THEN '/api/demandas'
        END,

        CASE ABS(CHECKSUM(NEWID())) % 3
            WHEN 0 THEN 'GET'
            WHEN 1 THEN 'POST'
            WHEN 2 THEN 'PUT'
        END,

        CASE ABS(CHECKSUM(NEWID())) % 4
            WHEN 0 THEN '200'
            WHEN 1 THEN '201'
            WHEN 2 THEN '400'
            WHEN 3 THEN '500'
        END,

        ABS(CHECKSUM(NEWID())) % 50 + 1
    );

    SET @i = @i + 1;

END;

GO

--Popular relação usuário ↔ curso

--Cada usuário será associado a 1 curso aleatório

DECLARE @i INT = 1;

WHILE @i <= 50
BEGIN

    INSERT INTO tb_user_curso
    (
        tb_user_user_id,
        tb_curso_curso_id
    )
    VALUES
    (
        @i,
        ABS(CHECKSUM(NEWID())) % 15 + 1
    );

    SET @i = @i + 1;

END;

GO


--Popular relação demanda ↔ curso

--Cada demanda será associada a um curso aleatório.

DECLARE @i INT = 1;

WHILE @i <= 20
BEGIN

    INSERT INTO tb_demandas_curso
    (
        tb_demandas_demanda_id,
        tb_curso_curso_id
    )
    VALUES
    (
        @i,
        ABS(CHECKSUM(NEWID())) % 15 + 1
    );

    SET @i = @i + 1;

END;

GO

--Gerar TAGs nas demandas

--Cada demanda terá 2 tags aleatórias.

DECLARE @i INT = 1;

WHILE @i <= 40
BEGIN

    INSERT INTO tb_tags
    (
        demanda_id,
        tag_id,
        tag_name
    )
    VALUES
    (
        ABS(CHECKSUM(NEWID())) % 20 + 1,
        @i,
        CASE ABS(CHECKSUM(NEWID())) % 10
            WHEN 0 THEN 'Pesquisa'
            WHEN 1 THEN 'Projeto'
            WHEN 2 THEN 'Sustentabilidade'
            WHEN 3 THEN 'Tecnologia'
            WHEN 4 THEN 'Saúde'
            WHEN 5 THEN 'Direito'
            WHEN 6 THEN 'Educação'
            WHEN 7 THEN 'Engenharia'
            WHEN 8 THEN 'Inovação'
            WHEN 9 THEN 'Comunidade'
        END
    );

    SET @i = @i + 1;

END;

GO

--Gerar chamados de suporte

--Simulando usuários abrindo chamados.

DECLARE @i INT = 1;

WHILE @i <= 30
BEGIN

    INSERT INTO tb_chamados
    (
        chamado_user_name,
        chamado_user_email,
        chamado_user_tel,
        chamado_content,
        chamado_status,
        tb_user_id
    )
    VALUES
    (
        CONCAT('Usuario', ABS(CHECKSUM(NEWID())) % 50 + 1),
        CONCAT('user', ABS(CHECKSUM(NEWID())) % 50 + 1, '@email.com'),
        CONCAT('(24)9', ABS(CHECKSUM(NEWID())) % 90000000 + 10000000),

        CASE ABS(CHECKSUM(NEWID())) % 5
            WHEN 0 THEN 'Erro ao acessar demanda'
            WHEN 1 THEN 'Problema ao enviar arquivo'
            WHEN 2 THEN 'Bug na página de login'
            WHEN 3 THEN 'Não consigo comentar'
            WHEN 4 THEN 'Erro ao atualizar perfil'
        END,

        CASE ABS(CHECKSUM(NEWID())) % 3
            WHEN 0 THEN 'aberto'
            WHEN 1 THEN 'em análise'
            WHEN 2 THEN 'resolvido'
        END,

        ABS(CHECKSUM(NEWID())) % 50 + 1
    );

    SET @i = @i + 1;

END;

GO


--Gerar logs de performance

--Simula páginas sendo carregadas por navegadores diferentes.

DECLARE @i INT = 1;

WHILE @i <= 300
BEGIN

    INSERT INTO tb_performance_log
    (
        perf_load_time,
        load_page,
        perf_user_browser,
        perf_user_OpSystem
    )
    VALUES
    (
        ABS(CHECKSUM(NEWID())) % 900 + 100,

        CASE ABS(CHECKSUM(NEWID())) % 6
            WHEN 0 THEN '/'
            WHEN 1 THEN '/login'
            WHEN 2 THEN '/demandas'
            WHEN 3 THEN '/perfil'
            WHEN 4 THEN '/dashboard'
            WHEN 5 THEN '/comentarios'
        END,

        CASE ABS(CHECKSUM(NEWID())) % 5
            WHEN 0 THEN 'Chrome'
            WHEN 1 THEN 'Firefox'
            WHEN 2 THEN 'Edge'
            WHEN 3 THEN 'Safari'
            WHEN 4 THEN 'Opera'
        END,

        CASE ABS(CHECKSUM(NEWID())) % 4
            WHEN 0 THEN 'Windows'
            WHEN 1 THEN 'Linux'
            WHEN 2 THEN 'Android'
            WHEN 3 THEN 'iOS'
        END
    );

    SET @i = @i + 1;

END;

GO