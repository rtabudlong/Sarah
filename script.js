let inventory = [];
let releaseLogs = [];  // To store all release logs

// Add Tool to Inventory
function addTool() {
    const toolName = document.getElementById('toolName').value.trim();
    const quantity = parseInt(document.getElementById('toolQuantity').value);
    
    if (toolName !== "" && !isNaN(quantity) && quantity > 0) {
        // Check if tool already exists in inventory
        const existingTool = inventory.find(tool => tool.name === toolName);
        
        if (existingTool) {
            existingTool.quantity += quantity;  // Increment the quantity
        } else {
            inventory.push({ name: toolName, quantity: quantity });
        }
        
        updateInventoryListDropdown();
        updateInventoryDropdown();
       // Clear the input fields after adding tool
        document.getElementById('toolName').value = '';
        document.getElementById('toolQuantity').value = '';
      
      
    } else {
        alert("Please enter a valid tool name and quantity.");
    }
}

// Release Tool
function releaseTool() {
    const selectedToolName = document.getElementById('inventoryDropdown').value;
    const employeeName = document.getElementById('employeeName').value.trim();
    const releaseDate = document.getElementById('releaseDate').value;
    const releaseQuantity = parseInt(document.getElementById('releaseQuantity').value);

    if (selectedToolName === "") {
        alert("Please select a tool from the dropdown.");
        return;
    }

    if (employeeName === "" || releaseDate === "" || isNaN(releaseQuantity) || releaseQuantity <= 0) {
        alert("Please enter valid details for release.");
        return;
    }

    const existingTool = inventory.find(tool => tool.name === selectedToolName);
    
    if (existingTool && existingTool.quantity >= releaseQuantity) {
        const remainingQuantity = existingTool.quantity - releaseQuantity;
        existingTool.quantity -= releaseQuantity;  // Decrease the quantity
        
        // Log the release action with remaining quantity
        const releaseLog = {
            toolName: selectedToolName,
            quantityReleased: releaseQuantity,
            employeeName: employeeName,
            releaseDate: releaseDate,
            remainingQuantity: remainingQuantity
        };
        releaseLogs.push(releaseLog);
        console.log("Tool Released:", releaseLog);

        if (existingTool.quantity === 0) {
            // Remove the tool from the inventory if quantity reaches 0
            inventory = inventory.filter(tool => tool.name !== selectedToolName);
        }

        updateInventoryListDropdown();
        updateInventoryDropdown();
        updateReleaseSummaryDropdown();
    } else {
        alert("Not enough quantity or tool not found.");
    }
}

// Save the current state of the application
function saveData() {
    const data = {
        inventory: inventory,
        releaseLogs: releaseLogs
    };
    
    localStorage.setItem('toolManagementData', JSON.stringify(data));  // Save data to localStorage
    alert("Data saved successfully!");
}

// Load saved data
function loadData() {
    const savedData = localStorage.getItem('toolManagementData');
    
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        inventory = parsedData.inventory || [];
        releaseLogs = parsedData.releaseLogs || [];
        
        updateInventoryListDropdown();
        updateInventoryDropdown();
        updateReleaseSummaryDropdown();
        alert("Data loaded successfully!");
    } else {
        alert("No saved data found.");
    }
}

// Update the Inventory Dropdown
function updateInventoryDropdown() {
    const dropdown = document.getElementById('inventoryDropdown');
    dropdown.innerHTML = '<option value="">Select Tool</option>';  // Reset the dropdown

    if (inventory.length > 0) {
        inventory.forEach(tool => {
            const option = document.createElement('option');
            option.value = tool.name;
            option.textContent = `${tool.name} (Quantity: ${tool.quantity})`;
            dropdown.appendChild(option);
        });
    } else {
        dropdown.innerHTML = '<option value="">No Tools Available</option>';
    }
}

// Update the Inventory List Dropdown
function updateInventoryListDropdown() {
    const dropdown = document.getElementById('inventoryListDropdown');
    dropdown.innerHTML = '';  // Reset the dropdown

    if (inventory.length > 0) {
        inventory.forEach(tool => {
            const option = document.createElement('option');
            option.value = tool.name;
            option.textContent = `${tool.name} (Quantity: ${tool.quantity})`;
            dropdown.appendChild(option);
        });
    } else {
        dropdown.innerHTML = '<option value="">No Tools Added</option>';
    }
}

// Update the Release Summary Dropdown
function updateReleaseSummaryDropdown() {
    const dropdown = document.getElementById('releaseSummaryDropdown');
    dropdown.innerHTML = '';  // Reset the dropdown

    if (releaseLogs.length > 0) {
        // Remove the "No releases yet" option if there are any releases
        releaseLogs.forEach((log, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${log.toolName} - Released: ${log.quantityReleased} | Employee: ${log.employeeName} | Date: ${log.releaseDate}`;
            dropdown.appendChild(option);
        });
    } else {
        dropdown.innerHTML = '<option>No releases yet</option>';  // Display if no releases have occurred
    }
}

// Clear the release summary
function clearReleaseSummary() {
    releaseLogs = [];  // Clear the release logs
    updateReleaseSummaryDropdown();
}

// Print Release Summary
function printReleaseSummary() {
    const releaseSummaryDropdown = document.getElementById('releaseSummaryDropdown');
    
    if (releaseSummaryDropdown.value === "") {
        alert("No release logs to print.");
        return;
    }
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Release Summary</title><style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
    printWindow.document.write('h1 { text-align: center; }');
    printWindow.document.write('ul { list-style-type: none; padding: 0; }');
    printWindow.document.write('li { margin: 10px 0; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Release Summary</h1>');
    printWindow.document.write('<ul>');
    
    releaseLogs.forEach(log => {
        printWindow.document.write(`<li>${log.toolName} - Released: ${log.quantityReleased} | Employee: ${log.employeeName} | Date: ${log.releaseDate} | Remaining Quantity: ${log.remainingQuantity}</li>`);
    });
    
    printWindow.document.write('</ul>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}
