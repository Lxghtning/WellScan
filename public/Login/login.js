document.getElementById("closebtn").addEventListener("click", () => {
    document.getElementById('intext').innerHTML = " "
    document.getElementById('popup').style.display = "none";
    document.getElementById('pop').style.display = "none";
    document.getElementById('emailuser').style.display = "none";
    document.getElementById('tick').innerHTML = "close";
    document.getElementById('sub').style.display = "none";
    document.getElementById('tick').style.color = "red";
    document.getElementById('tick').style.border = '2px solid red';
    document.getElementById('emailuser').value = " ";
    
})
var firebaseConfig = {

    apiKey: "AIzaSyCo2Fuxil6adrJXYvyw350ClCYKH1lUcMs",

    authDomain: "hackathon--23.firebaseapp.com",

    projectId: "hackathon--23",

    storageBucket: "hackathon--23.appspot.com",

    messagingSenderId: "596815595297",

    appId: "1:596815595297:web:84854bdb064d4737e66060",

    measurementId: "G-VMY2C911KT"

};


// Initialize Firebase

firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();

auth.onAuthStateChanged(doctor => {
    if (doctor) {
        location.href = "/Dashboard/dash.html"
    }
})

//NAV change func
function tochange(x) {
    x.classList.toggle("change");
    x.classList.toggle("newnav");
}


//Form Fetcher
document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
})

document.getElementById("forgotpass").addEventListener("click", () => {
    document.getElementById('popup').style.display = "block";
    document.getElementById('pop').style.display = "block";
    document.getElementById('emailuser').style.display = "block";
    document.getElementById('sub').style.display = "block";
    document.getElementById('tick').innerHTML = "more_horiz";
    document.getElementById('tick').style.color = "greenyellow";
    document.getElementById('tick').style.border = '2px solid greenyellow';
})
try {
    document.getElementById("sub").addEventListener("click", () => {

        email = document.getElementById('emailuser').value;
        auth.sendPasswordResetEmail(email.trim()).then(function () {
            document.getElementById('popup').style.display = "block";
            document.getElementById('pop').style.display = "block";
            document.getElementById('emailuser').style.display = "none";

            document.getElementById('intext').innerHTML = "Email Sent!"
            document.getElementById('sub').style.display = "none";
            document.getElementById('tick').innerHTML = "done";
            document.getElementById('tick').style.color = "greenyellow";
            document.getElementById('tick').style.border = '2px solid greenyellow';
        }).catch(e => {
            if (typeof (e) === "object") {
                document.getElementById('emailuser').style.display = "none";
                document.getElementById('intext').innerHTML = "Email Address Invalid!"
                document.getElementById('sub').style.display = "none";
                document.getElementById('tick').innerHTML = "close";
                document.getElementById('tick').style.color = "red";
                document.getElementById('tick').style.border = '2px solid red';
                
            }
        })
    })
} catch (e) {
    if (e instanceof TypeError) { }
}
function formfunc(x) {
    let email = document.getElementById("email").value;
    let pass_word = document.getElementById("pw").value;


    auth
        .signInWithEmailAndPassword(email, pass_word).then(function () {
            location.href = "/Dashboard/dash.html"
        })
        .catch(err => {
            if (typeof (err) === "object") {
                document.getElementById('emailuser').style.display = "none";
                document.getElementById('tick').innerHTML = "close";
                document.getElementById('tick').style.color = "red";
                document.getElementById('tick').style.border = '2px solid red';
                document.getElementById('sub').style.display = "none";
                switch (err.code) {
                    case "auth/invalid-email":
                        document.getElementById('pop').style.display = 'block';
                        document.getElementById('popup').style.display = 'block';
                        document.getElementById('intext').innerHTML = "Incorrect Email!";
                        break;
                    case "auth/wrong-password":
                        document.getElementById('pop').style.display = 'block';
                        document.getElementById('popup').style.display = 'block';
                        document.getElementById('intext').innerHTML = "Incorrect Password!";
                        break;
                    case "auth/user-not-found":
                        document.getElementById('pop').style.display = 'block';
                        document.getElementById('popup').style.display = 'block';
                        document.getElementById('intext').innerHTML = "User Not Found!";
                        break;
                }

            }
        })
};