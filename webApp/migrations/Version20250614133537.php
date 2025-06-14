<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250614133537 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SEQUENCE guide_id_seq INCREMENT BY 1 MINVALUE 1 START 1
        SQL);
        $this->addSql(<<<'SQL'
            CREATE SEQUENCE visit_visiteur_id_seq INCREMENT BY 1 MINVALUE 1 START 1
        SQL);
        $this->addSql(<<<'SQL'
            CREATE SEQUENCE visite_id_seq INCREMENT BY 1 MINVALUE 1 START 1
        SQL);
        $this->addSql(<<<'SQL'
            CREATE SEQUENCE visiteur_id_seq INCREMENT BY 1 MINVALUE 1 START 1
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE guide (id INT NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, photo VARCHAR(255) NOT NULL, statut BOOLEAN NOT NULL, pays VARCHAR(255) NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE visit_visiteur (id INT NOT NULL, visite_id INT DEFAULT NULL, visiteur_id INT DEFAULT NULL, present BOOLEAN NOT NULL, commentaire TEXT DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_4BF359AFC1C5DC59 ON visit_visiteur (visite_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_4BF359AF7F72333D ON visit_visiteur (visiteur_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE visite (id INT NOT NULL, guide_id INT DEFAULT NULL, photo VARCHAR(255) NOT NULL, pays VARCHAR(255) NOT NULL, lieu VARCHAR(255) NOT NULL, date DATE NOT NULL, heure_debut TIME(0) WITHOUT TIME ZONE NOT NULL, duree INT NOT NULL, heure_fin TIME(0) WITHOUT TIME ZONE NOT NULL, commentaire TEXT NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B09C8CBBD7ED1D4B ON visite (guide_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE visiteur (id INT NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE visit_visiteur ADD CONSTRAINT FK_4BF359AFC1C5DC59 FOREIGN KEY (visite_id) REFERENCES visite (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE visit_visiteur ADD CONSTRAINT FK_4BF359AF7F72333D FOREIGN KEY (visiteur_id) REFERENCES visiteur (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE visite ADD CONSTRAINT FK_B09C8CBBD7ED1D4B FOREIGN KEY (guide_id) REFERENCES guide (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            DROP SEQUENCE guide_id_seq CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            DROP SEQUENCE visit_visiteur_id_seq CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            DROP SEQUENCE visite_id_seq CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            DROP SEQUENCE visiteur_id_seq CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE visit_visiteur DROP CONSTRAINT FK_4BF359AFC1C5DC59
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE visit_visiteur DROP CONSTRAINT FK_4BF359AF7F72333D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE visite DROP CONSTRAINT FK_B09C8CBBD7ED1D4B
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE guide
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE visit_visiteur
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE visite
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE visiteur
        SQL);
    }
}
