function mudar_ondas() {
    ['at', 'clk', 's', 'e1', 'e2'].forEach(prefix => {
        const bits = Array.from({ length: 8 }, (_, i) => document.getElementById(`${prefix}_bit${i}`).value);
        const linhas_horizontais = Array.from({ length: 8 }, (_, i) => document.getElementById(`${prefix}_linha_bit${i}`));
        const linhas_verticais = Array.from({ length: 7 }, (_, i) => document.getElementById(`${prefix}_lv_${i}`));

        bits.forEach((bit, i) => {
            if (bit == 0) {
                linhas_horizontais[i].classList.add("linha_horizontal_0");
                linhas_horizontais[i].classList.remove("linha_horizontal_1");
            } else if (bit == 1) {
                linhas_horizontais[i].classList.add("linha_horizontal_1");
                linhas_horizontais[i].classList.remove("linha_horizontal_0");
            } else {
                console.log("Erro: número maior que 1 ou menor que 0");
            }
        });

        linhas_verticais.forEach((linha, i) => {
            const mesma_classe = 
                (linhas_horizontais[i].classList.contains("linha_horizontal_0") && linhas_horizontais[i + 1].classList.contains("linha_horizontal_0")) ||
                (linhas_horizontais[i].classList.contains("linha_horizontal_1") && linhas_horizontais[i + 1].classList.contains("linha_horizontal_1"));

            if (mesma_classe) {
                linha.classList.add("linha_vertical_invisivel");
            } else {
                linha.classList.remove("linha_vertical_invisivel");
            }
        });
    });
}

//------------------
const canvas = document.getElementById("waveCanvas");
const context = canvas.getContext("2d");
canvas.width = 1200; 
canvas.height = 600;

let pulseType = "positive"; // Tipo de pulso padrão

function drawWave(clockTime) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const midY = canvas.height / 2;
    const amplitude = 80;
    
    // Desenha os eixos X e Y
    context.beginPath();
    context.moveTo(50, 0);
    context.lineTo(50, canvas.height);
    context.moveTo(50, midY);
    context.lineTo(canvas.width, midY);
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();

    let x = 50;  // Começa a partir de 50px (depois do eixo Y)
    context.beginPath();
    context.moveTo(x, midY);

    // Converte tempo para pixels (escala: 1ms = 2px)
    const scale = 2;
    const pulseLength = clockTime * scale;

    while (x < canvas.width) {
        if (pulseType === "positive") {
            context.lineTo(x, midY - amplitude);
            x += pulseLength;
            context.lineTo(x, midY - amplitude);
            context.lineTo(x, midY);
        } else {
            context.lineTo(x, midY + amplitude);
            x += pulseLength;
            context.lineTo(x, midY + amplitude);
            context.lineTo(x, midY);
        }
    }

    context.strokeStyle = "red";
    context.lineWidth = 4;
    context.stroke();
}

function updateWave() {
    const clockTime = parseInt(document.getElementById("clockTime").value) || 100;
    drawWave(clockTime);
}

function selectPulse(type) {
    pulseType = type;
    updateWave();
}

// Configuração inicial
document.getElementById("clockTime").value = 100; // Valor padrão
updateWave(); // Desenha o gráfico inicial