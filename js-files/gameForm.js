window.addEventListener('load', function() {
    console.log('page loaded');

    const eventNameEl = document.querySelector('#eventName');

    eventNameEl.addEventListener('change', function() {
        const selectedOption = findSelectedOption();
        const dateFirstOption = document.querySelector('#gameDate > option').innerHTML;

        if (dateFirstOption == 'Please select a date' && selectedOption != '') {
            deleteGameDates();
            findDateOptions(selectedOption);
        } else {
            if (selectedOption == '') {
                deleteGameDates();
                dateFirstOption.innerHTML = 'Please select an event';
            } else {
                findDateOptions(selectedOption);
            }
        } 
    });
});

function findSelectedOption() {
    const eventNameEl = document.querySelector('#eventName');
    const selectOptions = eventNameEl.options;
    let selectedOption = '';

    for (x=0; x < selectOptions.length; x++) {
        if (selectOptions[x].selected) {
            if (selectOptions[x].value == '') {
                selectedOption = selectOptions[x].value;
            } else {
                selectedOption = selectOptions[x].attributes.id.value;
            }
        }
    }

    return selectedOption;
}

function findDateOptions(selectedOption) {
    const eventID = selectedOption
        .split('-')
        .filter(char => parseInt(char))
        .join('');

    setGameDates(eventID);
}

function setGameDates(eventID) {
    let gameDates = [];

    fetch(`php-files/gameDates.php?eventID=${eventID}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((response) => {
        gameDates = findAllDates(response);
        makeDateOptions(gameDates);
    });
}

function findAllDates(dateArray) {
    let allDates = [];
    let [year1, month1, day1] = dateArray[0].split('-');
    let currentDate = new Date(year1, month1 - 1, day1);
    let [year2, month2, day2] = dateArray[1].split('-');
    let endDate = new Date(year2, month2 - 1, day2);

    const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
      
    while (currentDate <= endDate) {
        allDates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
    }

    allDates = allDates.map(date => {
        return date.toDateString();
    });
    
    return allDates;
}

function makeDateOptions(gameDates) {
    const dateSelect = document.querySelector('#gameDate');

    const defaultOption = dateSelect.querySelector('#gameDate > option');
    defaultOption.innerHTML = 'Please select a date';

    gameDates.forEach(date => {
        const newOption = document.createElement('option');

        let formattedDate = new Date(date);
        let year = formattedDate.getFullYear();
        let month = formattedDate.getMonth() + 1;
        let day = formattedDate.getDate();
        formattedDate = `${year}-${month}-${day}`;

        newOption.value = formattedDate;
        newOption.innerHTML = date;
        dateSelect.appendChild(newOption);
    });
}

function deleteGameDates() {
    const dateSelect = document.querySelector('#gameDate');
    const dateOptions = dateSelect.querySelectorAll('option');

    dateOptions.forEach(option => {
        if (option.innerHTML != 'Please select a date') {
            option.remove();
        } else {
            option.innerHTML = 'Please select an event';
        }
    });
}