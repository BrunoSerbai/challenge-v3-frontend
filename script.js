document.getElementById('volumeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const placa = document.getElementById('placa').value.toUpperCase();
    const volume = document.getElementById('volume').value;
    const csvFile = document.getElementById('csv').files[0];
    
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    
    try {
        let data;
        
        if (csvFile) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const csvText = e.target.result;
                const rows = csvText.split('\n').slice(1);
                
                for (const row of rows) {
                    const [placa, volume] = row.split(',');
                    if (placa && volume) {
                        try {
                            const response = await fetch('https://challenge-v3.brunoserbai.org/api/dispositivos', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    placa: placa.trim(),
                                    volume: parseInt(volume.trim())
                                })
                            });
                            
                            const rowData = await response.json();
                            data = data ? [...data, rowData] : [rowData];
                        } catch (error) {
                            console.error('Erro ao processar linha:', error);
                        }
                    }
                }
                
                if (data) {
                    resultDiv.className = 'success';
                    resultDiv.textContent = JSON.stringify(data, null, 2);
                } else {
                    resultDiv.className = 'error';
                    resultDiv.textContent = 'Nenhum dado processado';
                }
            };
            
            reader.onerror = function() {
                resultDiv.className = 'error';
                resultDiv.textContent = 'Erro ao ler arquivo CSV';
            };
            
            reader.readAsText(csvFile);
        } else {
            const response = await fetch('https://challenge-v3.brunoserbai.org/api/dispositivos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    placa,
                    volume: parseInt(volume)
                })
            });
            
            data = await response.json();
            
            if (response.ok) {
                resultDiv.className = 'success';
                resultDiv.textContent = JSON.stringify(data, null, 2);
            } else {
                resultDiv.className = 'error';
                resultDiv.textContent = JSON.stringify(data, null, 2);
            }
        }
    } catch (error) {
        resultDiv.className = 'error';
        resultDiv.textContent = 'Erro ao processar: ' + error.message;
    }
});

function clearCSV() {
    document.getElementById('csv').value = '';
}
    