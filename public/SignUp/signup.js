document.getElementById("closebtn").addEventListener("click", () => {
    document.getElementById('popup').style.display = "none";
    document.getElementById('pop').style.display = "none";
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

const auth = firebase.auth();

const database = firebase.firestore()

//signout.onclick = () => auth.signOut

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


document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
})

//Form Fetcher
function formfunc(x) {
    let fstname_ = document.getElementById("fname").value;
    let lstname_ = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let pass_word = document.getElementById("pw").value;
    let confirm_Password = document.getElementById("cpw").value;


    if (pass_word != confirm_Password) {

        document.getElementById("wm").style.display = "block";
        document.getElementById("contactsubmit").style.marginTop = "40px";
        document.getElementById("redl").style.marginTop = "70px";

        setInterval(function () {
            document.getElementById("wm").style.display = "none"
            document.getElementById("contactsubmit").style.marginTop = "25px";
            document.getElementById("redl").style.marginTop = "30px";
        }, 3000);


    }

    else {
        auth
            .createUserWithEmailAndPassword(email, pass_word).then(function () { location.href = "/Dashboard/dash.html" })
            .catch(err => {
                if(typeof(err) === "object"){
                    switch(err.code){
                        case "auth/invalid-email": 
                        document.getElementById('pop').style.display = 'block';
                    document.getElementById('popup').style.display = 'block';
                    document.getElementById('intext').innerHTML = "Invalid Email!";
                        break;
                        case "auth/weak-password":
                        document.getElementById('pop').style.display = 'block';
                        document.getElementById('popup').style.display = 'block';
                        document.getElementById('intext').innerHTML = "Password must be of 6 characters!";
                        break;
                    }
                    
                }
            })
    }




};
