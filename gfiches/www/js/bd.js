// Initialisation de la base de données SQLite
// tvaira@free.fr

function initialiserBaseDeDonnees()
{
    if(!supportsSqlitePlugin())
        return false;

    //console.log('[gfiches] initialiserBaseDeDonnees() start');

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        alert('Impossible d\'ouvrir la base de données fiches.db !');

    // Pour les tests : suppression de la table 'utilisateurs'
    /*bdd.transaction(function(transaction) {
        var requete = "DROP TABLE utilisateurs";
        transaction.executeSql(requete, [],
            function(transaction, result) {
                //Success
            },
            function(transaction, error) {
                alert('Erreur requête DROP : ' + error.message + ' !');
            }
        );
    });*/

    // Création de la table 'utilisateurs'
    bdd.transaction(function(transaction) {
        var requete = "CREATE TABLE IF NOT EXISTS utilisateurs (nom VARCHAR, password VARCHAR, UNIQUE(nom))";
        //var requete = "CREATE TABLE IF NOT EXISTS utilisateurs (nom VARCHAR, password VARCHAR, UNIQUE(nom) ON CONFLICT IGNORE)";
        transaction.executeSql(requete, [],
            function(transaction, result) {
                //Success
            },
            function(transaction, error) {
                alert('Erreur requête CREATE : ' + error.message + ' !');
            }
        );
    });

    // Pour les tests : insertion d'un utilisateur
    /*bdd.transaction(function(transaction) {
        var hash = CryptoJS.SHA256('a');
        var nom = "John";
        console.log('[gfiches] Insertion utilisateur : ' + nom);
        transaction.executeSql('INSERT INTO utilisateurs VALUES (?,?)', [nom, hash],
            function(transaction, result) {
                //Success
            },
            function(transaction, error) {
                console.log('Erreur requête sqlite : ' + error.message + ' !');
                alert('Erreur requête INSERT : ' + error.message + ' !');
            }
        );
    });*/

    // Pour les tests : suppression de la table 'fiches'
    /*bdd.transaction(function(transaction) {
        var requete = "DROP TABLE fiches";
        transaction.executeSql(requete, [],
            function(transaction, result) {
                //Success
            },
            function(transaction, error) {
                alert('Erreur requête sqlite : ' + error.message + ' !');
            }
        );
    });*/

    // Création de la table 'fiches'
    bdd.transaction(function(transaction) {
        var requete = "CREATE TABLE IF NOT EXISTS fiches (titre VARCHAR, description VARCHAR, date DATETIME, nom VARCHAR, export INTEGER DEFAULT 0, FOREIGN KEY(nom) REFERENCES utilisateurs(nom), UNIQUE(titre,nom))";
        transaction.executeSql(requete, [],
            function(transaction, result) {
                //Success
            },
            function(transaction, error) {
                alert('Erreur requête CREATE : ' + error.message + ' !');
            }
        );

        // Pour les tests : insertion d'une fiche
        /*var d = new Date();
        transaction.executeSql('INSERT INTO fiches VALUES (?,?,?,?,0)', ['Fiche 1', 'En cours ...', d.toISOString(), 'Toto'],
            function(transaction, result) {
                //Success
            },
            function(transaction, error) {
                alert('Erreur requête INSERT : ' + error.message + ' !');
            }
        );*/
    });

    //console.log('[gfiches] initialiserBaseDeDonnees() done');
}
