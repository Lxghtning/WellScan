
//Laods the page from where the user left the page on the Yaxis
window.onload = function () {
    if (localStorage.getItem('scrollPosition') !== null && localStorage.getItem('formData') !== null) {
        window.scrollTo(0, localStorage.getItem('scrollPosition'));
    }
}

//onclick event for the dropdown menu of the navigation bar
localStorage.setItem("drop", "none")
document.getElementById("log").addEventListener("click", () => {
    if (localStorage.getItem("drop") === "none") {
        localStorage.setItem("drop", "block")
        document.getElementById("condrop").style.display = "block";
    }
    else {
        localStorage.setItem("drop", "none");
        document.getElementById("condrop").style.display = "none";
    }
})

//Sorting the hours
function arrangeHours(arr) {
    const newArr = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        const prevHour = newArr[newArr.length - 1];
        let currHour = arr[i];
        while (currHour <= prevHour) {
            currHour += 24;
        }
        newArr.push(currHour);
    }
    return newArr;
}

// Initialize Firebase
var firebaseConfig = {

    apiKey: "AIzaSyCo2Fuxil6adrJXYvyw350ClCYKH1lUcMs",

    authDomain: "hackathon--23.firebaseapp.com",

    projectId: "hackathon--23",

    storageBucket: "hackathon--23.appspot.com",

    messagingSenderId: "596815595297",

    appId: "1:596815595297:web:84854bdb064d4737e66060",

    measurementId: "G-VMY2C911KT"

};




firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.firestore()

//check sif the users accounts exists or not
auth.onAuthStateChanged(user => {
    if (!user) {
        location.href = "/SignUp/signup.html"
        return;
    }

    else {


        let userid = user.uid

        //Fetching Collections and name of the patient
        let patientCollection = `patients${userid}`
        let innerhtmlCollection = `innerhtml${userid}`

        let patients = database.collection(patientCollection)
        let name_patient = localStorage.getItem("name_patient").split(" ")
        let innerhtml = database.collection(innerhtmlCollection)


        //preventing the default behaviour of the submit button
        document.getElementById("ptnf").addEventListener("submit", (e) => {
            e.preventDefault();
        })

        //SignOut
        document.getElementById("signout").addEventListener("click", () => {
            auth
                .signOut()
                .catch(err => console.log(err))
        })

        //Closing the popup
        document.getElementById("closebtn").addEventListener("click", () => {
            document.getElementById('popup').style.display = "none";
            document.getElementById('pop').style.display = "none";
            document.getElementById('tick').innerHTML = "done";
            document.getElementById('tick').style.color = 'greenyellow';
            document.getElementById('tick').style.border = '2px solid greenyellow';
            document.getElementById('view').style.display = "none";
            localStorage.setItem('scrollPosition', window.scrollY);
            location.reload();
        })

        document.getElementById("patientsubmit").addEventListener("click", () => {

            //PatientName
            let firstname_patient = document.getElementById("fpn").value;
            let lastname_patient = document.getElementById("lpn").value;

            //time
            let intime = document.getElementById("intym").value;
            let outtime = document.getElementById("outtym").value;

            //intake   
            let bp = document.getElementById("bloodP").value;
            let pulse = document.getElementById("Pulsepn").value;
            let oral_feed = document.getElementById("orngpn").value;

            //output
            let urine = document.getElementById("urpn").value;
            let stool = document.getElementById("stpn").value;
            let vomit = document.getElementById("vmpn").value;
            let suction = document.getElementById("scpn").value;

            //Checking if all the input data is entered
            array_inputs = [intime, outtime, bp, pulse, oral_feed, urine, stool, vomit, suction]
            for (var i = 0; i < array_inputs.length; i++) {
                if (array_inputs[i] === "") {

                    document.getElementById('pop').style.display = 'block';
                    document.getElementById('popup').style.display = 'block';
                    document.getElementById('popup').style.height = '270px';
                    document.getElementById('intext').innerHTML = "Please enter all the values!";
                    document.getElementById('tick').innerHTML = "close";
                    document.getElementById('tick').style.color = 'red';
                    document.getElementById('tick').style.border = '2px solid red';


                }
            }

            // Looping through the patients collection
            patients.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().first_name === firstname_patient && doc.data().last_name === lastname_patient) {

                        //Fetch the existing data
                        let bparr = doc.data().bparr;
                        let intimearr = doc.data().intimearr;
                        let pulsearr = doc.data().pulsearr;
                        let ofarr = doc.data().ofarr;
                        let outimearr = doc.data().outimearr;
                        let urinearr = doc.data().urinearr;
                        let stoolarr = doc.data().stoolarr;
                        let vomitarr = doc.data().vomitarr;
                        let suctionarr = doc.data().suctionarr;

                        bparr.push(parseInt(bp))
                        intimearr.push(parseInt(intime))
                        pulsearr.push(parseInt(pulse))
                        ofarr.push(parseInt(oral_feed))
                        outimearr.push(parseInt(outtime))
                        urinearr.push(parseInt(urine))
                        stoolarr.push(parseInt(stool))
                        vomitarr.push(parseInt(vomit))
                        suctionarr.push(parseInt(suction))

                        patients.doc(firstname_patient).update({
                            intime: parseInt(intime),
                            outputTime: parseInt(outtime),
                            bp: parseInt(bp),
                            pulse: parseInt(pulse),
                            oral_feed: parseInt(oral_feed),
                            urine: parseInt(urine),
                            stool: parseInt(stool),
                            vomit: parseInt(vomit),
                            suction: parseInt(suction),
                            bparr: bparr,
                            pulsearr: pulsearr,
                            ofarr: ofarr,
                            intimearr: intimearr,
                            outimearr: outimearr,
                            urinearr: urinearr,
                            stoolarr: stoolarr,
                            vomitarr: vomitarr,
                            suctionarr: suctionarr
                        })

                    }
                });

                generateIntakeChart(patients)
                generateOutputChart(patients)
            })

        })


        generateIntakeChart(patients)
        generateOutputChart(patients)
        //Generating Chart
        function generateIntakeChart(patients) {
            const ctx = document.getElementById('myChart').getContext('2d');
            let intimearr, bparr, pulsearr, ofarr, sortedIntimeArr;

            patients.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().first_name === document.getElementById("fpn").value && doc.data().last_name === document.getElementById("lpn").value || name_patient[0] === doc.data().first_name && name_patient[1] === doc.data().last_name) {
                        intimearr = doc.data().intimearr;
                        sortedIntimeArr = arrangeHours(intimearr)
                        bparr = doc.data().bparr;
                        pulsearr = doc.data().pulsearr;
                        ofarr = doc.data().ofarr;

                        const chart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: sortedIntimeArr,
                                datasets: [{
                                    label: 'Blood Pressure',
                                    data: bparr,
                                    borderColor: 'red',
                                    fill: false,
                                    tension: 0
                                }, {
                                    type: 'bar',
                                    label: 'Blood Pressure',
                                    data: bparr,
                                    backgroundColor: 'orange',
                                    borderWidth: 1,
                                    barPercentage: 0.6,
                                    categoryPercentage: 0.6,

                                },
                                {
                                    label: 'Pulse',
                                    data: pulsearr,
                                    borderColor: 'blue',
                                    fill: false,
                                    tension: 0
                                }, {
                                    type: 'bar',
                                    label: 'Pulse',
                                    data: pulsearr,
                                    backgroundColor: 'cyan',
                                    borderWidth: 1,
                                    barPercentage: 0.6,
                                    categoryPercentage: 0.6,

                                }, {
                                    label: 'Oral-Feed',
                                    data: ofarr,
                                    borderColor: 'green',
                                    fill: false,
                                    tension: 0,


                                }, {
                                    type: 'bar',
                                    label: 'Oral-Feed',
                                    data: ofarr,
                                    backgroundColor: 'rgb(144, 238, 144)',
                                    borderWidth: 1,
                                    barPercentage: 0.6,
                                    categoryPercentage: 0.6,
                                }]
                            },
                            options: {

                                maintainAspectRatio: false,
                                title: {
                                    display: true,
                                    text: 'Fluid Intake'
                                },
                                scales: {
                                    yAxes: [{
                                        offset: true,
                                    }],
                                    xAxes: [{
                                        offset: true,
                                    }],

                                }
                            }
                        })



                        // styling the chart
                        chart.canvas.parentNode.style.height = '470px';
                        chart.canvas.parentNode.style.width = '500px';
                        chart.canvas.parentNode.style.padding = '20px';
                        chart.canvas.parentNode.style.marginLeft = '20px';
                        chart.canvas.parentNode.style.marginTop = '-867px';

                        if (localStorage.getItem('current_graph') === 'output') {
                            // chart.canvas.parentNode.style.display = 'none';
                        }


                        //Updating the chart
                        chart.update();

                    }
                })
            }
            )
        }



        function generateOutputChart(patients) {
        let outimearr, urinearr, stoolarr, vomitarr, suctionarr, sortedOuttimearr;

        patients.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().first_name === document.getElementById("fpn").value && doc.data().last_name === document.getElementById("lpn").value || name_patient[0] === doc.data().first_name && name_patient[1] === doc.data().last_name) {
                    outimearr = doc.data().outimearr;
                    sortedOuttimearr = arrangeHours(outimearr)

                    urinearr = doc.data().urinearr;
                    stoolarr = doc.data().stoolarr;
                    vomitarr = doc.data().vomitarr;
                    suctionarr = doc.data().suctionarr;

                    //Generating Chart
                    const cx = document.getElementById('outputChart').getContext('2d');

                    const output_chart = new Chart(cx, {
                        type: 'line',
                        data: {
                            labels: sortedOuttimearr,
                            datasets: [{
                                label: 'Urine',
                                data: urinearr,
                                borderColor: 'rgba(255, 192, 0)',
                                fill: false,
                                tension: 0
                            }, {
                                type: 'bar',
                                label: 'Urine',
                                data: urinearr,
                                backgroundColor: 'red',
                                borderWidth: 1,
                                barPercentage: 0.6,
                                categoryPercentage: 0.6,
                            }, {
                                label: 'Stool',
                                data: stoolarr,
                                borderColor: 'brown',
                                tension: 0,
                                fill: false
                            }, {
                                type: 'bar',
                                label: 'Stool',
                                data: stoolarr,
                                backgroundColor: 'blue',
                                barPercentage: 0.6,
                                categoryPercentage: 0.6,
                            }, {
                                label: 'Vomit',
                                data: vomitarr,
                                borderColor: 'rgb(154,205,50)',
                                fill: false,
                                tension: 0
                            }, {
                                type: 'bar',
                                label: 'Vomit',
                                data: vomitarr,
                                backgroundColor: 'green',
                                barPercentage: 0.6,
                                categoryPercentage: 0.6,
                            },
                            {
                                label: 'Suction',
                                data: suctionarr,
                                borderColor: 'purple',
                                fill: false,
                                tension: 0

                            }, {
                                type: 'bar',
                                label: 'Suction',
                                data: suctionarr,
                                backgroundColor: 'yellow',
                                barPercentage: 0.6,
                                categoryPercentage: 0.6,
                            }]
                        },
                        options: {

                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: 'Fluid Output'
                            },
                            scales: {
                                yAxes: [{
                                    offset: true
                                }],
                                xAxes: [{
                                    offset: true
                                }],
                                y: {
                                    beginAtZero: true,
                                },
                                x: {
                                    beginAtZero: true,
                                },
                            }
                        }
                    })

                    // styling the chart
                    output_chart.canvas.parentNode.style.height = '470px';
                    output_chart.canvas.parentNode.style.width = '500px';
                    output_chart.canvas.parentNode.style.padding = '20px';
                    output_chart.canvas.parentNode.style.marginLeft = "565px";
                    output_chart.canvas.parentNode.style.marginTop = '-867px';
                    if (localStorage.getItem('current_graph') === 'intake') {
                        // output_chart.canvas.parentNode.style.display = 'none';
                    }
                    //Updating the chart
                    output_chart.update();


                }
            })
        }
        )
    }
        //Chart End

        if (localStorage.getItem('current_graph') === null) {
            localStorage.setItem('current_graph', 'intake');
        }

        //Patient Details displaying
        patients.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().first_name === document.getElementById("fpn").value && doc.data().last_name === document.getElementById("lpn").value || name_patient[0] === doc.data().first_name && name_patient[1] === doc.data().last_name) {
                    document.getElementById("ptH").innerHTML = "Details about " + name_patient[0] + " " + name_patient[1];

                    //Intake
                    document.getElementById("ptD8").textContent = `Last Intake Time Recorded:-  ${doc.data().intime} Hrs`
                    document.getElementById("ptD1").innerHTML = `Latest Blood Pressure Record:-  ${doc.data().bp}ml`;
                    document.getElementById("ptD2").textContent = `Latest Pulse Record:-  ${doc.data().pulse}ml`
                    document.getElementById("ptD3").textContent = `Latest Oral N.G Feed Record:-  ${doc.data().oral_feed}ml`

                    //Output
                    document.getElementById("ptD9").textContent = `Latest Output Time recorded:-  ${doc.data().outputTime} Hrs`
                    document.getElementById("ptD4").textContent = `Latest Urine Record:-  ${doc.data().urine}ml`
                    document.getElementById("ptD5").textContent = `Latest Stool Record:-  ${doc.data().stool}ml`
                    document.getElementById("ptD6").textContent = `Latest Vomit Record:-  ${doc.data().vomit}ml`
                    document.getElementById("ptD7").textContent = `Latest Suction Record:-  ${doc.data().suction}ml`



                }
            })
        })

        //Deleting Patients' details
        document.getElementById("remptn").addEventListener("click", () => {
            patients.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().first_name == name_patient[0]) {
                        patients.doc(name_patient[0]).delete();
                        innerhtml.doc(name_patient[0]).delete();
                    }

                })
            })

            document.getElementById("popup").style.display = "block";
            document.getElementById("pop").style.display = "block";
            document.getElementById("view").style.display = "block";
            document.getElementById("intext").style.display = "none";
            document.getElementById("closebtn").style.display = "none";
            document.getElementById("tick").style.marginTop = "50px";

        })
    }
})
