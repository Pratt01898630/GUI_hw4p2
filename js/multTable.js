/*
File: multTable.js
GUI Assignment: Creating an Interactive Dynamic Table
Aaron Pratt, Created on October 25, 2023
Email: aaron_pratt@student.uml.edu
Description: Contains all JavaScript code for receiving user input and generating multiplication table, implementing sliders, and storing/deleting tabs
*/

// wait for the DOM to be ready before accessing elements
$(document).ready(function () {
  // get references to the HTML elements
  const minColumnInput = $('#min-column');
  const maxColumnInput = $('#max-column');
  const minRowInput = $('#min-row');
  const maxRowInput = $('#max-row');
  const table = $('#multiplication-table');
  const submitButton = $('#submit-button');
  const saveButton = $('#save-table');
  const deleteAllButton = $('#delete-all-tables');
  const tabs = $("#tabs");
  let tableCount = 1; // initialize table count

  // add validation method for columns
  $.validator.addMethod('minMaxColumns', function () {
    const minColumn = parseInt(minColumnInput.val());
    const maxColumn = parseInt(maxColumnInput.val());
    return minColumn <= maxColumn;
  }, 'Minimum column value must be less than or equal to maximum column value');

  // add validation method for rows
  $.validator.addMethod('minMaxRows', function () {
    const minRow = parseInt(minRowInput.val());
    const maxRow = parseInt(maxRowInput.val());
    return minRow <= maxRow;
  }, 'Minimum row value must be less than or equal to maximum row value');

  // validation rules
  $("#table-form").validate({
    rules: {
      'min-column': {
        required: true,
        range: [-50, 50]
      },
      'max-column': {
        required: true,
        range: [-50, 50],
        minMaxColumns: true
      },
      'min-row': {
        required: true,
        range: [-50, 50]
      },
      'max-row': {
        required: true,
        range: [-50, 50],
        minMaxRows: true
      }
    },
    messages: {
      'min-column': {
        required: "Please enter a value",
        range: "Value must be between -50 and 50"
      },
      'max-column': {
        required: "Please enter a value",
        range: "Value must be between -50 and 50",
        minMaxColumns: "Minimum column value must be less than or equal to maximum column value"
      },
      'min-row': {
        required: "Please enter a value",
        range: "Value must be between -50 and 50"
      },
      'max-row': {
        required: "Please enter a value",
        range: "Value must be between -50 and 50",
        minMaxRows: "Minimum row value must be less than or equal to maximum row value"
      }
    },
    submitHandler: function (form) {
      generateTable();
    }
  });

  // function to update sliders and generate table
  function updateSlidersAndGenerateTable() {
    $(".slider").each(function () {
      const value = $(this).siblings('input').val();
      $(this).slider("value", value);
    });

    // manually trigger validation when the sliders change
    $("#table-form").valid();

    generateTable();
  }

  // set up sliders
  $(".slider").slider({
    range: "min",
    min: -50,
    max: 50,
    slide: function (event, ui) {
      $(this).siblings('input').val(ui.value);

      // update sliders and generate table when slider changes
      updateSlidersAndGenerateTable();
    }
  });

  // handle manual input changes
  $("#table-form input").on('input', function () {
    updateSlidersAndGenerateTable();
  });

  // set up jQuery UI Tabs
  tabs.tabs();

  // save the current table
  saveButton.on('click', function () {
    // check if the form is valid before saving
    if ($("#table-form").valid()) {
      const tabLabel = `Table ${tableCount}: ${minColumnInput.val()}, ${maxColumnInput.val()}, ${minRowInput.val()}, ${maxRowInput.val()}`;
      tableCount++;
  
      // add a class to the dynamically created tab
      tabs.find("ul").append(`<li class="saved-tab"><a href="#tabs-${tableCount}">${tabLabel}</a> <button class="delete-table">Delete</button></li>`);
      tabs.append(`<div id="tabs-${tableCount}"></div>`);
      const clonedTable = table.clone();
      clonedTable.attr('id', `table-${tableCount}`);
      clonedTable.addClass('saved-table');
      $(`#tabs-${tableCount}`).append(clonedTable);
      tabs.tabs("refresh");
    }
  });

   // delete individual table
   tabs.on('click', '.delete-table', function () {
    const tab = $(this).closest('li');
    const tabId = tab.find('a').attr('href');
    $(tabId).remove(); 
    tab.remove();
    tabs.tabs("refresh");
  });

  // delete all saved tables
  deleteAllButton.on('click', function () {
    // remove tabs with the class "saved-tab"
    tabs.find(".saved-tab").each(function () {
      const tabId = $(this).find('a').attr('href');
      $(tabId).remove();
    });

    tabs.find(".saved-tab").remove();
    tabs.tabs("refresh");
    tableCount = 1;
  });

  function generateTable() {
    // retrieve input values
    const minColumn = parseInt(minColumnInput.val());
    const maxColumn = parseInt(maxColumnInput.val());
    const minRow = parseInt(minRowInput.val());
    const maxRow = parseInt(maxRowInput.val());

    table.html('');

    // generate table only if the form is valid
    if ($("#table-form").valid()) {
      for (let i = minRow - 1; i <= maxRow; i++) {
        // creates a new row
        const row = $('<tr>');

        for (let j = minColumn - 1; j <= maxColumn; j++) {
          // creates a new element in the table
          const element = $('<td>');
          if (i === minRow - 1 && j === minColumn - 1) {
            // set the top-left cell to empty
            element.text('');
          } else if (i === minRow - 1) {
            // if in the first row (except the top-left cell), set to j
            element.text(j);
          } else if (j === minColumn - 1) {
            // if in the first column (except the top-left cell), set to i
            element.text(i);
          } else {
            // set other cells to i * j
            element.text(i * j);
          }
          // add element to row
          row.append(element);
        }
        // add row to table
        table.append(row);
      }
    }
  }
});
