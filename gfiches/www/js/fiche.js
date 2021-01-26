// Gérer une fiche
// tvaira@free.fr

Fiche = function ()
{
    this.titre = null;
    this.$pageFiche = null;
    this.$boutonExporter = null;
    this.$boutonModifier = null;
    this.$boutonSupprimer = null;
    this.$affichageErreurEnregistrement = null;
    this.$inputTitre = null;
    this.$inputDescription = null;
};

Fiche.prototype.init = function (titre, f)
{
    this.titre = titre;
    this.$pageFiche = $("#"+f);
    this.$boutonExporter = $("#bouton-exporter", this.$pageFiche);
    this.$boutonModifier = $("#bouton-modifier", this.$pageFiche);
    this.$boutonSupprimer = $("#bouton-supprimer", this.$pageFiche);
    this.$affichageErreurEnregistrement = $("#affichage-erreur-enregistrement", this.$pageFiche);
    this.$inputTitre = $("#input-titre", this.$pageFiche);
    this.$inputDescription = $("#input-description", this.$pageFiche);
};

// Exporte une fiche au format PDF
Fiche.prototype.exporter = function ()
{
    console.log('[gfiches] Exporter au format PDF la fiche ' + this.titre);
    
    if(!supportsPDFPlugin() || !supportsFilePlugin())
        return false;
   
    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    var titre = this.titre;
    bdd.transaction(function(transaction)
    {
        transaction.executeSql('SELECT titre,description,date,nom,export FROM fiches WHERE titre = ?', [titre],
            function(transaction, result)
            {
                // Trouvée ?
                if(result.rows.length == 1)
                {
                    var row = result.rows.item(0);
                    console.log('[gfiches] Fiche -> ' + 'Titre : ' + row['titre'] + ' Description : ' + row['description'] + ' Nom : ' + row['nom']);
                    
                    var nomFichier = row['titre'] + ".pdf";
                    var description = row['description'].replace(/\n/g, "<br />");
                    var timestamp = Date.parse(row['date']);
                    var d = new Date();
                    d.setTime(timestamp);
                    var dateLocale = d.toLocaleString('fr-FR',{
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'});    
                    var options = {
                        documentsize: 'A4',
                        landscape: 'portrait',
                        type: 'base64' // type: 'share'        
                    };
                    
                    // Le contenu du document PDF
                    var pdfhtml = '<html><body style="font-size:120%"><h1 style="text-align:center;">'+row['titre']+'</h1><h3 style="text-align:center;">Rédigé par '+row['nom']+'</h3><p style="text-align:center;">Le '+dateLocale+'</p><p>'+description+'</p></body></html>';

                    // Export
                    pdf.fromData(pdfhtml, options)
                        .then(function(base64) {
                            var contentType = "application/pdf";            
                            //var chemin = "file:///storage/emulated/0/Download/";
                            var chemin = cordova.file.externalRootDirectory + "Download/"; // Android
                            if(cordova.platformId === 'ios') 
                            {
                                chemin = cordova.file.documentsDirectory; //cordova.file.applicationStorageDirectory; //cordova.file.cacheDirectory ou cordova.file.documentsDirectory
                            }
                            console.log('[gfiches] Export -> ' + chemin + nomFichier);
                            savebase64AsPDF(chemin, nomFichier, base64, contentType);
                        })
                        .catch((err)=>alert('Erreur export :' + err));

                    // Met à jour la fiche dans la base de données
                    var requete = "UPDATE fiches SET export = 1 WHERE titre = ?";
                    transaction.executeSql(requete, [titre]);
                    
                    // Retour vers la page fiches
                    $.mobile.navigate("#fiches");
                }
            },
            function(transaction, error)
            {
                console.log('[gfiches] executeSql erreur : ' + error.message + ' !');
            }
        );        
    },  function(error)
        {
            console.log('[gfiches] transaction erreur : ' + error.message);
        },
        function()
        {
        }
    );
};

// Récupère les données d'une fiche pour la modifier
Fiche.prototype.modifier = function ()
{
    console.log('[gfiches] Modifier la fiche ' + this.titre);
    
    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    var titre = this.titre;
    bdd.transaction(function(transaction)
    {
        // Récupère les données de la fiche
        transaction.executeSql('SELECT titre,description,date,nom,export FROM fiches WHERE titre = ?', [titre],
            function(transaction, result)
            {
                // Trouvée ?
                if(result.rows.length == 1)
                {
                    var row=result.rows.item(0);
                    console.log('[gfiches] Fiche -> ' + 'Titre : ' + row['titre'] + ' Description : ' + row['description'] + ' Nom : ' + row['nom']);

                    // Prépare la page de modification d'une fiche
                    modificationFiche = new ModificationFiche();
                    modificationFiche.init();
                    modificationFiche.initialiserFormulaire(row['titre'], row['description']);

                    // Affiche la page de modification d'une fiche
                    $.mobile.navigate("#page-modification-fiche");
                }
            },
            function(transaction, error)
            {
                console.log('[gfiches] executeSql erreur : ' + error.message + ' !');
            }
        );        
    },  function(error)
        {
            console.log('[gfiches] transaction erreur : ' + error.message);
        },
        function()
        {
        }
    );
};

// Supprime une fiche de la base de données SQLite
Fiche.prototype.supprimer = function ()
{
    console.log('[gfiches] Supprimer la fiche ' + this.titre);
    
    if(!estConnecte())
        return false;

    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    var titre = this.titre;
    bdd.transaction(function(transaction)
    {
        var requete = "DELETE FROM fiches WHERE titre = ?";
        transaction.executeSql(requete, [titre],
            function(transaction, result)
            {
                console.log('[gfiches] executeSql ok : ' + titre + ' !');                
            },
            function(transaction, error)
            {
                console.log('[gfiches] executeSql erreur : ' + error.message + ' !');
            }
        );        
    },  function(error)
        {
            console.log('[gfiches] transaction erreur : ' + error.message);
        },
        function()
        {
        }
    );

    // Affiche la page fiches
    $.mobile.navigate("#fiches");
};
