// Lister les fiches
// tvaira@free.fr

Fiches = function ()
{
    this.$pageFiches = null;
    this.$boutonAjouter = null;
};

Fiches.prototype.init = function ()
{
    this.$pageFiches = $("#fiches");
    this.$boutonAjouter = $("#bouton-ajouter", this.$pageFiches);
};

Fiches.prototype.initialiserPage = function ()
{
};

// Supprime une fiche de la base de données SQLite
Fiches.prototype.supprimer = function (titre)
{
    console.log('[gfiches] Supprimer la fiche ' + titre);
    
    if(!estConnecte())
        return false;

    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    bdd.transaction(function(transaction)
    {
        var requete = "DELETE FROM fiches WHERE titre = ?";
        transaction.executeSql(requete, [titre],
            function(transaction, result)
            {
                //alert('executeSql ok : ' + titre + ' !');
                console.log('[gfiches] executeSql ok : ' + titre);
            },
            function(transaction, error)
            {
                //alert('executeSql erreur : ' + error.message + ' !');
                console.log('[gfiches] executeSql erreur : ' + error.message + ' !');
            }
        );        
    },  function(error)
        {
            //alert('transaction erreur : ' + error.message);
            console.log('[gfiches] transaction erreur : ' + error.message + ' !');
        },
        function()
        {
        }
    );
};

// Liste les fiches contenues dans la base de données SQLite
Fiches.prototype.lister = function () {
    console.log('[gfiches] Lister les fiches');
    
    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    bdd.transaction(function(transaction)
    {
        transaction.executeSql('SELECT titre,description,date,nom,export FROM fiches ORDER BY date DESC', [],
            function(transaction, result)
            {
                // Supprime l'ancienne liste
                $("#liste-fiches", "#fiches").html("");

                // Affiche le nombre de fiches
                var nb = '<li data-role="list-divider" data-theme="f">Fiches<span class="ui-li-count">' + result.rows.length + '</span></li>';
                $("#liste-fiches", "#fiches").append(nb);
                console.log('[gfiches] Nb fiches : ' + result.rows.length);

                // Parcourt les fiches récupérées
                for (var i=0; i<result.rows.length; i++) 
                {
                    // Récupère une fiche
                    var row = result.rows.item(i); // row['nom'] ou result.rows.item(i).nom

                    // Formate les données d'une fiche
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
                    var titre = row['titre'].replace(/\s/g, '');
                    var description = row['description'].replace(/\n/g, "<br />");
                    var exporte = "";
                    if(row['export'] == 1)
                        exporte = "PDF";
                    console.log('[gfiches] Fiche : ' + row['titre'] + ' - ' + row['description'] + ' - ' + row['nom']);                    
                    
                    // Crée un élément et l'ajoute à la liste à afficher
                    var item = '<li id="'+row['titre']+'" fiche="'+titre+'" data-icon="eye" class="li-fiche"><a href="#'+titre+'" data-transition="slide"><h3>'+row['titre']+'</h3><p>'+dateLocale+'</p><span class="ui-li-count">'+row['nom']+'</span><p class="ui-li-aside"><strong>'+exporte+'</strong></p></a></li>';
                    $("#liste-fiches", "#fiches").append(item);

                    // Crée une page pour cette fiche
                    var fiche = '<section id="'+titre+'" data-role="page" data-theme="a"><header data-role="header" data-position="fixed"><h1>LaSalle Avignon</h1><a href="#accueil" class="ui-btn-left" data-icon="home" data-iconpos="notext" data-transition="slide" data-direction="reverse">Accueil</a><a href="#apropos" class="ui-btn-right" data-icon="info" data-iconpos="notext">À propos</a></header><h2 class="center">'+row['titre']+'</h2><h3 class="center">Rédigé par '+row['nom']+'</h3><p class="center">Le '+dateLocale+'</p><div class="content" data-role="content"><p>'+description+'</p></div><footer data-role="footer" data-position="fixed" data-mini="true"><div data-role="navbar"><ul><li><a href="#fiches" data-role="button" data-icon="back">Retour</a></li><li><a href="" id="bouton-exporter" data-role="button" data-icon="action">Exporter</a></li><li><a href="" id="bouton-modifier" data-role="button" data-icon="edit">Modifier</a></li><li><a href="" id="bouton-supprimer" data-role="button" data-icon="delete">Supprimer</a></li></ul></div><p class="center">©&nbsp;2021&nbsp;tvaira.free.fr</p></footer></section>';
                    
                    // Supprime l'ancienne page de cette fiche
                    $("#"+titre).remove();
                    
                    // Ajoute la nouvelle page pour cette fiche
                    $("body").append(fiche);
                }

                // Met à jour l'affichage de la liste des fiches
                $("#liste-fiches", "#fiches").listview('refresh');

                // Active la gestion du clic sur une fiche
                $("#liste-fiches").off("tap").on("tap", "li", function(event)
                {
                    if($(this).attr("id").length > 0)
                    {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log('[gfiches] clic sur fiche : ' + $(this).attr("id") + ' - ' + $(this).attr("fiche"));

                        // Affiche la page de la fiche
                        $.mobile.navigate("#"+$(this).attr("fiche"));

                        // Crée et initialise la gestion d'une fiche
                        fiche = new Fiche();
                        fiche.init($(this).attr("id"),$(this).attr("fiche"));
                        // Active les actions possible sur une fiche
                        fiche.$boutonExporter.off("tap").on("tap", function ()
                        {
                            fiche.exporter();
                        });
                        fiche.$boutonModifier.off("tap").on("tap", function ()
                        {
                            fiche.modifier();
                        });
                        fiche.$boutonSupprimer.off("tap").on("tap", function ()
                        {
                            fiche.supprimer();
                        });
                    }
                });
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

// Création de la page fiches
$(document).delegate("#fiches", "pagebeforecreate", function()
{
    fiches.init();

    // Active le bouton "Ajouter" une fiche
    fiches.$boutonAjouter.off("tap").on("tap", function ()
    {
        // Affiche la page d'enregistrement d'une nouvelle fiche
        $.mobile.navigate("#page-enregistrement-fiche");
    });
});
