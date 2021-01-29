// Enregistrer un utilisateur
// tvaira@free.fr

ConnexionUtilisateur = function ()
{
    this.connecte = "connecte";
    this.rememberMe = "rememberMe";
    this.$pageConnexionUtilisateur = null;
    this.$boutonEnvoyer = null;
    this.$affichageErreurConnexion = null;
    this.$inputUtilisateur = null;
    this.$inputPassword = null;
    this.$checkboxRememberMe = null;
};

ConnexionUtilisateur.prototype.init = function ()
{
    this.$pageConnexionUtilisateur = $("#page-connexion-utilisateur");
    this.$boutonEnvoyer = $("#bouton-envoyer", this.$pageConnexionUtilisateur);
    this.$affichageErreurConnexion = $("#affichage-erreur-connexion", this.$pageConnexionUtilisateur);
    this.$inputUtilisateur = $("#input-utilisateur", this.$pageConnexionUtilisateur);
    this.$inputPassword = $("#input-password", this.$pageConnexionUtilisateur);
    this.$checkboxRememberMe = $("#checkbox-rememberme", this.$pageConnexionUtilisateur);
};

ConnexionUtilisateur.prototype.initialiserFormulaire = function ()
{
    var saisieInvalideStyle = "saisie-invalide";
    
    this.$affichageErreurConnexion.html("");
    this.$affichageErreurConnexion.hide();
    this.$inputUtilisateur.removeClass(saisieInvalideStyle);
    this.$inputUtilisateur.val("");
    this.$inputPassword.removeClass(saisieInvalideStyle);
    this.$inputPassword.val("");
    this.$checkboxRememberMe.prop('checked', false).checkboxradio('refresh');
};

// Vérifie la connexion d'un utilisateur
ConnexionUtilisateur.prototype.verifier = function (nom, password, rememberme)
{
    console.log('[gfiches] Vérifier connexion : ' + nom);
    
    if(!supportsSqlitePlugin())
        return false;

    var bdd = null;
    bdd = window.sqlitePlugin.openDatabase({name: "fiches.db", location: 'default'});
    if(bdd == null)
        return false;

    bdd.transaction(function(transaction)
    {
        var hash = CryptoJS.SHA256(password); 
        transaction.executeSql('SELECT count(*) AS present FROM utilisateurs WHERE nom=? AND password=?', [nom, hash],
            function(transaction, result)
            {
                console.log('[gfiches] executeSql ok : present = ' + result.rows.item(0).present);
                if(result.rows.item(0).present == 0)
                {
                    // Affiche une boîte de dialogue d'erreur
                    $("#message-connexion-erreur").html("<p>Utilisateur inconnu !</p>");        
                    $("#connexion-erreur").popup("open");
                    connexionUtilisateur.initialiserFormulaire();
                    return;
                }
                // Enregistre localement la connexion
                if(supportsLocalStorage())
                {
                    window.localStorage.setItem("connecte", nom);
                    window.localStorage.setItem("rememberMe", rememberme);
                }
                // Affiche la page d'accueil
                $.mobile.navigate("#accueil");
            },
            function(transaction, error)
            {
                console.log('[gfiches] executeSql erreur : ' + error.message + ' !');
            }
        );        
    },  function(error)
        {
            // Affiche une boîte de dialogue d'erreur
            $("#message-connexion-erreur").html("<p>Erreur de connexion !</p>");        
            $("#connexion-erreur").popup("open");
            connexionUtilisateur.initialiserFormulaire();
        },
        function()
        {
        }
    );
};

// Gère la demande de connexion
ConnexionUtilisateur.prototype.connecter = function ()
{
    var saisieInvalide = false;
    var saisieInvalideStyle = "saisie-invalide";

    // Initialise les styles
    this.$affichageErreurConnexion.hide();
    this.$inputUtilisateur.removeClass(saisieInvalideStyle);
    this.$inputPassword.removeClass(saisieInvalideStyle);

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

    if(saisieInvalide)
    {
        this.$affichageErreurConnexion.html("<p>Il faut remplir tous les champs !</p>");
        this.$affichageErreurConnexion.addClass("erreur-saisie").slideDown();
        return;
    }

    this.$affichageErreurConnexion.html("");
    this.$affichageErreurConnexion.hide();

    // Ok on vérifie la connexion de cet utilisateur !
    this.verifier(this.$inputUtilisateur.val().trim(), this.$inputPassword.val().trim(), this.$checkboxRememberMe.prop("checked"));
};

// Création de la page connexion d'un utilisateur
$(document).delegate("#page-connexion-utilisateur", "pagebeforecreate", function()
{
    connexionUtilisateur.init();

    // Active le bouton "Se connecter"
    connexionUtilisateur.$boutonEnvoyer.off("tap").on("tap", function ()
    {
        connexionUtilisateur.connecter();
    });
});
