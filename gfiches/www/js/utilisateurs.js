// Lister les utilisateurs
// tvaira@free.fr

var id_utilisateur = ""; // à supprimer

Utilisateurs = function ()
{
    this.connecte = "connecte";
};

Utilisateurs.prototype.init = function ()
{
};

Utilisateurs.prototype.initialiserPage = function ()
{
};

// Supprime un utilisateur de la base de données
Utilisateurs.prototype.supprimer = function (nom)
{
    console.log('[gfiches] Supprimer utilisateur ' + nom);
    
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
        var requete = "DELETE FROM utilisateurs WHERE nom = ?";
        transaction.executeSql(requete, [nom],
            function(transaction, result)
            {
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
        function() {
        }
    );
};

// Liste les utilisateurs
Utilisateurs.prototype.lister = function ()
{
    console.log('[gfiches] Lister les utilisateurs');
   
    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    bdd.transaction(function(transaction)
    {
        // Récupère les utilisateurs et leur nombre de fiches
        transaction.executeSql('SELECT utilisateurs.nom AS nom, COUNT(DISTINCT fiches.titre) AS nbfiches FROM fiches INNER JOIN utilisateurs ON utilisateurs.nom=fiches.nom GROUP BY fiches.nom', [],
            function(transaction, result)
            {
                // Efface la liste précédente
                $("#liste-utilisateurs", "#utilisateurs").html("");

                // Affiche le nombre d'utilisateurs
                var nb = '<li data-role="list-divider" data-theme="f">Utilisateurs<span class="ui-li-count">' + result.rows.length + '</span></li>';
                $("#liste-utilisateurs", "#utilisateurs").append(nb);

                // Parcourt les utilisateurs récupérés
                for (var i=0; i<result.rows.length; i++) 
                {   
                    var row = result.rows.item(i); // row['nom'] ou result.rows.item(i).nom

                    // Crée un élément et l'ajoute à la liste à afficher
                    var item = '<li id="'+row['nom']+'" data-icon="delete"><a href="" data-transition="slide"><h3>'+row['nom']+'</h3></p><span class="ui-li-count">' + row['nbfiches'] + ' fiche(s)</span></a></li>';             
                    $("#liste-utilisateurs", "#utilisateurs").append(item);
                }

                // Met à jour la liste à afficher
                $("#liste-utilisateurs", "#utilisateurs").listview('refresh');

                // Active la suppression d'un utilisateur lors d'un clic sur l'élément de la liste
                $("#liste-utilisateurs").off("tap").on("tap", "li", function(event)
                {
                    // Il faut être connecté !
                    if(!estConnecte())
                        return;
                    // L'id de l'utilisateur
                    if($(this).attr("id").length > 0)
                    {
                        event.preventDefault();
                        event.stopPropagation();
                        id_utilisateur = $(this).attr("id");
                        console.log('[gfiches] Suppression id = ' + id_utilisateur);
                        // Demande la confirmation                        
                        $("#confirmation-suppresion").popup("open");                        
                        // Supprime l'élément de la base de données
                        //utilisateurs.supprimer($(this).attr("id"));
                        // Supprime l'élément de la liste
                        //$(this).remove();
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

// Création de la page utilisateurs
$(document).delegate("#utilisateurs", "pagebeforecreate", function(){
    utilisateurs.init();
});

$( '#confirmation-suppresion' ).on({
    popupafteropen: function() {
        $("#bouton-oui").on("click", function () {
            //console.log('[gfiches] confirmation-suppresion : OUI ' + id_utilisateur);
            if(id_utilisateur.length > 0)
            {
                // Supprime l'élément de la base de données
                utilisateurs.supprimer(id_utilisateur);
            }
        });
        $("#bouton-non").on("click", function () {
            //console.log('[gfiches] confirmation-suppresion : NON ' + id_utilisateur);
        });
    },
    popupafterclose: function() {
        // Recharge la page
        $(":mobile-pagecontainer").pagecontainer("change", "index.html#utilisateurs",
        {
            reload: false,
            allowSamePageTransition: true,
            transition: "none"
        });
    }
});
