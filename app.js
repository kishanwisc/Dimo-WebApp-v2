async function fetchCarData() {
    const tokenId = document.getElementById('tokenInput').value;
    const query = `
        query {
            vehicle(tokenId: ${tokenId}) {
                id
                name
                dcn {
                    name
                }
                definition {
                    make
                    model
                    year
                }
            }
        }
    `;

    try {
        console.log('GraphQL Query:', query);

        const response = await fetch('http://localhost:8010/proxy/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const responseText = await response.text();
        console.log('Response Status:', response.status);
        console.log('Response Status Text:', response.statusText);
        console.log('Response Headers:', response.headers);
        console.log('Response Text:', responseText);

        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            displayError('Network response was not ok: ' + response.statusText + ' - ' + responseText);
            return;
        }

        try {
            const result = JSON.parse(responseText);
            console.log('Fetch result:', result);

            if (result.errors) {
                console.error('GraphQL errors:', result.errors);
                displayError('GraphQL errors: ' + result.errors.map(err => err.message).join(', '));
            } else if (result.data && result.data.vehicle) {
                displayCarData(result.data.vehicle);
            } else {
                displayError('No data found for the given token ID.');
            }
        } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            displayError('Error parsing JSON response.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        displayError('Fetch error: ' + error.message);
    }
}

function displayCarData(data) {
    const carDataDiv = document.getElementById('carData');
    carDataDiv.innerHTML = `
        <h2>Car Data</h2>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>DCN Name:</strong> ${data.dcn.name}</p>
        <p><strong>Make:</strong> ${data.definition.make}</p>
        <p><strong>Model:</strong> ${data.definition.model}</p>
        <p><strong>Year:</strong> ${data.definition.year}</p>
    `;
}

function displayError(message) {
    const carDataDiv = document.getElementById('carData');
    carDataDiv.innerHTML = `<p>${message}</p>`;
}
