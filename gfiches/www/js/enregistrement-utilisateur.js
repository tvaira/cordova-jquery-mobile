// Enregistrer un utilisateur
// tvaira@free.fr

EnregistrementUtilisateur = function ()
{
    this.$pageEnregistrementUtilisateur = null;
    this.$boutonEnvoyer = null;
    this.$affichageErreurEnregistrement = null;
    this.$inputUtilisateur = null;
    this.$inputPassword = null;
    this.$inputPasswordConfirm = null;
};

EnregistrementUtilisateur.prototype.init = function ()
{
    this.$pageEnregistrementUtilisateur = $("#page-enregistrement-utilisateur");
    this.$boutonEnvoyer = $("#bouton-envoyer", this.$pageEnregistrementUtilisateur);
    this.$affichageErreurEnregistrement = $("#affichage-erreur-enregistrement", this.$pageEnregistrementUtilisateur);
    this.$inputUtilisateur = $("#input-utilisateur", this.$pageEnregistrementUtilisateur);
    this.$inputPassword = $("#input-password", this.$pageEnregistrementUtilisateur);
    this.$inputPasswordConfirm = $("#input-password-confirm", this.$pageEnregistrementUtilisateur);
};

EnregistrementUtilisateur.prototype.initialiserFormulaire = function ()
{
    var saisieInvalideStyle = "saisie-invalide";
    
    this.$affichageErreurEnregistrement.html("");
    this.$affichageErreurEnregistrement.hide();
    this.$inputUtilisateur.removeClass(saisieInvalideStyle);
    this.$inputUtilisateur.val("");
    this.$inputPassword.removeClass(saisieInvalideStyle);
    this.$inputPassword.val("");
    this.$inputPasswordConfirm.removeClass(saisieInvalideStyle);
    this.$inputPasswordConfirm.val("");
};

// Enregistre un nouvel utilisateur
EnregistrementUtilisateur.prototype.enregistrerUtilisateur = function (nom, password)
{
    console.log('[gfiches] Enregistre un nouvel utilisateur : ' + nom);
    
    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    bdd.transaction(function(transaction)
    {
        var hash = CryptoJS.SHA256(password);        
        transaction.executeSql('INSERT INTO utilisateurs VALUES (?,?)', [nom, hash],
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
            enregistrementUtilisateur.initialiserFormulaire();
        },
        function()
        {
            // Affiche une boîte de dialogue de succes
            //$("#enregistrement-succes").popup("open");
            // Affiche la page de connexion
            $.mobile.navigate("#page-connexion-utilisateur");
        }
    );
};

// Gère la demande d'enregistrement d'un utilisateur
EnregistrementUtilisateur.prototype.enregistrer = function ()
{
    var saisieInvalide = false;
    var saisieInvalideStyle = "saisie-invalide";

    // Initialise les styles
    this.$affichageErreurEnregistrement.hide();
    this.$inputUtilisateur.removeClass(saisieInvalideStyle);
    this.$inputPassword.removeClass(saisieInvalideStyle);
    this.$inputPasswordConfirm.removeClass(saisieInvalideStyle);

    // Est-ce que tous les champs demandés sont remplis ?
    if(this.$inputUtilisateur.val().trim().length === 0)
    {
        this.$inputUtilisateur.addClass(saisieInvalideStyle);
        saisieInvalide = true;
    }

    if(this.$inputPassword.val().trim().length === 0)
    {
        this.$inputPassword.addClass(saisieInvalideStyle);
        saisieInvalide = true;
    }

    if(this.$inputPasswordConfirm.val().trim().length === 0)
    {
        this.$inputPasswordConfirm.addClass(saisieInvalideStyle);
        saisieInvalide = true;
    }

    if(saisieInvalide)
    {
        this.$affichageErreurEnregistrement.html("<p>Il faut remplir tous les champs !</p>");
        this.$affichageErreurEnregistrement.addClass("erreur-saisie").slideDown();
        return;
    }

    // Est-ce que les deux mots de passe saisis sont identiques ?
    if(this.$inputPassword.val().trim() !== this.$inputPasswordConfirm.val().trim())
    {
        this.$affichageErreurEnregistrement.html("<p>Les deux mots de passe ne correspondent pas !</p>");
        this.$affichageErreurEnregistrement.addClass("erreur-saisie").slideDown();
        this.$inputPassword.addClass(saisieInvalideStyle);
        this.$inputPasswordConfirm.addClass(saisieInvalideStyle);
        return;
    }

    this.$affichageErreurEnregistrement.html("");
    this.$affichageErreurEnregistrement.hide();

    // Ok on enregistre l'utilisateur !
    this.enregistrerUtilisateur(this.$inputUtilisateur.val().trim(), this.$inputPassword.val().trim());
};

// Création de la page enregistrement d'un utilisateur
$(document).delegate("#page-enregistrement-utilisateur", "pagebeforecreate", function()
{
    enregistrementUtilisateur.init();

    // Active le bouton d'enregistrement
    enregistrementUtilisateur.$boutonEnvoyer.off("tap").on("tap", function ()
    {
        enregistrementUtilisateur.enregistrer();
    });
});
