lst = [97,128, 164, 187, 215, 255, 271, 314, 355, 428,                      
    471, 517, 618, 679, 706, 868, 889, 900,
    1089, 1227, 1296, 1392, 1427, 1641, 1768, 2081,
    2150, 2398, 2551, 2837, 3134, 3343, 3536, 3787,
    4274, 4873, 4963, 5326, 5860, 6645, 6721, 6978,
    7234, 8443, 8806, 9071, 9864, 10172, 10811, 11063,
    12835, 13359, 13870, 14165, 16126, 17502, 18434,
    20135, 20684, 21989, 24153, 28155, 28166, 29107,
    35206, 35584, 38136, 38177, 45784, 48006, 50019,
    52525, 55588, 58182, 68818, 72908, 75800, 79879,
    86627, 99418, 100312, 104658, 136282, 136785,
    152552, 178422, 208020, 234914, 366843
]


const bearingData = {
  black: {
    sizes: [97, 164, 271, 471, 679, 1089, 1641, 2551, 3787, 5326, 6721, 8443, 10811, 18434, 29107, 38177, 52525, 79879],
  },
  yellow: {
    sizes: [128, 215, 355, 618, 889, 1427, 2150, 3343, 4963, 6978, 8806, 11063, 14165, 24153, 38136, 50019, 68818, 104658],
  },
  blue: {
    sizes: [187, 314, 517, 900, 1296, 2081, 3134, 4873, 7234, 10172, 12835, 16126, 20684, 35206, 55588, 72908, 100312, 152552],
  },
  green: {
    sizes: [255, 428, 706, 1227, 1768, 2837, 4274, 6645, 9864, 13870, 17502, 21989, 28155, 48006, 75800, 99418, 136785, 208020],
  },
  red: {
    sizes: [517, 868, 1392, 2398, 3536, 5860, 9071, 13359, 20135, 28166, 35584, 45784, 58182, 86627, 136282, 178422, 234914, 366843],
  },
};

const sizeIndex = {
    "BR_95" : 0,
   "BR_115" : 1,
   "BR_135" : 2,
   "BR_155" : 3,
   "BR_179" : 4,
   "BR_206" : 5,
   "BR_236" : 6,
   "BR_276" : 7,
   "BR_306" : 8,
   "BR_336" : 9,
   "BR_366" : 10,
   "BR_406" : 11,
   "BR_446" : 12,
   "BR_506" : 13,
   "BR_556" : 14,
   "BR_636" : 15,
   "BR_716" : 16,
   "BR_826" : 17,
}


function calculateTorque(){
    var kilowatt = document.getElementById("kilowatt").value;               
    var rotationSpeed = document.getElementById("rotationSpeed").value;         
    var torque = ((kilowatt *  9550)/rotationSpeed);                       
    torqueResult = torque.toFixed(2) + " (Nm)";  
    return {
        torqueresultText: torqueResult,
        torqueResultNumeric: torque,
    };      

}

function getSafetyFactorValue(){
    var serviceFactor = document.getElementById("application").value; 
    var customServiceFactor = document.getElementById("customApplication").value.trim();

    if (customServiceFactor) {
        return customServiceFactor;
    } else if (serviceFactor && serviceFactor !== "default") {
        return serviceFactor;
    } else {
        throw new Error("Please select an application or enter a custom application.");
    }
};


function calculateAndSetCouplingRating() {
    try {
        var torque = calculateTorque().torqueResultNumeric;
        var serviceFactor = getSafetyFactorValue();

        if (isNaN(serviceFactor)) {
            throw new Error("Invalid service factor input");
        }
        var couplingRating = Math.round(torque * serviceFactor);
        var couplingRatingResult = couplingRating + " (Nm)";

        return {
            couplingRatingText: couplingRatingResult,
            couplingRatingNumeric: couplingRating,
        };
    } catch (error) {
        console.error("Error in calculateAndSetCouplingRating:", error.message);
        return {
            error: error.message,
        };
    }
}



function nextNearestValue() {
    
    x = calculateAndSetCouplingRating().couplingRatingNumeric;

    for(const elem of lst){
        if(x <= elem) {  
            const nextIndex = lst.indexOf(elem) + 1;
            if (nextIndex < lst.length) {            
                return {
                    firstRecommendation : elem,
                    secondrecommendation : lst[nextIndex],
                };    
            }              
        }        
    }
    return {
        firstRecommendation : elem,
        secondrecommendation : "none",
    }
}

function safetyFactor(nnv,torque){
    return (nnv/torque).toFixed(2);
}

function findColorAndSize(value) {
    for (const color in bearingData) {
      const sizes = bearingData[color].sizes;
      const index = sizes.indexOf(value);
      if (index !== -1) {
        const sizeKey = Object.keys(sizeIndex).find((key) => sizeIndex[key] === index);
        return {
          color: color.toUpperCase(),
          size: sizeKey,
        };
      }
    }
    return null;
}
  
function validateForm() {
    const kilowatt = document.getElementById('kilowatt').value;
    const rotationSpeed = document.getElementById('rotationSpeed').value;
    const application = document.getElementById('application').value;

    // Validate kilowatt
    if (!kilowatt || kilowatt <= 0) {
        alert('Please enter a valid Kilowatt value greater than 0.');
        return false;
    }

    // Validate rotation speed
    if (!rotationSpeed || rotationSpeed <= 0) {
        alert('Please enter a valid RPM value greater than 0.');
        return false;
    }

    // Validate application
    if (!application) {
        alert('Please select an Application.');
        return false;
    }

    return true;
}

function displayResults(){
    if (validateForm()) {
        var newVal = calculateAndSetCouplingRating();
        document.getElementById('torqueResult').value=calculateTorque().torqueresultText; 
        document.getElementById('coupRat').value=calculateAndSetCouplingRating().couplingRatingText;
        
        document.getElementById('brCouplingSuggest1').value=findColorAndSize(nextNearestValue().firstRecommendation).size + " - " + findColorAndSize(nextNearestValue().firstRecommendation).color;
        document.getElementById('brCouplingSuggest2').value=findColorAndSize(nextNearestValue().secondrecommendation).size + " - " + findColorAndSize(nextNearestValue().secondrecommendation).color;
        document.getElementById('sfCouplingSuggest1').value=safetyFactor(nextNearestValue().firstRecommendation, calculateTorque().torqueResultNumeric);
        document.getElementById('sfCouplingSuggest2').value=safetyFactor(nextNearestValue().secondrecommendation, calculateTorque().torqueResultNumeric);
    }
    
}


function clearTable() {
    document.getElementById('kilowatt').value = "";
    document.getElementById('rotationSpeed').value = "";
    document.getElementById('application').selectedIndex = 0;
    document.getElementById('customApplication').value = "";
    document.getElementById('torqueResult').value = "";
    document.getElementById('coupRat').value = "";
    document.getElementById('brCouplingSuggest1').value = "";
    document.getElementById('brCouplingSuggest2').value = "";
}

function validateInput(inputId) {
    var inputElement = document.getElementById(inputId);
    var inputValue = inputElement.value.trim();
    
    if (inputValue === "") {
        alert("Input cannot be empty.");
        return false;
    }
    
    if (!/^\d+$/.test(inputValue)) {
        alert("Input must contain only numbers.");
        return false;
    }
    
    return true;
}

function validateForm() {
    if (!validateInput("kilowatt") || !validateInput("rotationSpeed")) {
        return false;
    }
    return true;
} 
