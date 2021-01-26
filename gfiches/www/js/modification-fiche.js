// Page de modification d'une fiche
// tvaira@free.fr

ModificationFiche = function ()
{
    this.connecte = "connecte";
    this.$pageModificationFiche = null;
    this.$boutonEnvoyer = null;
    this.$boutonAnnuler = null;
    this.$affichageErreurModification = null;
    this.$inputTitre = null;
    this.$inputDescription = null;
};

ModificationFiche.prototype.init = function ()
{
    this.$pageModificationFiche = $("#page-modification-fiche");
    this.$boutonEnvoyer = $("#bouton-envoyer", this.$pageModificationFiche);
    this.$boutonAnnuler = $("#bouton-annuler", this.$pageModificationFiche);
    this.$affichageErreurModification = $("#affichage-erreur-modification", this.$pageModificationFiche);    
    this.$inputTitre = $("#input-titre", this.$pageModificationFiche);
    this.$inputDescription = $("#input-description", this.$pageModificationFiche);
};

ModificationFiche.prototype.initialiserFormulaire = function (titre, description)
{
    var saisieInvalideStyle = "saisie-invalide";
    
    this.$affichageErreurModification.html("");
    this.$affichageErreurModification.hide();    
    this.$inputTitre.removeClass(saisieInvalideStyle);
    this.$inputTitre.val(titre);
    this.$inputDescription.removeClass(saisieInvalideStyle);
    this.$inputDescription.val(description);
};

// Modifie une fiche dans la base de données SQLite
ModificationFiche.prototype.modifierFiche = function (titre, description, nom)
{
    console.log('[gfiches] Modifier la fiche ' + titre);
    
    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    bdd.transaction(function(transaction)
    {
        var d = new Date();
        var requete = "UPDATE fiches SET titre = ?, description = ?, date = ?, nom = ?, export = ? WHERE titre = ?";
        transaction.executeSql(requete, [titre,description,d.toISOString(),nom,0,titre],
            function(transaction, result)
            {
            },
            function(transaction, error)
            {
                console.log('[gfiches] executeSql erreur : ' + error.message);
            }
        );
    },  function(error)
        {
            console.log('[gfiches] transaction erreur : ' + error.message);
            // Affiche une boîte de dialogue d'erreur
            $("#modification-erreur").popup("open");

            // Efface le formulaire
            modificationFiche.initialiserFormulaire();
        },
        function()
        {
            // Affiche la page fiches
            $.mobile.navigate("#fiches");
        });
};

// Gère la demande de modification d'une fiche
ModificationFiche.prototype.modifier = function ()
{    
    var saisieInvalide = false;
    var saisieInvalideStyle = "saisie-invalide";

    console.log('[gfiches] Demande de modification de la fiche');

    // Initialise les styles
    this.$affichageErreurModification.hide();
    this.$inputTitre.removeClass(saisieInvalideStyle);
    this.$inputDescription.removeClass(saisieInvalideStyle);

    // Est-ce que tous les champs demandés sont remplis ?
    if(this.$inputTitre.val().trim().length === 0)
    {
        this.$inputTitre.addClass(saisieInvalideStyle);
        saisieInvalide = true;
    }

    if(saisieInvalide)
    {
        this.$affichageErreurModification.html("<p>Il faut mettre un titre !</p>");
        this.$affichageErreurModification.addClass("erreur-saisie").slideDown();
        return;
    }

    // Connecté ?
    var nom = null;
    if(supportsLocalStorage())
    {   
        nom = window.localStorage.getItem(this.connecte);
        if(nom != null)
        {
            this.$affichageErreurModification.html("");
            this.$affichageErreurModification.hide();

            this.modifierFiche(this.$inputTitre.val().trim(), this.$inputDescription.val().trim(), nom);
        }
        else
        {
            this.$affichageErreurModification.html("<p>Il faut être connecté pour modifier une fiche !</p>");
            this.$affichageErreurModification.addClass("erreur-saisie").slideDown();
            return;
        }
    }
};

// Création de la page modification d'une fiche
$(document).delegate("#page-modification-fiche", "pagebeforecreate", function()
{
    // Active la gestion des boutons
    modificationFiche.$boutonEnvoyer.off("tap").on("tap", function ()
    {
        modificationFiche.modifier();
    });
    modificationFiche.$boutonAnnuler.off("tap").on("tap", function ()
    {
        $.mobile.navigate("#fiches");
    });
});
