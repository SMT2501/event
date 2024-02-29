let cartItems = [];
let totalPrice = 0;


function buyTicket(name, price, isVip) {
    const quantityInputId = isVip ? 'vip-quantity' : 'quantity'; // Determine which quantity input to use
    const quantity = parseInt(document.getElementById(quantityInputId).value);
    const totalCost = price * quantity;
    cartItems.push({ name, price, quantity, totalCost });
    totalPrice += totalCost;
    updateCart();
}


function updateCart() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - R${item.price} x ${item.quantity} = R${item.totalCost}`;
        cartList.appendChild(li);
    });
    document.getElementById('total-price').textContent = `Total: R${totalPrice}`;
}

function checkout() {
    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Define colors
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff']; // Add more colors as needed

    // Loop through each ticket item
    cartItems.forEach((item, index) => {
        // Add a new page for each group of tickets (except the first one)
        if (index > 0) {
            pdf.addPage();
        }

        // Add ticket details
        pdf.setTextColor(colors[index % colors.length]); // Set text color
        pdf.text(`Ticket: ${item.name}`, 10, 20);
        pdf.text(`Price: R${item.price}`, 10, 30);
        pdf.text(`Quantity: ${item.quantity}`, 10, 40);

        // Add barcode list for the current ticket
        for (let i = 0; i < item.quantity; i++) {
            const barcodeId = `barcode-${index}-${i}`;
            const barcodeCanvas = document.createElement('canvas');
            const barcodeText = 'Ghost Nation Festival'; // Text to encode into the barcode
            JsBarcode(barcodeCanvas, barcodeText, { format: "CODE128", displayValue: false });

            // Add the barcode to the PDF
            const imageData = barcodeCanvas.toDataURL("image/jpeg"); // Change format to JPEG
            const barcodeX = 10; // Adjust as needed
            const barcodeY = 50 + i * 40; // Adjust as needed
            const barcodeWidth = 100; // Adjust as needed
            const barcodeHeight = 20; // Adjust as needed
            pdf.addImage(imageData, 'JPEG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);

            // Add label for the barcode number
            pdf.text(`Barcode ${i + 1}`, barcodeX + barcodeWidth + 10, barcodeY + 10);
        }
    });

    // Save the PDF as a file
    pdf.save('tickets.pdf');

    // Alert the user about the total price and reset the cart
    alert(`Total Price: R${totalPrice}\nTickets downloaded as PDF.`);
    cartItems = [];
    totalPrice = 0;
    updateCart();
}


function generateTicketContent() {
    let ticketContent = '';

    cartItems.forEach(item => {
        ticketContent += `Ticket: ${item.name}, Price: R${item.price}, Quantity: ${item.quantity}\n`;
    });

    return ticketContent;
}

