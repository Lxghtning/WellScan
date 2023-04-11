// Loads the page from where the user left scrolling
window.onload = function () {
    if (localStorage.getItem('scrollPosition') !== null && localStorage.getItem('formData') !== null) {
        window.scrollTo(0, localStorage.getItem('scrollPosition'));
    }
}

// Event Listener for the dropdown on the navigation bar
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

// Event listener for "Add new patient" text

document.getElementById('anchorpt').addEventListener('click', () => {
    document.getElementById("ptnf").style.display = "block";
    document.getElementById("ptnfbg").style.display = "block";

})
// Event listener for the close button in the add patient form
document.getElementById("clbtn").addEventListener("click", () => {
    document.getElementById("ptnfbg").style.display = "block";
    document.getElementById("ptnf").style.display = "none";
    localStorage.setItem('scrollPosition', window.scrollY);
    location.reload();
})

// Event listener for the "Submit" text in the add patient form
document.getElementById("closebtn").addEventListener("click", () => {
    document.getElementById('popup').style.display = "none";
    document.getElementById('pop').style.display = "none";
    document.getElementById('intext').innerHTML = "Patient Added"; //Pops up when patient is added successfully
    document.getElementById('tick').innerHTML = "done";
    document.getElementById('tick').style.color = 'greenyellow';
    document.getElementById('tick').style.border = '2px solid greenyellow';
    localStorage.setItem('scrollPosition', window.scrollY);
    location.reload();
})

// Submit listener for add patient form
document.getElementById("ptnf").addEventListener("submit", (e) => {
    e.preventDefault();
})

document.getElementById("signout").addEventListener("click", () => {
    auth
        .signOut()
        .catch(err => console.log(err))  //Error handler that prints any error
})

//User is redirected to sign up page if they arent logged in
auth.onAuthStateChanged(function (user) {
    if(!user){
        location.href = "/SignUp/signup.html" 
        return
    }else{
    let userid = user.uid 


    let patients = database.collection(`patients${userid}`) //Getting the patient's database
    let innerhtmlCollection = database.collection(`innerhtml${userid}`) //Getting the innerhtml database to show patient list

    innerhtmlCollection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => { // Iterating over each document in the collection.
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
                localStorage.setItem("name_patient", event.target.innerHTML) //Event listener for the patient button. Redirects to dashgraph
                location.href = "/Dashboard/dashgraph.html"

            })

            document.getElementById('pb').appendChild(newEL); //Appends the new created element to the HTML doc
        })
    })


    document.getElementById("patientsubmit").addEventListener("click", () => { //Executes after patient submits the form

    
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
                if (array_inputs[i] === "") { // Ensures no field is left empty
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

                        patients.doc(firstname_patient).set({ //Stores all the data to FireStore database
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

                        viewWrongPopup() // Ensures that a new patient with same name cannot be added
                    
                })
    }
})


    })

    function createNewElement() { // Creating a new element and storing the values in innerhtml collection
        let several_patients = document.createElement("h1");
        
        several_patients.className = "severalhead"
        several_patients.style.backgroundColor = "#D3D3D3";
        several_patients.style.fontSize = "27px";
        several_patients.style.color = "black";
        several_patients.style.height = "50px";
        several_patients.style.width = "1490px";
        several_patients.style.borderRadius = "5px";
        several_patients.style.marginBottom = "30px";
        several_patients.style.textAlign = "center";
        several_patients.style.border = "2px solid black";

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
function viewVerificationPopup() { //Pops up verification mark when patient is created successfully
    document.getElementById('pop').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
    document.getElementById('ptnf').style.display = 'none';
    document.getElementById('ptnfbg').style.display = 'none';

};

function viewWrongPopup() { // Pops up a cross mark when a petient which the same name as an existing patient is trying to be created.
    document.getElementById('pop').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
    document.getElementById('ptnf').style.display = 'none';
    document.getElementById('ptnfbg').style.display = 'none';
    document.getElementById('intext').innerHTML = "Patient already exists!";
    document.getElementById('tick').innerHTML = "close";
    document.getElementById('tick').style.color = 'red';
    document.getElementById('tick').style.border = '2px solid red';
}

