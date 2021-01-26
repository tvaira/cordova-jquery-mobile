// Enregistrer une fiche
// tvaira@free.fr

EnregistrementFiche = function ()
{
    this.connecte = "connecte";
    this.$pageEnregistrementFiche = null;
    this.$boutonEnvoyer = null;
    this.$boutonAnnuler = null;
    this.$affichageErreurEnregistrement = null;
    this.$inputTitre = null;
    this.$inputDescription = null;
};

EnregistrementFiche.prototype.init = function ()
{
    this.$pageEnregistrementFiche = $("#page-enregistrement-fiche");
    this.$boutonEnvoyer = $("#bouton-envoyer", this.$pageEnregistrementFiche);
    this.$boutonAnnuler = $("#bouton-annuler", this.$pageEnregistrementFiche);
    this.$affichageErreurEnregistrement = $("#affichage-erreur-enregistrement", this.$pageEnregistrementFiche);    
    this.$inputTitre = $("#input-titre", this.$pageEnregistrementFiche);
    this.$inputDescription = $("#input-description", this.$pageEnregistrementFiche);
};

EnregistrementFiche.prototype.initialiserFormulaire = function ()
{
    var saisieInvalideStyle = "saisie-invalide";
    
    this.$affichageErreurEnregistrement.html("");
    this.$affichageErreurEnregistrement.hide();    
    this.$inputTitre.removeClass(saisieInvalideStyle);
    this.$inputTitre.val("");
    this.$inputDescription.removeClass(saisieInvalideStyle);
    this.$inputDescription.val("");
};

// Enregistre une nouvelle fiche
EnregistrementFiche.prototype.enregistrerFiche = function (titre, description, nom)
{
    console.log('[gfiches] Enregistre une nouvelle fiche : ' + titre);
    
    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    bdd.transaction(function(transaction)
    {
        var d = new Date();
        transaction.executeSql('INSERT INTO fiches VALUES (?,?,?,?,0)', [titre, description, d.toISOString(), nom],
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
            $("#enregistrement-erreur").popup("open");
            enregistrementFiche.initialiserFormulaire();
        },
        function()
        {
            // Affiche la page fiches
            $.mobile.navigate("#fiches");
        }
    );
};

// Gère la demande d'enregistrement d'une fiche
EnregistrementFiche.prototype.enregistrer = function ()
{
    var saisieInvalide = false;
    var saisieInvalideStyle = "saisie-invalide";

    // Initialise les styles
    this.$affichageErreurEnregistrement.hide();
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
        this.$affichageErreurEnregistrement.html("<p>Il faut mettre un titre !</p>");
        this.$affichageErreurEnregistrement.addClass("erreur-saisie").slideDown();
        return;
    }

    // Il faut être connecté !
    var nom = null;
    if(supportsLocalStorage())
    {   
        nom = window.localStorage.getItem(this.connecte);
        if(nom != null)
        {
            this.$affichageErreurEnregistrement.html("");
            this.$affichageErreurEnregistrement.hide();

            // Ok on enregistre la fiche !
            this.enregistrerFiche(this.$inputTitre.val().trim(), this.$inputDescription.val().trim(), nom);
        }
        else
        {
            this.$affichageErreurEnregistrement.html("<p>Il faut être connecté pour ajouter une fiche !</p>");
            this.$affichageErreurEnregistrement.addClass("erreur-saisie").slideDown();
            return;
        }
    }
};

// Création de la page enregistrement d'une fiche
$(document).delegate("#page-enregistrement-fiche", "pagebeforecreate", function()
{
    enregistrementFiche.init();

    // Active les boutons
    enregistrementFiche.$boutonEnvoyer.off("tap").on("tap", function ()
    {
        enregistrementFiche.enregistrer();
    });
    enregistrementFiche.$boutonAnnuler.off("tap").on("tap", function ()
    {
        $.mobile.navigate("#fiches");
    });
});
