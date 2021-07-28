
const services = {
    passwdValidator: (v) => {
        let errMsg = "";
        const regex = {
            digit: /.*\d.*/g,
            lowercase: /.*[a-z].*/g,
            uppercase: /.*[A-Z].*/g,
            special: /.*[*.!@#$%^&(){}[\]:";'<>,.?/~`_+\-=|\\].*/g,
            space: /.*\s.*/g,
            min8: v => v.length >= 8,
        };
        
        if (regex.min8(v)) {
            if( !regex.digit.test(v) )
                errMsg += " 1 chiffre";
            if( !regex.lowercase.test(v))
                errMsg += " 1 lettre miniscule";
            if( !regex.uppercase.test(v))
                errMsg += " 1 lettre majuscule";
            if (!regex.special.test(v))
                errMsg += " 1 caractère spécial";
            if (regex.space.test(v))
                errMsg += "space";
        }
        else errMsg += " 8 caractères";

        if (errMsg)
            errMsg = `Le mot de passe doit contenir au moins ${errMsg}`;
        errMsg = /space/g.test(errMsg) ? "Caractére espace non autorisé !" : errMsg;

        return errMsg || true;     
    },
    emailValidator: (v) => {
        return !!v.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) || "L'adresse e-mail est invalide";
    },
    fieldValidator: (v) => {
        return !!v.match(/^\s*[0-9a-zA-ZÀ-ÿ]{2,}([\s|-]?[0-9a-zA-ZÀ-ÿ]{1,})*\s*$/g) || "Le champs est invalide";
    },
};

module.exports = services;