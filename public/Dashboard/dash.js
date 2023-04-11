window.onload = function () {
    if (localStorage.getItem('scrollPosition') !== null && localStorage.getItem('formData') !== null) {
        window.scrollTo(0, localStorage.getItem('scrollPosition'));
    }
}

localStorage.setItem("drop", "none")
document.getElementById("log").addEventListener("click", ()=> {
    if(localStorage.getItem("drop") === "none"){
        localStorage.setItem("drop", "block")
        document.getElementById("condrop").style.display = "block";
    }
    else{
        localStorage.setItem("drop", "none");
        document.getElementById("condrop").style.display = "none";
    }
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

document.getElementById('anchorpt').addEventListener('click', () => {
    document.getElementById("ptnf").style.display = "block";
    document.getElementById("ptnfbg").style.display = "block";

})

document.getElementById("clbtn").addEventListener("click", () => {
    document.getElementById("ptnfbg").style.display = "block";
    document.getElementById("ptnf").style.display = "none";
    localStorage.setItem('scrollPosition', window.scrollY);
    location.reload();
})

document.getElementById("closebtn").addEventListener("click", () => {
    document.getElementById('popup').style.display = "none";
    document.getElementById('pop').style.display = "none";
    document.getElementById('intext').innerHTML = "Patient Added";
    document.getElementById('tick').innerHTML = "done";
    document.getElementById('tick').style.color = 'greenyellow';
    document.getElementById('tick').style.border = '2px solid greenyellow';
    localStorage.setItem('scrollPosition', window.scrollY);
    location.reload();
})


document.getElementById("ptnf").addEventListener("submit", (e) => {
    e.preventDefault();
})

document.getElementById("signout").addEventListener("click", () => {
    auth
        .signOut()
        .catch(err => console.log(err))
})

auth.onAuthStateChanged(function (user) {
    if(user){
    let userid = user.uid


    let patients = database.collection(`patients${userid}`)
    let innerhtmlCollection = database.collection(`innerhtml${userid}`)

    innerhtmlCollection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            newEL = document.createElement(doc.data().innertags)
            newEL.innerHTML = doc.data().innerwebel
            newEL.className = "severalhead"
            newEL.style.backgroundColor = "#D3D3D3"
            newEL.style.fontSize = "27px";
            newEL.style.color = "black";
            newEL.style.marginBottom = "30px";
            newEL.style.height = "50px";
            newEL.style.width = "1490px";
            newEL.style.borderRadius = "5px";
            newEL.style.textAlign = "center";
            newEL.style.border = "2px solid black";

            newEL.addEventListener("click", function (event) {
                localStorage.setItem("name_patient", event.target.innerHTML)
                location.href = "/Dashboard/dashgraph.html"

            })

            document.getElementById('pb').appendChild(newEL);
        })
    })


    document.getElementById("patientsubmit").addEventListener("click", () => {

    
        //patient
        let firstname_patient = document.getElementById("fpn").value;
        let lastname_patient = document.getElementById("lpn").value;
        let intime = document.getElementById("intym").value;
        let outtime = document.getElementById("outtym").value

        //intake
        let bp = document.getElementById("bloodP").value;
        let pulse = document.getElementById("Pulsepn").value;
        let oral_feed = document.getElementById("orngpn").value;

        //output
        let urine = document.getElementById("urpn").value;
        let stool = document.getElementById("stpn").value;
        let vomit = document.getElementById("vmpn").value;
        let suction = document.getElementById("scpn").value;

            array_inputs = [intime, outtime, bp, pulse, oral_feed, urine, stool, vomit, suction]
            for (var i = 0; i < array_inputs.length; i++) {
                if (array_inputs[i] === "") {
                    document.getElementById("ptnfbg").style.display = "block";
                    document.getElementById("ptnf").style.display = "none";
                    document.getElementById('pop').style.display = 'block';
                    document.getElementById('popup').style.display = 'block';
                    document.getElementById('popup').style.height = '270px';
                    document.getElementById('intext').innerHTML = "Please enter all the values!";
                    document.getElementById('tick').innerHTML = "close";
                    document.getElementById('tick').style.color = 'red';
                    document.getElementById('tick').style.border = '2px solid red';
                    return;

                }
            }
   
            innerhtmlCollection.where('innerwebel', '==', firstname_patient + ' ' + lastname_patient).get().then((querySnapshot) => {
                
                    if (querySnapshot.empty) {
                        

                        createNewElement()
                        viewVerificationPopup()

                        patients.doc(firstname_patient).set({
                            first_name: firstname_patient,
                            last_name: lastname_patient,
                            intime: parseInt(intime),
                            outputTime: parseInt(outtime),
                            bp: parseInt(bp),
                            pulse: parseInt(pulse),
                            oral_feed: parseInt(oral_feed),
                            urine: parseInt(urine),
                            stool: parseInt(stool),
                            vomit: parseInt(vomit),
                            suction: parseInt(suction),
                            bparr: [parseInt(bp)],
                            pulsearr: [parseInt(pulse)],
                            ofarr: [parseInt(oral_feed)],
                            intimearr: [parseInt(intime)],
                            outimearr: [parseInt(outtime)],
                            urinearr: [parseInt(urine)],
                            stoolarr: [parseInt(stool)],
                            vomitarr: [parseInt(vomit)],
                            suctionarr: [parseInt(suction)]
                        })
                    }
                
                else{
                querySnapshot.forEach((doc) => {

                        viewWrongPopup()
                    
                })
    }
})


    })

    function createNewElement() {
        let several_patients = document.createElement("h1");

        several_patients.className = "severalhead"
        several_patients.style.backgroundColor = "gray";
        several_patients.style.fontSize = "27px";
        several_patients.style.color = "black";
        several_patients.style.height = "50px";
        several_patients.style.width = "1300px";
        several_patients.style.borderRadius = "10px";
        several_patients.style.marginBottom = "30px";

        several_patients.innerHTML = document.getElementById("fpn").value + " " + document.getElementById("lpn").value
        several_patients.addEventListener("click", () => {
            location.href = "/Dashboard/dashgraph.html"
        })
        document.getElementById('pb').appendChild(several_patients);

        innerhtmlCollection.doc(document.getElementById("fpn").value).set({
            innertags: several_patients.tagName.toLowerCase(),
            innerwebel: several_patients.innerHTML,

        })
    }
}
})
function viewVerificationPopup() {
    document.getElementById('pop').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
    document.getElementById('ptnf').style.display = 'none';
    document.getElementById('ptnfbg').style.display = 'none';

};

function viewWrongPopup() {
    document.getElementById('pop').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
    document.getElementById('ptnf').style.display = 'none';
    document.getElementById('ptnfbg').style.display = 'none';
    document.getElementById('intext').innerHTML = "Patient already exists!";
    document.getElementById('tick').innerHTML = "close";
    document.getElementById('tick').style.color = 'red';
    document.getElementById('tick').style.border = '2px solid red';
}

