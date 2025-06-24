/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function RegisterPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    return {
        title: "Register",
    }
}

/**
    function hatPasswort8Zeichen(passwort){
        if (passwort.length < 8) {
            return false;
        }
        return true;
    }
    function hatPasswortGroßbuchstabe(passwort){
        const GROSSBUCHSTABEN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < passwort.length; i++) {
            const char = passwort[i];
            if (GROSSBUCHSTABEN.includes(char)) {
                return true;
            }
        }
        return false;
    }
    function hatPasswortKleinbuchstabe(passwort){
        const KLEINBUCHSTABEN = "abcdefghijklmnopqrstuvwxyz";
        for (let i = 0; i < passwort.length; i++) {
            const char = passwort[i];
            if (KLEINBUCHSTABEN.includes(char)) {
                return true;
            }
        }
        return false;
    }
    function hatPasswortZahl(passwort){
        const ZIFFERN = "0123456789";
        for (let i = 0; i < passwort.length; i++) {
            const char = passwort[i];
            if (ZIFFERN.includes(char)) {
                return true;
            }
        }
        return false;
    }
    function hatPasswortSpecialChar(passwort){
        const SPECIALCHAR = "!$%&/()=?{[]}*+~#-_<>@";
        for (let i = 0; i < passwort.length; i++) {
            const char = passwort[i];
            if (SPECIALCHAR.includes(char)) {
                return true;
            }
        }
        return false;
    }
    function makeFunctional(){
    document.getElementById('RegisterForm').addEventListener('input', function(event) {
            const input = event.target;
            if (input.type === 'text') {
                if (input.value.length >= 3) {
                    input.classList.add('valid');
                    input.classList.remove('invalid');
                } else {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                }
            } else if (input.type === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailPattern.test(input.value)) {
                    input.classList.add('valid');
                    input.classList.remove('invalid');
                } else {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                }
            }
        });
    }
    document.addEventListener("DOMContentLoaded", makeFunctional);
*/
    
