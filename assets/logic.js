var firstTrainDeparts;
var trainEvery__Minutes;
var timeRightNow;
var nextTrain;
var trainIntervals;
var destination = "";
var trainName = "";
var difference = "";
var datePlaceholder = moment().format("YYYY MM DD") + " ";



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDeFrrutdIisAHoSXQhoxDQ3iZ0JbdCyjM",
    authDomain: "train-schedule-4ffc8.firebaseapp.com",
    databaseURL: "https://train-schedule-4ffc8.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "594114847906"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//click Functions
  		$("#addTrain").on("click", function() {
  			//Capture user inputs and store into variables
  			trainName = $('#trainNameinput').val().trim(); 
  			firstTrainDeparts = $('#firstTrainTimeinput').val().trim(); 
			destination = $('#destinationinput').val().trim(); 
			trainEvery__Minutes = $('#frequencyinput').val().trim(); 
			
			// creating a string with the current day and time of first train departure
			datePlaceholder += firstTrainDeparts;

			// current time when user hits submit button
			timeRightNow = moment();
			
			var startTimeInMins = moment(new Date(datePlaceholder));

			console.log(moment(startTimeInMins).format("HH:mm"));
			console.log(moment().format("HH:mm"));
			console.log(startTimeInMins.diff(timeRightNow, "minutes"));
			
			// Checking if first train is coming after right now
			if (startTimeInMins.diff(timeRightNow, "minutes") >= 0) {
				nextTrain = moment(startTimeInMins).format("HH:mm");
				difference = startTimeInMins.diff(moment(), "minutes");

			}

			else {
				while (startTimeInMins.diff(timeRightNow, "minutes") < 0) {
					trainIntervals = startTimeInMins.add(trainEvery__Minutes, 'minutes');
					console.log(startTimeInMins.diff(timeRightNow, "minutes"));
					console.log(moment(trainIntervals).format("HH:mm"));
				}
				difference = moment(trainIntervals).diff(timeRightNow, "minutes");
				console.log("the time between next train and now: " + difference);
				var nextTrainAvailable = timeRightNow.add(difference, 'minutes');
				nextTrain = moment(nextTrainAvailable).add(1, 'minutes').format("HH:mm");
				console.log("the next train is at: " + nextTrain);
			}

			database.ref().push({
				name: trainName,
				depart: firstTrainDeparts,
				destination: destination,
				frequency: trainEvery__Minutes
			});


			$('#trainNameinput').val(""); 
			$('#firstTrainTimeinput').val(""); 
			$('#destinationinput').val(""); 
			$('#frequencyinput').val(""); 

			// reset datePlaceholder
			datePlaceholder = moment().format("YYYY MM DD") + " ";

			return false;
			

  		});


		database.ref().on('child_added', function(childsnapshot) {
			var nameForDisplay = childsnapshot.val().name
			var departForDisplay = childsnapshot.val().depart
			var destinationForDisplay = childsnapshot.val().destination
			var frequencyForDisplay = childsnapshot.val().frequency


			var newTrain = $('<tr>');
			var newName = $('<td>');
			var newDestination = $('<td>');
			var newDepart = $('<td>');
			var newFrequency = $('<td>');
			var newNextArrival = $('<td>');
			var newMinutesAway = $('<td>');
			
			
			newName.text(nameForDisplay);
			newDestination.text(destinationForDisplay);
			newDepart.text(departForDisplay);
			newFrequency.text(frequencyForDisplay);
			newNextArrival.text(nextTrain);
			newMinutesAway.text(difference);


			newTrain.append(newName);
			newTrain.append(newDestination);
			newTrain.append(newDepart);
			newTrain.append(newFrequency);
			newTrain.append(newNextArrival);
			newTrain.append(newMinutesAway);
			$('#tbody').prepend(newTrain);

		});