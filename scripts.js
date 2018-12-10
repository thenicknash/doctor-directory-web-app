"use strict";


// Populate table on page load
var doctorDirectoryArray = JSON.parse( localStorage.getItem( 'doctorDirectory' ) );

if ( doctorDirectoryArray != null ) {
    populateTable();
}

// Execute once page is loaded
$( document ).ready( function () {

    // Add event listener to modal close button
    $( '.delete' ).click( function () {
        
        // Close the modal
        $( '.modal' ).removeClass( 'is-active' );
    });
});

// Add doctor button and click event
var addDoctorButton = $( '#addDoctorButton' );
addDoctorButton.click( function () {
    addDoctorToLocalStorage();
});

// Add a doctor to localStorage
function addDoctorToLocalStorage () {

    // Get pre-existing doctor directory
    var doctorDirectoryArray = JSON.parse( localStorage.getItem( 'doctorDirectory' ) );

    // Handling the last doctor ID
    var lastDoctorID;
    var newDoctorID;

    if ( doctorDirectoryArray == null || doctorDirectoryArray.length == 0 ) {
        doctorDirectoryArray = [];
        lastDoctorID = 0;
        newDoctorID = 0;
    }
    else {
        var lastDoctorObject = doctorDirectoryArray.slice( -1 );
        lastDoctorID = lastDoctorObject[ 0 ][ 'id' ];
        newDoctorID = Number( lastDoctorID ) + 1
    }

    // Get the values of the form
    var doctorName = $( '#doctorName' ).val();
    var city = $( '#city' ).val();
    var phone = $( '#phone' ).val();
    var fax = $( '#fax' ).val();

    // Validate the entries
    var addOrEdit = "add";
    // validateDoctorEntry( addOrEdit );

    // If false is the returned, the doctor entry will not be added
    if ( ! validateDoctorEntry( addOrEdit ) ) {
        return false;
    }

    // Build doctor object
    var doctor = {
        'id': newDoctorID,
        'doctorName': doctorName,
        'city': city,
        'phone': phone,
        'fax': fax,
        'display': 1
    };

    // Build the doctor directory array
    // var doctorDirectoryArray = [];
    doctorDirectoryArray.push( doctor );

    // Add doctor to the doctor directory
    localStorage.setItem( 'doctorDirectory', JSON.stringify( doctorDirectoryArray ) );

    // Update the table live
    populateTable();

    // Clear fields
    $( '#doctorName' ).val( "" );
    $( '#city' ).val( "" );
    $( '#phone' ).val( "" );
    $( '#fax' ).val( "" );

    // TESTING
    var doctorDirectory = JSON.parse( localStorage.getItem( 'doctorDirectory' ) );
}

// Function to populate table
function populateTable () {

    // Variables
    var tableBody = $( '#tableBody' );

    // Clear out table to avoid duplicates
    tableBody.html( "" );

    // Get data from localStorage
    var doctorDirectoryArray = JSON.parse( localStorage.getItem( 'doctorDirectory' ) );

    // Loop over array
    for ( var i = 0; i < doctorDirectoryArray.length; i++ ) {

        // Loop variables
        let doctorID = doctorDirectoryArray[ i ][ 'id' ];
        let display = doctorDirectoryArray[ i ][ 'display' ];

        // If display is 0, skip item
        if ( display == 0 ) {
            continue;
        }

        // Append to the table body
        tableBody.append(`
            <tr>
                <td>${ doctorDirectoryArray[ i ][ 'doctorName' ] }</td>
                <td>${ doctorDirectoryArray[ i ][ 'city' ] }</td>
                <td>${ doctorDirectoryArray[ i ][ 'phone' ] }</td>
                <td>${ doctorDirectoryArray[ i ][ 'fax' ] }</td>
                <td class="has-text-centered">
                    <button id="editDoctor_${ doctorID }" class="button is-info edit-button">Edit</button>
                </td>
                <td class="has-text-centered">
                    <button id="deleteDoctor_${ doctorID }" class="button is-danger delete-button">Delete</button>
                </td>
            </tr>
        `);
    }

    // Add event listeners
    addEventListeners();
}

// Add event listeners
function addEventListeners () {

    // Add event listeners to edit buttons
    $( '.edit-button' ).each( function () {
        $( this ).click( function () {
            var doctorDirectoryArray = JSON.parse( localStorage.getItem( 'doctorDirectory' ) );
            var doctorHTMLID = $( this )[ 0 ][ 'id' ];
            var doctorID = doctorHTMLID.substring( 11 );
            var doctorArrayIndex = Number( doctorID );
            editDoctor( doctorArrayIndex );
        });
    });

    // Add event listeners to delete buttons
    $( '.delete-button' ).each( function () {
        $( this ).click( function () {
            var doctorDirectoryArray = JSON.parse( localStorage.getItem( 'doctorDirectory' ) );
            var doctorHTMLID = $( this )[ 0 ][ 'id' ];
            var doctorID = doctorHTMLID.substring( 13 );
            var doctorArrayIndex = Number( doctorID );
            deleteDoctor( doctorArrayIndex );
        });
    });
}

// Editing a doctor's information
function editDoctor ( doctorArrayIndex ) {

    // Load the doctor directory array
    let doctorDirectoryArray = JSON.parse( localStorage.getItem( 'doctorDirectory' ) );

    // The selected doctor object
    let thisDoctorObject = doctorDirectoryArray[ doctorArrayIndex ];

    // Pre-filling fields with doctor's info
    var sameDoctorID = thisDoctorObject[ 'id' ];
    $( '#editDoctorName' ).val( thisDoctorObject[ 'doctorName' ] );
    $( '#editCity' ).val( thisDoctorObject[ 'city' ] );
    $( '#editPhone' ).val( thisDoctorObject[ 'phone' ] );
    $( '#editFax' ).val( thisDoctorObject[ 'fax' ] );

    // Add event listener to the save changes button
    $( '#updateDoctor' ).click( function () {

        // Delete current edition of selected doctor
        // deleteDoctor( doctorArrayIndex );
        doctorDirectoryArray.splice( doctorArrayIndex, 1 );

        // Get updated values
        let doctorName = $( '#editDoctorName' ).val();
        let city = $( '#editCity' ).val();
        let phone = $( '#editPhone' ).val();
        let fax = $( '#editFax' ).val();

        // Build updated doctor object
        let updatedDoctor = {
            'id': sameDoctorID,
            'doctorName': doctorName,
            'city': city,
            'phone': phone,
            'fax': fax
        };

        // Add updated object to the doctor directory array
        doctorDirectoryArray.splice( doctorArrayIndex, 0, updatedDoctor );

        // Update doctor directory
        localStorage.setItem( 'doctorDirectory', JSON.stringify( doctorDirectoryArray ) );

        // Repopulate table
        populateTable();

        // Close modal for editing
        $( '.modal' ).removeClass( 'is-active' );
    });

    // Open modal for editing
    $( '.modal' ).addClass( 'is-active' );
}

// Deleting a doctor from localStorage
function deleteDoctor ( doctorArrayIndex ) {

    // Load the doctor directory array
    let doctorDirectoryArray = JSON.parse( localStorage.getItem( 'doctorDirectory' ) );

    // Turn off display for specific doctor entry
    doctorDirectoryArray[ doctorArrayIndex ][ 'display' ] = 0;

    // Update doctor directory
    localStorage.setItem( 'doctorDirectory', JSON.stringify( doctorDirectoryArray ) );

    // Repopulate table
    populateTable();
}

// Search bar functionality
$( '#searchBarInput' ).keyup( function () {

    // The user entered value
    var value = $( this ).val().toLowerCase();
    
    // Filter out rows that do not match the text of the variable value
    $( "#tableBody tr" ).filter( function () {
      $( this ).toggle( $( this ).text().toLowerCase().indexOf( value ) > -1 );
    });
});

// Error check adding or editing doctor
function validateDoctorEntry ( addOrEdit ) {

    // if ( addOrEdit )
    if ( addOrEdit == "add" ) {
        
        // Get the values of the form
        var doctorName = $( '#doctorName' ).val();
        var city = $( '#city' ).val();
        var phone = $( '#phone' ).val();
        var fax = $( '#fax' ).val();

        // No blank fields
        if ( doctorName.trim() == "" || city.trim() == "" || phone.trim() == "" || fax.trim() == "" ) {
            alert( "You cannot enter any blank fields" );
            return false;
        }
        else {
            return true;
        }
    }
    else {
        
    }
}